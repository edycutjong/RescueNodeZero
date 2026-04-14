"""
System API — Health, stats, and inventory endpoints.
"""

from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel

from core import store

router = APIRouter(prefix="/api", tags=["system"])


class HealthResponse(BaseModel):
    status: str
    vectordb: str
    mode: str
    version: str


class StatsResponse(BaseModel):
    collections: dict[str, int]
    total_documents: int


class InventoryItem(BaseModel):
    id: str
    name: str
    category: str
    quantity: int
    zone: str


class InventoryResponse(BaseModel):
    items: list[InventoryItem]
    total_items: int
    low_stock_count: int


@router.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    """System health check."""
    return HealthResponse(
        status="operational",
        vectordb="in-memory",  # Will show "actian-vectorai" when real SDK integrated
        mode="offline",
        version="0.1.0",
    )


@router.get("/stats", response_model=StatsResponse)
async def stats() -> StatsResponse:
    """Collection statistics."""
    collection_stats = store.get_collection_stats()
    return StatsResponse(
        collections=collection_stats,
        total_documents=sum(collection_stats.values()),
    )


@router.get("/inventory", response_model=InventoryResponse)
async def inventory() -> InventoryResponse:
    """Current inventory levels."""
    items = store.get_inventory()
    inventory_items = [InventoryItem(**item) for item in items]
    low_stock = sum(1 for item in inventory_items if item.quantity < 5)
    return InventoryResponse(
        items=inventory_items,
        total_items=len(inventory_items),
        low_stock_count=low_stock,
    )
