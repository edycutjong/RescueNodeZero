"""
Whisper Service — Audio transcription.

Uses OpenAI Whisper (base model) for local transcription.
Falls back to mock transcription in demo mode.
"""

from __future__ import annotations

import os

DEMO_MODE = os.getenv("DEMO_MODE", "true").lower() == "true"

_model = None
if not DEMO_MODE:
    try:
        import whisper
        _model = whisper.load_model("base")
        print("✅ Loaded Whisper base model")
    except ImportError:
        print("⚠️  whisper not installed, using mock transcription")


async def transcribe_audio(file_path: str) -> str:
    """Transcribe an audio file to text."""
    if _model is not None:
        result = _model.transcribe(file_path)
        return result.get("text", "")
    return _mock_transcribe(file_path)


def _mock_transcribe(file_path: str) -> str:
    """Return a realistic mock transcription for demo purposes."""
    filename = os.path.basename(file_path).lower()

    if "hazmat" in filename or "chemical" in filename:
        return (
            "This is field medic Alpha-7. We have a chemical spill at the "
            "industrial warehouse in Sector 3. Two workers with burns on exposed "
            "skin. The barrel markings show UN-1090 — that's acetone. We need "
            "immediate decontamination protocol and burn treatment supplies. "
            "One worker reports a penicillin allergy. Over."
        )
    elif "medical" in filename or "medic" in filename:
        return (
            "Dispatch, this is Rescue Unit 4. We have a mass casualty situation "
            "at the collapsed structure in Sector 5. Multiple victims with crush "
            "injuries. Requesting Level A PPE and heavy extrication equipment. "
            "Two patients are in IMMEDIATE status, three DELAYED. "
            "Need antibiotic supplies — confirmed no sulfa allergies in this group."
        )
    elif "structural" in filename or "collapse" in filename:
        return (
            "Engineering team at Sector 2 reporting. The south wall has partially "
            "collapsed — Category 3 structural damage per FEMA classification. "
            "We need shoring equipment and a structural assessment team. "
            "Area is NOT safe for entry without reinforcement. "
            "Advise all rescue teams to stage at the north perimeter."
        )
    else:
        return (
            "Field report: Multiple emergency situations developing across sectors. "
            "Requesting all available HAZMAT and medical teams to staging area. "
            "Priority is chemical containment in Sector 3, followed by structural "
            "rescue in Sector 5. Inventory check needed for burn treatment supplies "
            "and Level A protective equipment."
        )
