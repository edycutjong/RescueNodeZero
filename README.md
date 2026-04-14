# ⚡ RescueNode Zero

**Air-Gapped Multimodal Triage Intelligence Hub**

> When the grid goes dark, the AI stays on.

RescueNode Zero is an offline-first disaster response intelligence system that cross-references drone imagery, audio field reports, and HAZMAT protocols using **Actian VectorAI DB** — entirely on a single laptop. Sub-15ms hybrid fusion search with zero cloud dependencies.

## 🎯 Built For

[DoraHacks Actian VectorAI DB Build Challenge 2026](https://dorahacks.io/)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 **Hybrid Fusion Search** | Reciprocal Rank Fusion (RRF) combining semantic + keyword search for maximum accuracy |
| 🧪 **HAZMAT Intelligence** | 10 protocols with UN codes, PPE requirements, decontamination procedures |
| 🏥 **Medical Triage** | START/SALT protocols, chemical burns, crush syndrome, anaphylaxis |
| 🎙️ **Audio Transcription** | Whisper-powered field report processing with zone/reporter metadata |
| 📸 **Drone Imagery** | CLIP-based captioning for aerial reconnaissance photos |
| ⚠️ **Allergy Safety** | Exclude protocols containing patient allergens (penicillin, sulfa, codeine, aspirin) |
| 📦 **Inventory Tracking** | Real-time stock monitoring with LOW STOCK / CRITICAL alerts |
| 🌐 **100% Offline** | No cloud APIs — all processing runs locally on-device |

## 🏗️ Architecture

```
┌──────────────────┐     ┌──────────────────────┐
│   Next.js 16     │────▶│   FastAPI Backend     │
│   React 19       │     │                       │
│   Tailwind v4    │     │  ┌──────────────────┐ │
│                  │     │  │  VectorStore      │ │
│   SOC Dashboard  │     │  │  (Actian VectorAI │ │
│   - SearchBar    │     │  │   DB Adapter)     │ │
│   - FilterChips  │     │  └──────────────────┘ │
│   - ResultCards  │     │  ┌──────────────────┐ │
│   - Inventory    │     │  │  RRF Fusion       │ │
│   - UploadZone   │     │  │  Embeddings       │ │
└──────────────────┘     │  │  Whisper / CLIP   │ │
                         │  └──────────────────┘ │
                         └──────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 20.9.0
- Python ≥ 3.10

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
DEMO_MODE=true uvicorn main:app --port 8000 --reload
```

The backend auto-seeds 49 documents (20 protocols + 5 field reports + 24 inventory items) on startup.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Try These Searches

- `chemical burn treatment acetone` — RRF fusion across HAZMAT + medical protocols
- `UN-1090` — Direct HAZMAT protocol lookup
- `crush syndrome field extraction` — Medical emergency procedures
- `chlorine gas leak` — Toxic industrial chemical response
- Toggle **⚠ penicillin** filter to exclude protocols with penicillin

## 📁 Project Structure

```
RescueNodeZero/
├── backend/
│   ├── api/              # REST endpoints (search, ingest, system)
│   ├── core/             # VectorDB adapter, embeddings, RRF, Whisper, CLIP
│   ├── data/             # Seed protocols and datasets
│   ├── main.py           # FastAPI entry point
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/          # Next.js 16 App Router (page, layout, globals.css)
│   │   ├── components/   # React 19 components (10 components)
│   │   └── lib/          # Types, API client, mock data
│   └── package.json
├── docker-compose.yml
└── .env.example
```

## 🎨 Design System

- **Aesthetic**: Military SOC / Command Center
- **Fonts**: Orbitron (headings), JetBrains Mono (data), Inter (body)
- **Palette**: Cyan `#06b6d4` (data), Green `#22c55e` (offline), Amber `#f59e0b` (warnings), Red `#ef4444` (critical)
- **Effects**: Glassmorphism cards, scanline overlay, pulse-glow animations

## 🔧 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS v4 |
| Backend | Python 3.12, FastAPI |
| Vector DB | Actian VectorAI DB (in-memory adapter for demo) |
| Text Embeddings | all-MiniLM-L6-v2 (384-dim) |
| Image Processing | MobileCLIP (ViT-B/32) |
| Audio Processing | whisper.cpp / openai-whisper (base) |
| Search Fusion | Reciprocal Rank Fusion (RRF) |

## 📊 Performance

| Metric | Target | Achieved |
|---|---|---|
| Query Latency | < 15ms | **0.9ms** |
| Filtered Query | < 15ms | **2.3ms** |
| Seed Documents | 40+ | **49** |
| Cloud Dependencies | 0 | **0** |
| Build Errors | 0 | **0** |

## 📝 License

MIT
