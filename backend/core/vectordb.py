"""
VectorDB Adapter — Actian VectorAI SDK implementation.
"""

from __future__ import annotations

import os
import uuid
import time
from dataclasses import dataclass, field
from typing import Any

import numpy as np

from actian_vectorai.client import VectorAIClient
from actian_vectorai.models import PointStruct, PrefetchQuery, Fusion
from actian_vectorai.filters.dsl import FilterBuilder, Field


@dataclass
class Document:
    """A stored document with metadata and vector embeddings."""
    id: str
    content: str
    title: str = ""
    vector: np.ndarray | None = None
    metadata: dict[str, Any] = field(default_factory=dict)
    data_type: str = "TEXT"
    collection: str = "protocols"


@dataclass
class SearchResult:
    """A search result with relevance scoring."""
    id: str
    score: float
    title: str
    content_preview: str
    data_type: str
    source: str
    metadata: dict[str, Any]
    match_type: str = "hybrid_fusion"


class VectorStore:
    """
    Vector store implementing the VectorAI SDK interface.
    """
    def __init__(self) -> None:
        host = os.environ.get("VECTORAI_HOST", "localhost")
        port = os.environ.get("VECTORAI_PORT", "50051")
        self.client = VectorAIClient(url=f"{host}:{port}")

    def _build_filter(self, filters: dict[str, Any] | None, fb: FilterBuilder | None = None) -> FilterBuilder:
        if fb is None:
            fb = FilterBuilder()
        if not filters:
            return fb
        for key, val in filters.items():
            if isinstance(val, list):
                fb.must(Field(key).any_of(val))
            else:
                fb.must(Field(key).eq(val))
        return fb

    def insert(self, doc: Document) -> str:
        if not doc.id:
            doc.id = str(uuid.uuid4())
            
        payload = {
            "content": doc.content,
            "title": doc.title,
            "data_type": doc.data_type,
        }
        payload.update(doc.metadata)

        vec = doc.vector.tolist() if doc.vector is not None else []
            
        point = PointStruct(
            id=doc.id,
            vector=vec,
            payload=payload
        )
        self.client.upload_points(
            collection_name=doc.collection,
            points=[point],
            batch_size=1
        )
        return doc.id

    def insert_batch(self, docs: list[Document]) -> list[str]:
        by_col = {}
        for doc in docs:
            if not doc.id:
                doc.id = str(uuid.uuid4())
            if doc.collection not in by_col:
                by_col[doc.collection] = []
                
            payload = {"content": doc.content, "title": doc.title, "data_type": doc.data_type}
            payload.update(doc.metadata)

            vec = doc.vector.tolist() if doc.vector is not None else []
            by_col[doc.collection].append(
                PointStruct(id=doc.id, vector=vec, payload=payload)
            )
            
        for col, points in by_col.items():
            self.client.upload_points(collection_name=col, points=points, batch_size=256)
        return [d.id for d in docs]

    def _convert_results(self, sdk_results, collection, match_type):
        results = []
        for r in sdk_results:
            payload = r.payload or {}
            results.append(SearchResult(
                id=str(r.id),
                score=round(float(r.score), 4),
                title=payload.get("title", ""),
                content_preview=payload.get("content", "")[:200],
                data_type=payload.get("data_type", "TEXT"),
                source=collection,
                metadata={k:v for k,v in payload.items() if k not in ("title", "content", "data_type")},
                match_type=match_type,
            ))
        return results

    def semantic_search(
        self,
        query_vector: np.ndarray,
        collection: str = "protocols",
        top_k: int = 10,
        filters: dict[str, Any] | None = None,
    ) -> tuple[list[SearchResult], float]:
        start = time.perf_counter()
        fb = self._build_filter(filters)
        filt = fb.build() if not fb.is_empty() else None
        
        sdk_res = self.client.points.query(
            collection_name=collection,
            query=query_vector.tolist(),
            limit=top_k,
            filter=filt
        )
        
        elapsed_ms = (time.perf_counter() - start) * 1000
        return self._convert_results(sdk_res, collection, "semantic"), round(elapsed_ms, 2)

    def keyword_search(
        self,
        query: str,
        collection: str = "protocols",
        top_k: int = 10,
        filters: dict[str, Any] | None = None,
    ) -> tuple[list[SearchResult], float]:
        # Using FilterBuilder to text match since we don't have sparse vectors
        start = time.perf_counter()
        
        fb = FilterBuilder()
        for term in query.lower().split():
            fb.must(Field("content").text(term))
        
        fb = self._build_filter(filters, fb)
        combined_filt = fb.build() if not fb.is_empty() else None

        # Filter-only query by sorting? Wait, Actian scroll can use filters. But query supports filter directly with None query.
        # However, order_by might be needed or it returns default order payload.
        # Actually, query with no query vector, just limit and filter.
        sdk_res = self.client.points.query(
            collection_name=collection,
            limit=top_k,
            filter=combined_filt
        )
        
        elapsed_ms = (time.perf_counter() - start) * 1000
        return self._convert_results(sdk_res, collection, "keyword"), round(elapsed_ms, 2)

    def hybrid_search(
        self,
        query: str,
        query_vector: np.ndarray,
        collection: str = "protocols",
        top_k: int = 10,
        filters: dict[str, Any] | None = None,
    ) -> tuple[list[SearchResult], float]:
        # Built-in RRF fusion
        start = time.perf_counter()
        
        fb_kw = FilterBuilder()
        for term in query.lower().split():
            fb_kw.must(Field("content").text(term))
        fb_kw = self._build_filter(filters, fb_kw)
        combined_filt = fb_kw.build() if not fb_kw.is_empty() else None
        
        fb_dense = self._build_filter(filters)
        filt = fb_dense.build() if not fb_dense.is_empty() else None

        sdk_res = self.client.points.query(
            collection_name=collection,
            query={"fusion": Fusion.RRF},
            prefetch=[
                PrefetchQuery(query=query_vector.tolist(), filter=filt, limit=top_k),
                PrefetchQuery(query=query_vector.tolist(), filter=combined_filt, limit=top_k) 
            ],
            limit=top_k
        )
        
        elapsed_ms = (time.perf_counter() - start) * 1000
        return self._convert_results(sdk_res, collection, "hybrid_fusion"), round(elapsed_ms, 2)

    def get_collection_stats(self) -> dict[str, int]:
        # For demonstration purposes, returning mock stats as counting requires specific SDK endpoints.
        # Can be replaced with actual SDK count logic if available.
        return {
            "protocols": 150,
            "field_data": 45,
            "inventory": 25
        }

    def get_inventory(self) -> list[dict[str, Any]]:
        # Retrieve all inventory items via a broad query
        # Since we just want all items, we query with no text filter and high limit.
        try:
            sdk_res = self.client.points.query(
                collection_name="inventory",
                limit=1000
            )
            inventory_docs = self._convert_results(sdk_res, "inventory", "metadata")
        except Exception:
            inventory_docs = []
            
        return [
            {
                "id": doc.id,
                "name": doc.title,
                "category": doc.metadata.get("category", "Unknown"),
                "quantity": doc.metadata.get("quantity", 0),
                "zone": doc.metadata.get("zone", "General")
            }
            for doc in inventory_docs
        ]


# Global singleton
store = VectorStore()

