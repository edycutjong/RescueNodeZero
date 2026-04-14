"""
RescueNode Zero — FastAPI Backend

Air-gapped triage intelligence hub powered by Actian VectorAI DB.
"""

from __future__ import annotations

import os
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.search import router as search_router
from api.ingest import router as ingest_router
from api.system import router as system_router

load_dotenv()


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncGenerator[None, None]:
    """Startup: seed database if empty."""
    from core import store

    if store.get_collection_stats().get("protocols", 0) == 0:
        print("📦 Seeding protocol database...")
        from data.seed_protocols import seed_all
        seed_all()
        stats = store.get_collection_stats()
        print(f"✅ Seeded: {stats}")
    else:
        print("✅ Database already seeded")

    yield  # App running
    print("🛑 Shutting down RescueNode Zero")


app = FastAPI(
    title="RescueNode Zero",
    description="Air-gapped triage intelligence hub. Powered by Actian VectorAI DB.",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(search_router)
app.include_router(ingest_router)
app.include_router(system_router)


@app.get("/")
async def root() -> dict[str, str]:
    return {
        "name": "RescueNode Zero",
        "status": "OPERATIONAL",
        "mode": "OFFLINE",
        "tagline": "When the grid goes dark, the AI stays on.",
    }
