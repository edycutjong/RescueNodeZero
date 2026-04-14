from fastapi.testclient import TestClient
from unittest.mock import patch
import pytest
from main import app, lifespan
from core.vectordb import VectorStore

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["name"] == "RescueNode Zero"

@pytest.mark.asyncio
@patch("core.vectordb.VectorStore.get_collection_stats")
@patch("data.seed_protocols.seed_all")
async def test_lifespan_seed_empty(mock_seed_all, mock_stats):
    mock_stats.side_effect = [{"protocols": 0}, {"protocols": 10}]
    
    async with lifespan(app):
        # Should call seed_all when protocols == 0
        mock_seed_all.assert_called_once()
        print("Lifespan test inside context")

@pytest.mark.asyncio
@patch("core.vectordb.VectorStore.get_collection_stats")
@patch("data.seed_protocols.seed_all")
async def test_lifespan_seed_exists(mock_seed_all, mock_stats):
    # Already seeded
    mock_stats.return_value = {"protocols": 10}
    
    async with lifespan(app):
        mock_seed_all.assert_not_called()
