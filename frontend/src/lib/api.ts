/* ──────────────────────────────────────────────
   RescueNode Zero — Backend API Client
   ────────────────────────────────────────────── */

import type {
  SearchRequest,
  SearchResponse,
  InventoryResponse,
  IngestResponse,
  HealthResponse,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export async function search(req: SearchRequest): Promise<SearchResponse> {
  return fetchAPI<SearchResponse>("/api/search", {
    method: "POST",
    body: JSON.stringify(req),
  });
}

export async function getInventory(): Promise<InventoryResponse> {
  return fetchAPI<InventoryResponse>("/api/inventory");
}

export async function getHealth(): Promise<HealthResponse> {
  return fetchAPI<HealthResponse>("/api/health");
}

export async function ingestText(
  content: string,
  title: string,
  zone: string,
  priority: string
): Promise<IngestResponse> {
  const formData = new FormData();
  formData.append("content", content);
  formData.append("title", title);
  formData.append("zone", zone);
  formData.append("priority_level", priority);

  const res = await fetch(`${API_BASE}/api/ingest/text`, {
    method: "POST",
    body: formData,
  });
  return res.json() as Promise<IngestResponse>;
}

export async function ingestFile(
  file: File,
  type: "photo" | "audio",
  zone: string,
  priority: string
): Promise<IngestResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("zone", zone);
  formData.append("priority_level", priority);

  const res = await fetch(`${API_BASE}/api/ingest/${type}`, {
    method: "POST",
    body: formData,
  });
  return res.json() as Promise<IngestResponse>;
}
