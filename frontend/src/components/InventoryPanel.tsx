"use client";

import type { InventoryItem } from "@/lib/types";

interface InventoryPanelProps {
  items: InventoryItem[];
}

export function InventoryPanel({ items }: InventoryPanelProps) {
  return (
    <div className="card-glass p-4 h-full flex flex-col">
      <h2 className="text-(--color-text-primary) font-display font-bold text-sm tracking-wider uppercase mb-3">
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
                  className={`font-body ${
                    isLow
                      ? "text-(--color-text-primary)"
                      : "text-(--color-text-secondary)"
                  } truncate block`}
                >
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                {isLow && (
                  <span
                    className={`text-[10px] font-mono font-semibold ${
                      isCritical ? "text-(--color-red)" : "text-(--color-amber)"
                    }`}
                  >
                    {isCritical ? "CRITICAL" : "Low stock"}
                  </span>
                )}
                <span
                  className={`font-mono font-bold tabular-nums w-8 text-right ${
                    isCritical
                      ? "text-(--color-red)"
                      : isLow
                        ? "text-(--color-amber)"
                        : "text-(--color-text-primary)"
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
      <div className="mt-3 pt-3 border-t border-(--color-border) flex justify-between text-[10px] font-mono text-(--color-text-muted)">
        <span>{items.length} items tracked</span>
        <span className="text-(--color-red)">
          {items.filter((i) => i.quantity < 5).length} low
        </span>
      </div>
    </div>
  );
}
