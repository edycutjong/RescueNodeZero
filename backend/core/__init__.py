"""
VectorDB Adapter — In-memory implementation.

Provides the VectorStore interface for storing and searching vectors.
This in-memory implementation will be replaced with the real Actian
VectorAI DB SDK once Docker access is confirmed.
"""

from __future__ import annotations

import uuid
import time
from dataclasses import dataclass, field
from typing import Any

import numpy as np


@dataclass
class Document:
    """A stored document with metadata and vector embeddings."""
    id: str
    content: str
    title: str = ""
    vector: np.ndarray | None = None
    metadata: dict[str, Any] = field(default_factory=dict)
    data_type: str = "TEXT"  # TEXT | PHOTO | AUDIO
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
    match_type: str = "semantic"  # semantic | keyword | fused


class VectorStore:
    """
    In-memory vector store implementing the VectorAI DB interface.
    
    Supports:
    - Insert with vector embeddings
    - Semantic search (cosine similarity)
    - Keyword search (substring matching)
    - Filtered search (SQL-style WHERE on metadata)
    """

    def __init__(self) -> None:
        self.collections: dict[str, dict[str, Document]] = {
            "protocols": {},
            "field_data": {},
            "inventory": {},
        }

    def insert(self, doc: Document) -> str:
        """Insert a document into a collection."""
        if not doc.id:
            doc.id = str(uuid.uuid4())
        collection = self.collections.get(doc.collection, {})
        collection[doc.id] = doc
        self.collections[doc.collection] = collection
        return doc.id

    def insert_batch(self, docs: list[Document]) -> list[str]:
        """Insert multiple documents."""
        return [self.insert(doc) for doc in docs]

    def semantic_search(
        self,
        query_vector: np.ndarray,
        collection: str = "protocols",
        top_k: int = 10,
        filters: dict[str, Any] | None = None,
    ) -> tuple[list[SearchResult], float]:
        """
        Semantic search using cosine similarity.
        Returns (results, query_time_ms).
        """
        start = time.perf_counter()

        docs = list(self.collections.get(collection, {}).values())
        docs = self._apply_filters(docs, filters)

        scored: list[tuple[Document, float]] = []
        for doc in docs:
            if doc.vector is not None:
                sim = self._cosine_similarity(query_vector, doc.vector)
                scored.append((doc, float(sim)))

        scored.sort(key=lambda x: x[1], reverse=True)
        results = [
            SearchResult(
                id=doc.id,
                score=round(score, 4),
                title=doc.title,
                content_preview=doc.content[:200],
                data_type=doc.data_type,
                source=collection,
                metadata=doc.metadata,
                match_type="semantic",
            )
            for doc, score in scored[:top_k]
        ]

        elapsed_ms = (time.perf_counter() - start) * 1000
        return results, round(elapsed_ms, 2)

    def keyword_search(
        self,
        query: str,
        collection: str = "protocols",
        top_k: int = 10,
        filters: dict[str, Any] | None = None,
    ) -> tuple[list[SearchResult], float]:
        """
        Keyword search using substring matching.
        Returns (results, query_time_ms).
        """
        start = time.perf_counter()
        query_lower = query.lower()
        terms = query_lower.split()

        docs = list(self.collections.get(collection, {}).values())
        docs = self._apply_filters(docs, filters)

        scored: list[tuple[Document, float]] = []
        for doc in docs:
            content_lower = (doc.content + " " + doc.title).lower()
            # Score based on term frequency
            score = 0.0
            for term in terms:
                if term in content_lower:
                    score += content_lower.count(term) / max(len(content_lower.split()), 1)
            if score > 0:
                scored.append((doc, score))

        scored.sort(key=lambda x: x[1], reverse=True)
        results = [
            SearchResult(
                id=doc.id,
                score=round(score, 4),
                title=doc.title,
                content_preview=doc.content[:200],
                data_type=doc.data_type,
                source=collection,
                metadata=doc.metadata,
                match_type="keyword",
            )
            for doc, score in scored[:top_k]
        ]

        elapsed_ms = (time.perf_counter() - start) * 1000
        return results, round(elapsed_ms, 2)

    def get_collection_stats(self) -> dict[str, int]:
        """Get document counts for all collections."""
        return {name: len(docs) for name, docs in self.collections.items()}

    def get_inventory(self) -> list[dict[str, Any]]:
        """Get all inventory items."""
        items = []
        for doc in self.collections.get("inventory", {}).values():
            items.append({
                "id": doc.id,
                "name": doc.title,
                "category": doc.metadata.get("category", ""),
                "quantity": doc.metadata.get("quantity", 0),
                "zone": doc.metadata.get("zone", ""),
            })
        return items

    def _apply_filters(
        self, docs: list[Document], filters: dict[str, Any] | None
    ) -> list[Document]:
        """Apply SQL-style WHERE filters on metadata."""
        if not filters:
            return docs

        filtered = docs

        # Zone filter
        if zone := filters.get("zone"):
            filtered = [d for d in filtered if d.metadata.get("zone") == zone]

        # Priority filter
        if priority := filters.get("priority_level"):
            filtered = [d for d in filtered if d.metadata.get("priority_level") == priority]

        # Data type filter
        if data_types := filters.get("data_type"):
            if isinstance(data_types, list):
                filtered = [d for d in filtered if d.data_type in data_types]
            else:
                filtered = [d for d in filtered if d.data_type == data_types]

        # Inventory check filter
        if filters.get("inventory_check"):
            filtered = [
                d for d in filtered
                if d.metadata.get("equipment_available", True)
            ]

        # Allergy exclusion filter
        if allergies := filters.get("exclude_allergies"):
            if isinstance(allergies, list):
                filtered = [
                    d for d in filtered
                    if not any(
                        a.lower() in [c.lower() for c in d.metadata.get("contraindications", [])]
                        for a in allergies
                    )
                ]

        # Category filter
        if category := filters.get("category"):
            filtered = [d for d in filtered if d.metadata.get("category") == category]

        return filtered

    @staticmethod
    def _cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
        """Compute cosine similarity between two vectors."""
        norm_a = np.linalg.norm(a)
        norm_b = np.linalg.norm(b)
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return float(np.dot(a, b) / (norm_a * norm_b))


# Global store instance
store = VectorStore()
