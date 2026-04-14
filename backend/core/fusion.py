"""
Reciprocal Rank Fusion (RRF) — Merges multiple ranked result lists.

Combines semantic search and keyword search results into a single
unified ranking. Deterministic, requires no training.
"""

from __future__ import annotations

from core import SearchResult


def reciprocal_rank_fusion(
    *result_lists: list[SearchResult],
    k: int = 60,
    top_k: int = 10,
) -> list[SearchResult]:
    """
    Reciprocal Rank Fusion (RRF).
    
    Score = Σ 1 / (k + rank_i) for each result across all lists.
    
    Args:
        result_lists: Variable number of ranked result lists
        k: RRF constant (default 60, per original paper)
        top_k: Number of results to return
    
    Returns:
        Fused ranked list of SearchResults
    """
    scores: dict[str, float] = {}
    result_map: dict[str, SearchResult] = {}

    for result_list in result_lists:
        for rank, result in enumerate(result_list):
            rrf_score = 1.0 / (k + rank + 1)
            scores[result.id] = scores.get(result.id, 0.0) + rrf_score
            # Keep the result with highest individual score
            if result.id not in result_map or result.score > result_map[result.id].score:
                result_map[result.id] = result

    # Sort by fused score
    fused_ids = sorted(scores.keys(), key=lambda x: scores[x], reverse=True)

    results = []
    for rid in fused_ids[:top_k]:
        r = result_map[rid]
        results.append(
            SearchResult(
                id=r.id,
                score=round(scores[rid], 6),
                title=r.title,
                content_preview=r.content_preview,
                data_type=r.data_type,
                source=r.source,
                metadata=r.metadata,
                match_type="fused",
            )
        )

    return results
