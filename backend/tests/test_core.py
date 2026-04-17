import pytest
from unittest.mock import patch, MagicMock
import numpy as np

from core.embeddings import embed_text, embed_batch
from core.clip_svc import caption_image
from core.whisper_svc import transcribe_audio
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
        

def test_vectordb_init():
    store = VectorStore()
    assert store.client is not None

def test_vectordb_inventory_and_filters():
    from core import Document
    store = VectorStore()
    doc1 = Document(id="i1", content="Masks", vector=np.array([1, 0, 0]), title="Mask", data_type="TEXT", collection="inventory", metadata={"category": "PPE", "quantity": 10, "equipment_available": True, "zone": "A"})
    doc2 = Document(id="i2", content="Penicillin", vector=np.array([0, 1, 0]), title="Meds", data_type="TEXT", collection="inventory", metadata={"category": "Meds", "contraindications": ["AllergyX"], "equipment_available": False, "zone": "B"})
    doc3 = Document(id="i3", content="Radio", vector=np.array([0, 0, 0]), title="Comms", data_type="AUDIO", collection="inventory", metadata={"category": "Comms", "priority_level": "High"})
    doc4 = Document(id="", content="No id", vector=np.array([0,0,0]), collection="inventory", metadata={})
    
    store.insert_batch([doc1, doc2, doc3, doc4])
    
    # Mocks return 1 point payload
    assert len(store.get_inventory()) == 1
    
    # Test keyword search
    kw_res, _ = store.keyword_search("Masks Radio", collection="inventory")
    assert len(kw_res) == 1

def test_vectordb_semantic_search():
    from core import Document
    store = VectorStore()
    doc1 = Document(id="i1", content="Masks", vector=np.array([1, 0, 0]), title="Mask", data_type="TEXT")
    doc2 = Document(id="i2", content="Penicillin", vector=np.array([0, 1, 0]), title="Meds", data_type="TEXT")
    store.insert_batch([doc1, doc2])
    
    assert len(store.get_collection_stats()) == 3
    
    # Test semantic search
    res, _ = store.semantic_search(np.array([1, 0.1, 0]), top_k=2)
    assert len(res) == 1
