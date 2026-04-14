from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_search_hybrid_fusion():
    payload = {
        "query": "fire incident",
        "search_mode": "hybrid_fusion",
        "top_k": 2,
        "collections": ["protocols", "field_data"]
    }
    response = client.post("/api/search", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "results" in data
    assert "query_time_ms" in data
    assert data["fusion_method"] == "hybrid_fusion"

def test_search_duplicates():
    from unittest.mock import patch
    from core import SearchResult
    with patch("core.vectordb.VectorStore.semantic_search") as mock_sem, \
         patch("core.vectordb.VectorStore.keyword_search") as mock_kw:
        mock_sem.return_value = ([SearchResult(id="dup", score=0.9, title="T", content_preview="C", source="S", data_type="text", metadata={})], 1)
        mock_kw.return_value = ([SearchResult(id="dup", score=0.8, title="T", content_preview="C", source="S", data_type="text", metadata={})], 1)
        
        payload = {
            "query": "dup",
            "search_mode": "hybrid_fusion",
            "top_k": 10,
            "collections": ["protocols", "field_data"]
        }
        res = client.post("/api/search", json=payload)
        assert len(res.json()["results"]) == 1

def test_search_semantic_only():
    payload = {
        "query": "medical emergency",
        "search_mode": "semantic",
        "top_k": 3,
        "collections": ["protocols"]
    }
    response = client.post("/api/search/", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "results" in data
    assert data["fusion_method"] == "semantic"

def test_search_with_filters():
    payload = {
        "query": "chemical spill",
        "search_mode": "keyword",
        "top_k": 5,
        "collections": ["protocols"],
        "filters": {
            "zone": "Sector 7G",
            "priority_level": "critical"
        }
    }
    response = client.post("/api/search", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "filters_applied" in data
    assert "zone" in data["filters_applied"]
    assert "priority_level" in data["filters_applied"]
