<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# ⚡ RescueNode Zero — Agent Instructions

## Project
Air-gapped multimodal triage intelligence hub for disaster responders. Cross-references drone imagery, audio field reports, and HAZMAT protocols using Actian VectorAI DB — entirely offline on a single laptop. Sub-15ms hybrid fusion search.

## Hackathon
**DoraHacks Actian VectorAI DB Build Challenge 2026** — Demonstrating edge-native AI when cloud infrastructure is destroyed.

## Structure
- `frontend/` — Next.js 16 App Router dashboard (React 19, Tailwind v4)
- `backend/` — Python FastAPI server (VectorAI DB, local embeddings)
- `backend/api/` — REST endpoints (ingest, search, system)
- `backend/core/` — VectorDB adapter, embeddings, RRF fusion, Whisper, CLIP
- `backend/data/` — Seed protocols, datasets (HAZMAT, medical, inventory)
- `scripts/` — Seed DB, download models, demo startup
- `docs/` — Demo script, screenshots

## Tech Stack
| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19 |
| **Styling** | Tailwind CSS v4 |
| **Backend** | Python 3.12, FastAPI |
| **Vector DB** | Actian VectorAI DB (Docker) |
| **Text Embeddings** | all-MiniLM-L6-v2 (384-dim) |
| **Image Processing** | MobileCLIP (ViT-B/32) |
| **Audio Processing** | whisper.cpp / openai-whisper (base) |
| **Fusion** | Reciprocal Rank Fusion (RRF) |

## Key Rules
- **Frontend** = ESM (`import`), Next.js 16, React 19, Tailwind v4
- **Backend** = Python 3.12, FastAPI, async endpoints
- **Adapter Pattern** = VectorDB client abstracted behind `VectorStore` interface
- **Colors** = Cyan (#06b6d4) data/tech, Green (#22c55e) offline badge, Amber (#f59e0b) warnings, Red (#ef4444) critical
- **Typography** = Orbitron (headings), JetBrains Mono (data), Inter (body)
- **Aesthetic** = Military SOC / Command Center, dark mode, glassmorphism cards

## Critical Patterns
- All state initialization uses **lazy initializers**
- Components must be **client components** (`'use client'`) when using hooks
- **No cloud API calls** — everything runs locally
- Pre-seeded knowledge base, only user queries run live
