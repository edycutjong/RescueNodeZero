"use client";

import type { InventoryItem } from "@/lib/types";

interface InventoryPanelProps {
  items: InventoryItem[];
}

export function InventoryPanel({ items }: InventoryPanelProps) {
  return (
    <div className="card-glass p-4 h-full flex flex-col">
      <h2 className="text-[var(--color-text-primary)] font-[family-name:var(--font-display)] font-bold text-sm tracking-wider uppercase mb-3">
        Inventory
      </h2>

      <div className="flex-1 overflow-y-auto space-y-0.5">
        {items.map((item) => {
          const isLow = item.quantity < 5;
          const isCritical = item.quantity <= 2;
          return (
            <div
              key={item.id}
              className={`flex items-center justify-between px-2 py-1.5 rounded text-xs ${
                isLow ? "low-stock" : ""
              }`}
            >
              <div className="flex-1 min-w-0">
                <span
                  className={`font-[family-name:var(--font-body)] ${
                    isLow
                      ? "text-[var(--color-text-primary)]"
                      : "text-[var(--color-text-secondary)]"
                  } truncate block`}
                >
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                {isLow && (
                  <span
                    className={`text-[10px] font-[family-name:var(--font-mono)] font-semibold ${
                      isCritical ? "text-[var(--color-red)]" : "text-[var(--color-amber)]"
                    }`}
                  >
                    {isCritical ? "CRITICAL" : "Low stock"}
                  </span>
                )}
                <span
                  className={`font-[family-name:var(--font-mono)] font-bold tabular-nums w-8 text-right ${
                    isCritical
                      ? "text-[var(--color-red)]"
                      : isLow
                        ? "text-[var(--color-amber)]"
                        : "text-[var(--color-text-primary)]"
                  }`}
                >
                  {item.quantity}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-3 pt-3 border-t border-[var(--color-border)] flex justify-between text-[10px] font-[family-name:var(--font-mono)] text-[var(--color-text-muted)]">
        <span>{items.length} items tracked</span>
        <span className="text-[var(--color-red)]">
          {items.filter((i) => i.quantity < 5).length} low
        </span>
      </div>
    </div>
  );
}
