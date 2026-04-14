"use client";

import type { SearchResultItem } from "@/lib/types";
import { ResultCard } from "./ResultCard";

interface ResultsGridProps {
  results: SearchResultItem[];
  totalResults: number;
  isLoading: boolean;
}

export function ResultsGrid({ results, totalResults, isLoading }: ResultsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card-glass p-4 h-48 shimmer" />
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        {/* Animated Radar Sweep */}
        <div className="radar-container mb-8">
          <div className="radar-ping" />
          <div className="radar-ring" />
          <div className="radar-ring-inner" />
          <div className="radar-ring-core" />
          <div className="radar-sweep" />
          {/* Fake blips */}
          <div className="radar-dot" style={{ top: "18%", left: "70%" }} />
          <div className="radar-dot" style={{ top: "65%", left: "25%", opacity: 0.5, width: 4, height: 4 }} />
          <div className="radar-dot" style={{ top: "42%", left: "80%", opacity: 0.3, width: 3, height: 3 }} />
        </div>
        <p className="text-(--color-text-secondary) font-mono text-sm tracking-wide">
          AWAITING QUERY INPUT
        </p>
        <p className="text-(--color-text-muted) font-mono text-xs mt-2 opacity-60">
          Try: &ldquo;chemical burn treatment&rdquo; &middot; &ldquo;chlorine gas&rdquo; &middot; &ldquo;crush syndrome&rdquo;
        </p>
        <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-(--color-cyan) opacity-60">
          <span className="w-1 h-1 rounded-full bg-(--color-cyan) animate-pulse" />
          44 documents indexed &middot; 16,896 vectors loaded
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-(--color-text-muted) text-xs font-mono uppercase tracking-wider">
          Results
        </h2>
        <span className="text-(--color-text-muted) text-xs font-mono">
          {totalResults} matches
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {results.map((result, index) => (
          <div
            key={result.id}
            className="card-enter"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <ResultCard result={result} />
          </div>
        ))}
      </div>
    </div>
  );
}
