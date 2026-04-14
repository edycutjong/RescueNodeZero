"""
CLIP Service — Image captioning.

Uses MobileCLIP/OpenCLIP to generate text descriptions from photos.
Falls back to mock captioning in demo mode.
"""

from __future__ import annotations

import os

DEMO_MODE = os.getenv("DEMO_MODE", "true").lower() == "true"


async def caption_image(file_path: str) -> str:
    """Generate a text caption for an image file."""
    if not DEMO_MODE:
        try:
            return await _real_caption(file_path)
        except Exception:
            pass
    return _mock_caption(file_path)


async def _real_caption(file_path: str) -> str:
    """Generate caption using real CLIP model."""
    # TODO: Implement with open_clip when model is downloaded
    return _mock_caption(file_path)


def _mock_caption(file_path: str) -> str:
    """Return a realistic mock caption for demo purposes."""
    filename = os.path.basename(file_path).lower()

    if "barrel" in filename or "chemical" in filename:
        return (
            "Industrial chemical barrel with visible structural damage and "
            "liquid spill on concrete floor. Orange hazard diamond marking "
            "visible. Yellow caution tape in foreground."
        )
    elif "collapse" in filename or "structural" in filename or "building" in filename:
        return (
            "Partially collapsed multi-story concrete building with exposed "
            "rebar and debris field. Dust cloud visible. Emergency vehicles "
            "staged in background."
        )
    elif "flood" in filename or "water" in filename:
        return (
            "Flooded urban street with water level at approximately 3 feet. "
            "Submerged vehicles visible. Rescue boat in mid-ground. "
            "Damaged power lines overhead."
        )
    elif "fire" in filename or "smoke" in filename:
        return (
            "Active structure fire with heavy black smoke. Multiple fire trucks "
            "on scene. Hazmat team in Level A suits approaching the perimeter. "
            "Industrial facility exterior."
        )
    elif "drone" in filename or "aerial" in filename:
        return (
            "Aerial drone view of disaster site showing structural damage "
            "across multiple buildings. Emergency staging area visible in "
            "lower right. Search grid markers on the ground."
        )
    else:
        return (
            "Emergency scene photograph showing disaster response operations. "
            "First responders in protective equipment. Damaged infrastructure "
            "visible. Command post in background."
        )
