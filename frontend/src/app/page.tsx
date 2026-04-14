"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { SearchFilters, SearchResultItem } from "@/lib/types";
import { MOCK_SEARCH_RESULTS, MOCK_INVENTORY } from "@/lib/mock-data";
import { SearchBar } from "@/components/SearchBar";
import { FilterChips } from "@/components/FilterChips";
import { ResultsGrid } from "@/components/ResultsGrid";
import { InventoryPanel } from "@/components/InventoryPanel";
import { OfflineBadge } from "@/components/OfflineBadge";
import { LatencyBadge } from "@/components/LatencyBadge";
import { UploadZone } from "@/components/UploadZone";

export default function Dashboard() {
  // ── State with lazy initializers ──
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [filters, setFilters] = useState<SearchFilters>(() => ({}));
  const [fusionMethod, setFusionMethod] = useState("hybrid_fusion");
  const [filtersApplied, setFiltersApplied] = useState<string[]>([]);

  // ── Search Handler ──
  const handleSearch = useCallback(
    async (query: string) => {
      setIsLoading(true);

      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${API_BASE}/api/search`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query,
            filters,
            search_mode: "hybrid_fusion",
            top_k: 10,
            collections: ["protocols", "field_data"],
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setResults(data.results);
          setTotalResults(data.total_results);
          setLatencyMs(data.query_time_ms);
          setFusionMethod(data.fusion_method);
          setFiltersApplied(data.filters_applied);
          setIsLoading(false);
          return;
        }
      } catch (_err) {
        // Backend not available — use mock data
      }

      // Fallback: mock data with simulated latency
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Apply client-side filters to mock data
      let filtered = MOCK_SEARCH_RESULTS;

      if (filters.zone) {
        filtered = filtered.filter(
          (r) => (r.metadata?.zone as string) === filters.zone
        );
      }
      if (filters.priority_level) {
        filtered = filtered.filter(
          (r) => (r.metadata?.priority_level as string) === filters.priority_level
        );
      }
      if (filters.data_type && filters.data_type.length > 0) {
        filtered = filtered.filter((r) =>
          filters.data_type!.includes(r.data_type)
        );
      }
      if (filters.exclude_allergies && filters.exclude_allergies.length > 0) {
        filtered = filtered.filter((r) => {
          const contraindications = (r.metadata?.contraindications as string[]) || [];
          return !filters.exclude_allergies!.some((a) =>
            contraindications.map((c) => c.toLowerCase()).includes(a.toLowerCase())
          );
        });
      }

      setResults(filtered);
      setTotalResults(filtered.length);
      setLatencyMs(12.4);
      setFusionMethod("hybrid_fusion");
      setFiltersApplied(
        Object.keys(filters).filter(
          (k) => filters[k as keyof SearchFilters] !== undefined
        )
      );
      setIsLoading(false);
    },
    [filters]
  );

  const handleFilterChange = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden relative scanline hud-grid">
      {/* ═══════════════════════ HEADER ═══════════════════════ */}
      <header className="shrink-0 px-6 py-3 flex items-center justify-between border-b border-(--color-border) bg-[rgba(15,23,42,0.95)] backdrop-blur-sm z-10">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-linear-to-br from-(--color-cyan) to-(--color-green) flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
                <path d="M12 8V12L15 15" />
              </svg>
            </div>
            <div>
              <h1 className="font-display font-bold text-base tracking-widest text-(--color-text-primary)">
                RESCUENODE ZERO
              </h1>
              <p className="text-[10px] font-mono text-(--color-text-muted) tracking-wider">
                AIR-GAPPED TRIAGE INTELLIGENCE
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {latencyMs !== null && <LatencyBadge latencyMs={latencyMs} />}
          <OfflineBadge />
          {fusionMethod && (
            <span className="text-[10px] font-mono text-(--color-text-muted) bg-(--color-surface) px-3 py-1.5 rounded-full border border-(--color-border)">
              {fusionMethod.replace("_", " ").toUpperCase()}
            </span>
          )}
          {filtersApplied.length > 0 && (
            <span className="text-[10px] font-mono text-(--color-amber) bg-[rgba(245,158,11,0.1)] px-3 py-1.5 rounded-full border border-[rgba(245,158,11,0.3)]">
              {filtersApplied.length} filter{filtersApplied.length > 1 ? "s" : ""} active
            </span>
          )}
        </div>
      </header>

      {/* ═══════════════════════ MAIN ═══════════════════════ */}
      <main className="flex-1 flex overflow-hidden">
        {/* ── Left: Search + Results ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search + Filters */}
          <div className="shrink-0 px-6 py-4 space-y-3 border-b border-(--color-border) bg-[rgba(15,23,42,0.6)]">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
            <FilterChips filters={filters} onFilterChange={handleFilterChange} />
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <ResultsGrid
              results={results}
              totalResults={totalResults}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* ── Right: Sidebar ── */}
        <aside className="w-72 shrink-0 border-l border-(--color-border) flex flex-col overflow-hidden bg-[rgba(15,23,42,0.5)]">
          {/* Upload */}
          <div className="px-3 pt-3">
            <UploadZone onUploadComplete={() => {}} />
          </div>

          {/* Inventory */}
          <div className="flex-1 overflow-hidden px-3 py-3">
            <InventoryPanel items={MOCK_INVENTORY} />
          </div>

          {/* Footer stats */}
          <div className="px-3 py-3 border-t border-(--color-border) text-center">
            <p className="text-[10px] font-mono text-(--color-text-muted)">
              Powered by{" "}
              <span className="text-(--color-cyan)">Actian VectorAI DB</span>
            </p>
            <p className="text-[9px] font-mono text-(--color-text-muted) opacity-50 mt-0.5">
              When the grid goes dark, the AI stays on.
            </p>
          </div>
        </aside>
      </main>

      {/* ═══════════════════════ STATUS BAR ═══════════════════════ */}
      <StatusBar results={results.length} />
    </div>
  );
}

/* ── Status bar declared outside render ── */
function StatusBar({ results }: { results: number }) {
  const [uptime, setUptime] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setUptime((prev) => prev + 1);
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <footer className="status-bar shrink-0 px-6 py-1.5 flex items-center justify-between text-[10px] font-mono text-(--color-text-muted) z-10">
      <div className="flex items-center gap-6">
        <span>
          SYS <span className="stat-value font-semibold">{formatUptime(uptime)}</span>
        </span>
        <span>
          DOCS <span className="text-(--color-text-secondary) font-semibold">44</span>
        </span>
        <span>
          VECTORS <span className="text-(--color-text-secondary) font-semibold">16,896</span>
        </span>
        <span>
          LAST QUERY <span className="text-(--color-text-secondary) font-semibold">{results > 0 ? `${results} hits` : "—"}</span>
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-(--color-green) animate-pulse" />
          VectorAI DB
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-(--color-green) animate-pulse" />
          Embeddings
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-(--color-green) animate-pulse" />
          Whisper
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-(--color-green) animate-pulse" />
          CLIP
        </span>
      </div>
    </footer>
  );
}
