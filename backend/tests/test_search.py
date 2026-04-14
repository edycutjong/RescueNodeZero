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
