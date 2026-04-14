"""
Search API — Hybrid fusion search endpoints.

Supports semantic, keyword, and fused (RRF) search modes
with SQL-style metadata filtering.
"""

from __future__ import annotations

import time
from typing import Any

from fastapi import APIRouter
from pydantic import BaseModel, Field

from core import store
from core.embeddings import embed_text
from core.fusion import reciprocal_rank_fusion

router = APIRouter(prefix="/api/search", tags=["search"])


class SearchFilters(BaseModel):
    zone: str | None = None
    priority_level: str | None = None
    data_type: list[str] | None = None
    inventory_check: bool = False
    exclude_allergies: list[str] | None = None
    category: str | None = None


class SearchRequest(BaseModel):
    query: str
    filters: SearchFilters = Field(default_factory=SearchFilters)
    search_mode: str = "hybrid_fusion"  # semantic | keyword | hybrid_fusion
    top_k: int = 10
    collections: list[str] = Field(default_factory=lambda: ["protocols", "field_data"])


class SearchResultItem(BaseModel):
    id: str
    score: float
    title: str
    content_preview: str
    data_type: str
    source: str
    metadata: dict[str, Any]
    match_type: str


class SearchResponse(BaseModel):
    results: list[SearchResultItem]
    query_time_ms: float
    total_results: int
    fusion_method: str
    filters_applied: list[str]


@router.post("", response_model=SearchResponse)
@router.post("/", response_model=SearchResponse)
async def hybrid_search(req: SearchRequest) -> SearchResponse:
    """Unified search endpoint with mode selection."""
    start = time.perf_counter()

    filters_dict = req.filters.model_dump(exclude_none=True)
    # Remove falsy filter values
    filters_dict = {k: v for k, v in filters_dict.items() if v}
    applied_filters = list(filters_dict.keys())

    all_results = []

    for collection in req.collections:
        if req.search_mode in ("semantic", "hybrid_fusion"):
            query_vec = embed_text(req.query)
            sem_results, _ = store.semantic_search(
                query_vec, collection=collection, top_k=req.top_k, filters=filters_dict
            )
            if req.search_mode == "semantic":
                all_results.extend(sem_results)
                continue

        if req.search_mode in ("keyword", "hybrid_fusion"):
            kw_results, _ = store.keyword_search(
                req.query, collection=collection, top_k=req.top_k, filters=filters_dict
            )
            if req.search_mode == "keyword":
                all_results.extend(kw_results)
                continue

        if req.search_mode == "hybrid_fusion":
            fused = reciprocal_rank_fusion(sem_results, kw_results, top_k=req.top_k)
            all_results.extend(fused)

    # Deduplicate and re-sort across collections
    seen = set()
    unique_results = []
    for r in sorted(all_results, key=lambda x: x.score, reverse=True):
        if r.id not in seen:
            seen.add(r.id)
            unique_results.append(r)

    elapsed_ms = round((time.perf_counter() - start) * 1000, 2)

    return SearchResponse(
        results=[
            SearchResultItem(
                id=r.id,
                score=r.score,
                title=r.title,
                content_preview=r.content_preview,
                data_type=r.data_type,
                source=r.source,
                metadata=r.metadata,
                match_type=r.match_type,
            )
            for r in unique_results[: req.top_k]
        ],
        query_time_ms=elapsed_ms,
        total_results=len(unique_results),
        fusion_method=req.search_mode,
        filters_applied=applied_filters,
    )
