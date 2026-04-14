/* ──────────────────────────────────────────────
   RescueNode Zero — TypeScript Types
   ────────────────────────────────────────────── */

export interface SearchResultItem {
  id: string;
  score: number;
  title: string;
  content_preview: string;
  data_type: "TEXT" | "PHOTO" | "AUDIO";
  source: string;
  metadata: Record<string, unknown>;
  match_type: "semantic" | "keyword" | "fused";
}

export interface SearchFilters {
  zone?: string;
  priority_level?: string;
  data_type?: string[];
  inventory_check?: boolean;
  exclude_allergies?: string[];
  category?: string;
}

export interface SearchRequest {
  query: string;
  filters: SearchFilters;
  search_mode: "semantic" | "keyword" | "hybrid_fusion";
  top_k: number;
  collections: string[];
}

export interface SearchResponse {
  results: SearchResultItem[];
  query_time_ms: number;
  total_results: number;
  fusion_method: string;
  filters_applied: string[];
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  zone: string;
}

export interface InventoryResponse {
  items: InventoryItem[];
  total_items: number;
  low_stock_count: number;
}

export interface IngestResponse {
  id: string;
  data_type: string;
  content_preview: string;
  processing_time_ms: number;
  message: string;
}

export interface HealthResponse {
  status: string;
  vectordb: string;
  mode: string;
  version: string;
}

export type PriorityLevel = "IMMEDIATE" | "DELAYED" | "MINOR" | "EXPECTANT";
export type DataType = "TEXT" | "PHOTO" | "AUDIO";
export type Zone = "Sector_1" | "Sector_2" | "Sector_3" | "Sector_4" | "Sector_5" | "Sector_6" | "Sector_7" | "Sector_8";
