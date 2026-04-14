from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "operational"
    assert data["mode"] == "offline"
    assert "vectordb" in data

def test_stats():
    response = client.get("/api/stats")
    assert response.status_code == 200
    data = response.json()
    assert "collections" in data
    assert "total_documents" in data

def test_inventory():
    response = client.get("/api/inventory")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total_items" in data
    assert "low_stock_count" in data
