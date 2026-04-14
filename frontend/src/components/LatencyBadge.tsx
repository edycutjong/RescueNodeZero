"use client";

interface LatencyBadgeProps {
  latencyMs: number | null;
}

export function LatencyBadge({ latencyMs }: LatencyBadgeProps) {
  const display = latencyMs !== null ? `${latencyMs.toFixed(1)}ms` : "—";

  return (
    <div className="badge-latency flex items-center gap-2 px-4 py-1.5 rounded-full font-[family-name:var(--font-mono)] text-sm select-none">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <span className="font-semibold tabular-nums">{display}</span>
    </div>
  );
}
