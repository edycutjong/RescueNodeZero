import pytest
from unittest.mock import patch, MagicMock
from core import embeddings, clip_svc, whisper_svc

@pytest.mark.asyncio
async def test_clip_svc_mock_and_real():
    # Test all branches of _mock_caption
    assert "industrial" in clip_svc._mock_caption("some_chemical_barrel.jpg").lower()
    assert "multi-story" in clip_svc._mock_caption("building_collapse.jpg").lower()
    assert "flooded" in clip_svc._mock_caption("flood_area.jpg").lower()
    assert "fire" in clip_svc._mock_caption("structure_fire.jpg").lower()
    assert "aerial" in clip_svc._mock_caption("drone_view.jpg").lower()
    assert "emergency" in clip_svc._mock_caption("random_photo.jpg").lower()

    # Test DEMO_MODE = False fallback
    with patch("core.clip_svc.DEMO_MODE", False):
        with patch("core.clip_svc._real_caption", side_effect=Exception("Failed")):
            res = await clip_svc.caption_image("test_chemical.jpg")
            assert "industrial" in res.lower()

        with patch("core.clip_svc._real_caption", return_value="Real caption"):
            res = await clip_svc.caption_image("test_file.jpg")
            assert res == "Real caption"

@pytest.mark.asyncio
async def test_whisper_svc_mock_and_real():
    # Test all branches of _mock_transcribe
    assert "chemical" in whisper_svc._mock_transcribe("hazmat_report.mp3").lower()
    assert "mass casualty" in whisper_svc._mock_transcribe("medical_status.wav").lower()
    assert "structural" in whisper_svc._mock_transcribe("collapse_area.mp3").lower()
    assert "field report" in whisper_svc._mock_transcribe("unknown_report.m4a").lower()

    mock_model = MagicMock()
    mock_model.transcribe.return_value = {"text": "Real text"}
    with patch("core.whisper_svc._model", mock_model):
        res = await whisper_svc.transcribe_audio("test.mp3")
        assert res == "Real text"

def test_embeddings_mock_and_real():
    # test _mock_embed branches
    import numpy as np
    
    # Text with critical terms
    vec1 = embeddings._mock_embed("burn hazmat chemical protocol")
    assert len(vec1) == 384
    
    # Empty text 
    vec2 = embeddings._mock_embed("")
    assert len(vec2) == 384
    
    res1 = embeddings.embed_text("test")
    assert len(res1) == 384
    
    res_batch = embeddings.embed_batch(["test1", "test2"])
    assert len(res_batch) == 2
    
    mock_model = MagicMock()
    mock_model.encode.return_value = np.array([1, 2, 3])
    with patch("core.embeddings._model", mock_model):
        res = embeddings.embed_text("test")
        assert len(res) == 3
        
        embeddings.embed_batch(["t1", "t2"])
        assert mock_model.encode.call_count == 2

def test_module_reloads_for_coverage():
    import os
    import importlib
    
    # 1. Test clip_svc with DEMO_MODE=False missing imports
    os.environ["DEMO_MODE"] = "false"
    
    import core.embeddings
    import core.whisper_svc
    
    # Should catch ImportError and fallback to None / mock
    with patch.dict("sys.modules", {"sentence_transformers": None}):
        importlib.reload(core.embeddings)
        assert core.embeddings._model is None
        
    with patch.dict("sys.modules", {"whisper": None}):
        importlib.reload(core.whisper_svc)
        assert core.whisper_svc._model is None
        
    import core.clip_svc
    importlib.reload(core.clip_svc)

    # 2. Test successful import path
    mock_st = MagicMock()
    with patch.dict("sys.modules", {"sentence_transformers": mock_st}):
        importlib.reload(core.embeddings)
        assert core.embeddings._model is not None
        
    mock_whisper = MagicMock()
    with patch.dict("sys.modules", {"whisper": mock_whisper}):
        importlib.reload(core.whisper_svc)
        assert core.whisper_svc._model is not None

    # Test the default _real_caption which falls through
    import asyncio
    res_real = asyncio.run(core.clip_svc._real_caption("test.jpg"))
    assert "emergency" in res_real.lower()

    # restore
    os.environ["DEMO_MODE"] = "true"
    importlib.reload(core.embeddings)
    importlib.reload(core.whisper_svc)
    importlib.reload(core.clip_svc)

def test_seed_protocols():
    from data import seed_protocols
    from core import store
    
    # Store length before seeding
    initial_len = len(store.get_collection_stats())
    
    # Run seed all
    seed_protocols.seed_all()
    
    # Store should be populated
    stats = store.get_collection_stats()
    assert stats["protocols"] > 0
    assert stats["inventory"] > 0
    assert stats["field_data"] > 0
    assert "protocols" in stats
    assert "inventory" in stats
    assert "field_data" in stats

