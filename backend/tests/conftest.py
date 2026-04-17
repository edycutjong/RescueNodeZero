import pytest
from unittest.mock import MagicMock, patch

@pytest.fixture(autouse=True)
def mock_vectorai_client():
    """Globally mock the VectorAIClient and the already instantiated store.client."""
    with patch("core.vectordb.VectorAIClient") as MockClient:
        # Create a mock instance
        mock_instance = MagicMock()
        
        # Mock .points.query
        mock_points = MagicMock()
        mock_query_resp = MagicMock()
        mock_query_resp.id = "mock_id"
        mock_query_resp.score = 0.99
        mock_query_resp.payload = {"title": "Mock", "content": "Mock data", "data_type": "TEXT"}
        
        mock_points.query.return_value = [mock_query_resp]
        mock_instance.points = mock_points
        
        MockClient.return_value = mock_instance
        
        # Patch the globally instantiated store client directly
        import core.vectordb
        original_client = core.vectordb.store.client
        core.vectordb.store.client = mock_instance
        
        yield mock_instance
        
        # Restore original client
        core.vectordb.store.client = original_client
