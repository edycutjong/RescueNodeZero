"use client";

export function OfflineBadge() {
  return (
    <div className="badge-online flex items-center gap-2 px-4 py-1.5 rounded-full font-[family-name:var(--font-mono)] text-sm select-none">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--color-green)] opacity-75 animate-ping" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--color-green)]" />
      </span>
      <span className="font-semibold tracking-wide">OFFLINE MODE</span>
    </div>
  );
}
