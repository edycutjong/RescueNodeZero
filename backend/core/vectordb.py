"""
VectorDB Adapter — re-exports from __init__.py.
"""
from core import VectorStore, Document, SearchResult, store

__all__ = ["VectorStore", "Document", "SearchResult", "store"]
