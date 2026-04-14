import pytest
from unittest.mock import patch, MagicMock
import numpy as np

from core.embeddings import embed_text, embed_batch
from core.clip_svc import caption_image
from core.whisper_svc import transcribe_audio
from core.fusion import reciprocal_rank_fusion
from core.vectordb import VectorStore


def test_embed_text():
    with patch("core.embeddings._model") as mock_model:
        mock_model.encode.side_effect = lambda texts, **kw: np.zeros((384,)) if isinstance(texts, str) else [np.zeros((384,)) for _ in texts]
        # when _model is not mocked, it uses _mock_embed
        
        result1 = embed_text("test text")
        result2 = embed_batch(["test text 1", "test text 2"])
        
        assert len(result1) == 384
        assert len(result2) == 2

@pytest.mark.asyncio
async def test_caption_image():
    # test demo mode behavior
    with patch("core.clip_svc.DEMO_MODE", True):
        res1 = await caption_image("test_barrel.jpg")
        assert "Industrial chemical barrel" in res1
        
        res2 = await caption_image("test_fire.jpg")
        assert "Active structure fire" in res2

@pytest.mark.asyncio
async def test_transcribe_audio():
    with patch("core.whisper_svc._model") as mock_model:
        mock_model.transcribe.return_value = {"text": "emergency medical need"}
        
        # Test real model
        res_val = await transcribe_audio("test_hazmat.wav")
        assert res_val == "emergency medical need"
        
    # Test mock fallback when model is None
    with patch("core.whisper_svc.DEMO_MODE", True), patch("core.whisper_svc._model", None):
        res_demo = await transcribe_audio("test_hazmat.wav")
        assert "chemical spill" in res_demo
        
def test_reciprocal_rank_fusion():
    from core import SearchResult
    list1 = [
        SearchResult(id="doc1", score=0.9, title="Doc 1", content_preview="hello", data_type="TEXT", source="test", metadata={}, match_type="semantic"),
        SearchResult(id="doc2", score=0.8, title="Doc 2", content_preview="world", data_type="TEXT", source="test", metadata={}, match_type="semantic"),
    ]
    list2 = [
        SearchResult(id="doc2", score=0.95, title="Doc 2", content_preview="world", data_type="TEXT", source="test", metadata={}, match_type="keyword"),
        SearchResult(id="doc3", score=0.7, title="Doc 3", content_preview="test", data_type="TEXT", source="test", metadata={}, match_type="keyword"),
    ]
    
    results = reciprocal_rank_fusion(list1, list2, k=60)
    
    assert len(results) == 3
    # doc2 should be ranked highest because it's #2 in list1 and #1 in list2
    # doc1 is #1 in list1 and not in list2
    
    assert results[0].id == "doc2"
    assert results[1].id == "doc1"
    assert results[2].id == "doc3"

def test_vectordb_init():
    store = VectorStore()
    assert len(store.collections) == 3
    assert "protocols" in store.collections

def test_vectordb_inventory_and_filters():
    from core import Document
    store = VectorStore()
    doc1 = Document(id="i1", content="Masks", vector=np.array([1, 0, 0]), title="Mask", data_type="TEXT", collection="inventory", metadata={"category": "PPE", "quantity": 10, "equipment_available": True, "zone": "A"})
    doc2 = Document(id="i2", content="Penicillin", vector=np.array([0, 1, 0]), title="Meds", data_type="TEXT", collection="inventory", metadata={"category": "Meds", "contraindications": ["AllergyX"], "equipment_available": False, "zone": "B"})
    doc3 = Document(id="i3", content="Radio", vector=np.array([0, 0, 0]), title="Comms", data_type="AUDIO", collection="inventory", metadata={"category": "Comms", "priority_level": "High"})
    doc4 = Document(id="", content="No id", vector=np.array([0,0,0]), collection="inventory", metadata={})
    
    store.insert_batch([doc1, doc2, doc3, doc4])
    
    assert len(store.get_inventory()) == 4
    
    # Test keyword search
    kw_res, _ = store.keyword_search("Masks Radio", collection="inventory")
    assert len(kw_res) > 0
    # Test filters
    docs = [doc1, doc2, doc3]
    assert len(store._apply_filters(docs, {"zone": "A"})) == 1
    assert len(store._apply_filters(docs, {"priority_level": "High"})) == 1
    assert len(store._apply_filters(docs, {"data_type": "TEXT"})) == 2
    assert len(store._apply_filters(docs, {"data_type": ["TEXT", "AUDIO"]})) == 3
    assert len(store._apply_filters(docs, {"inventory_check": True})) == 2
    assert len(store._apply_filters(docs, {"exclude_allergies": ["AllergyX"]})) == 2
    assert len(store._apply_filters(docs, {"exclude_allergies": ["Other"]})) == 3
    assert len(store._apply_filters(docs, {"category": "PPE"})) == 1

def test_vectordb_semantic_search():
    from core import Document
    store = VectorStore()
    doc1 = Document(id="i1", content="Masks", vector=np.array([1, 0, 0]), title="Mask", data_type="TEXT")
    doc2 = Document(id="i2", content="Penicillin", vector=np.array([0, 1, 0]), title="Meds", data_type="TEXT")
    store.insert_batch([doc1, doc2])
    
    assert len(store.get_collection_stats()) == 3
    
    # Test semantic search
    res, _ = store.semantic_search(np.array([1, 0.1, 0]), top_k=2)
    assert len(res) == 2
    assert res[0].id == "i1"

def test_vectordb_cosine_similarity():
    # zero vectors
    assert VectorStore._cosine_similarity(np.array([0,0]), np.array([1,1])) == 0.0
    assert VectorStore._cosine_similarity(np.array([1,1]), np.array([0,0])) == 0.0
    # identical vectors
    assert round(VectorStore._cosine_similarity(np.array([1,1]), np.array([1,1])), 3) == 1.0
