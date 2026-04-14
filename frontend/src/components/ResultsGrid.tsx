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
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-text-muted)"
          strokeWidth="1.5"
          className="mb-4 opacity-40"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <p className="text-[var(--color-text-muted)] font-[family-name:var(--font-mono)] text-sm">
          Enter a query to search the offline knowledge base
        </p>
        <p className="text-[var(--color-text-muted)] text-xs mt-2 opacity-60">
          Try: &ldquo;chemical burn treatment&rdquo; or &ldquo;UN-1090&rdquo;
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[var(--color-text-muted)] text-xs font-[family-name:var(--font-mono)] uppercase tracking-wider">
          Results
        </h2>
        <span className="text-[var(--color-text-muted)] text-xs font-[family-name:var(--font-mono)]">
          {totalResults} matches
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {results.map((result) => (
          <ResultCard key={result.id} result={result} />
        ))}
      </div>
    </div>
  );
}
