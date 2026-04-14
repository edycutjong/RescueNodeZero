"""
Embedding Service — Local text embeddings.

Uses all-MiniLM-L6-v2 (384-dim) when available, falls back to
deterministic hash-based mock embeddings for demo mode.
"""

from __future__ import annotations

import hashlib
import os

import numpy as np

EMBEDDING_DIM = 384
DEMO_MODE = os.getenv("DEMO_MODE", "true").lower() == "true"

# Try to load real model
_model = None
if not DEMO_MODE:
    try:
        from sentence_transformers import SentenceTransformer
        _model = SentenceTransformer("all-MiniLM-L6-v2")
        print("✅ Loaded real embedding model: all-MiniLM-L6-v2")
    except ImportError:
        print("⚠️  sentence-transformers not installed, using mock embeddings")


def embed_text(text: str) -> np.ndarray:
    """Encode text into a 384-dimensional vector."""
    if _model is not None:
        return _model.encode(text, normalize_embeddings=True)
    return _mock_embed(text)


def embed_batch(texts: list[str]) -> list[np.ndarray]:
    """Encode multiple texts into vectors."""
    if _model is not None:
        return list(_model.encode(texts, normalize_embeddings=True))
    return [_mock_embed(t) for t in texts]


def _mock_embed(text: str) -> np.ndarray:
    """
    Generate a deterministic pseudo-embedding from text.
    
    Uses SHA-256 hash to create reproducible vectors that maintain
    some degree of similarity for related texts. This allows the
    demo to show realistic search behavior without loading a 80MB model.
    """
    # Create a seed from the text hash
    text_hash = hashlib.sha256(text.lower().encode()).digest()
    seed = int.from_bytes(text_hash[:4], "big")
    rng = np.random.RandomState(seed)

    # Base vector from hash
    vec = rng.randn(EMBEDDING_DIM).astype(np.float32)

    # Add term-level signals for better keyword similarity
    words = set(text.lower().split())
    critical_terms = {
        "burn": 0, "chemical": 1, "hazmat": 2, "fire": 3,
        "medical": 4, "triage": 5, "treatment": 6, "protocol": 7,
        "penicillin": 8, "allergy": 9, "epinephrine": 10, "acetone": 11,
        "structural": 12, "collapse": 13, "rescue": 14, "emergency": 15,
        "radiation": 16, "toxic": 17, "spill": 18, "explosion": 19,
        "crush": 20, "fracture": 21, "bleeding": 22, "airway": 23,
        "decontamination": 24, "evacuation": 25, "ppe": 26, "scba": 27,
        "un-1090": 28, "sulfuric": 29, "chlorine": 30, "ammonia": 31,
    }
    for word in words:
        if word in critical_terms:
            idx = critical_terms[word]
            # Boost specific dimensions for domain terms
            vec[idx * 10: idx * 10 + 10] += 2.0

    # Normalize
    norm = np.linalg.norm(vec)
    if norm > 0:
        vec = vec / norm

    return vec
