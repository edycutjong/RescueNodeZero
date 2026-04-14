"""
Ingestion API — Upload and process field data.

Handles photo, audio, and text ingestion into the vector store.
"""

from __future__ import annotations

import os
import uuid
import time

from fastapi import APIRouter, UploadFile, File, Form
from pydantic import BaseModel

from core import Document, store
from core.embeddings import embed_text
from core.whisper_svc import transcribe_audio
from core.clip_svc import caption_image

router = APIRouter(prefix="/api/ingest", tags=["ingest"])

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


class IngestResponse(BaseModel):
    id: str
    data_type: str
    content_preview: str
    processing_time_ms: float
    message: str


@router.post("/photo", response_model=IngestResponse)
async def ingest_photo(
    file: UploadFile = File(...),
    zone: str = Form("Sector_1"),
    reporter: str = Form("Anonymous"),
    priority_level: str = Form("DELAYED"),
) -> IngestResponse:
    """Upload a photo → CLIP caption → embed → store."""
    start = time.perf_counter()

    # Save file
    file_id = str(uuid.uuid4())
    file_ext = os.path.splitext(file.filename or "photo.jpg")[1]
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}{file_ext}")
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    # Generate caption
    caption = await caption_image(file_path)

    # Embed caption
    vector = embed_text(caption)

    # Store
    doc = Document(
        id=file_id,
        content=caption,
        title=f"Field Photo — {file.filename}",
        vector=vector,
        metadata={
            "zone": zone,
            "reporter": reporter,
            "priority_level": priority_level,
            "original_filename": file.filename,
            "file_path": file_path,
        },
        data_type="PHOTO",
        collection="field_data",
    )
    store.insert(doc)

    elapsed = round((time.perf_counter() - start) * 1000, 2)
    return IngestResponse(
        id=file_id,
        data_type="PHOTO",
        content_preview=caption[:200],
        processing_time_ms=elapsed,
        message=f"Photo processed: {caption[:80]}...",
    )


@router.post("/audio", response_model=IngestResponse)
async def ingest_audio(
    file: UploadFile = File(...),
    zone: str = Form("Sector_1"),
    reporter: str = Form("Anonymous"),
    priority_level: str = Form("DELAYED"),
) -> IngestResponse:
    """Upload audio → Whisper transcribe → embed → store."""
    start = time.perf_counter()

    # Save file
    file_id = str(uuid.uuid4())
    file_ext = os.path.splitext(file.filename or "audio.wav")[1]
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}{file_ext}")
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    # Transcribe
    transcript = await transcribe_audio(file_path)

    # Embed
    vector = embed_text(transcript)

    # Store
    doc = Document(
        id=file_id,
        content=transcript,
        title=f"Audio Report — {file.filename}",
        vector=vector,
        metadata={
            "zone": zone,
            "reporter": reporter,
            "priority_level": priority_level,
            "original_filename": file.filename,
            "file_path": file_path,
            "transcript": transcript,
        },
        data_type="AUDIO",
        collection="field_data",
    )
    store.insert(doc)

    elapsed = round((time.perf_counter() - start) * 1000, 2)
    return IngestResponse(
        id=file_id,
        data_type="AUDIO",
        content_preview=transcript[:200],
        processing_time_ms=elapsed,
        message=f"Audio transcribed: {transcript[:80]}...",
    )


@router.post("/text", response_model=IngestResponse)
async def ingest_text(
    content: str = Form(...),
    title: str = Form("Field Report"),
    zone: str = Form("Sector_1"),
    reporter: str = Form("Anonymous"),
    priority_level: str = Form("DELAYED"),
) -> IngestResponse:
    """Submit text report → embed → store."""
    start = time.perf_counter()

    file_id = str(uuid.uuid4())

    # Embed
    vector = embed_text(content)

    # Store
    doc = Document(
        id=file_id,
        content=content,
        title=title,
        vector=vector,
        metadata={
            "zone": zone,
            "reporter": reporter,
            "priority_level": priority_level,
        },
        data_type="TEXT",
        collection="field_data",
    )
    store.insert(doc)

    elapsed = round((time.perf_counter() - start) * 1000, 2)
    return IngestResponse(
        id=file_id,
        data_type="TEXT",
        content_preview=content[:200],
        processing_time_ms=elapsed,
        message="Text report ingested successfully",
    )
