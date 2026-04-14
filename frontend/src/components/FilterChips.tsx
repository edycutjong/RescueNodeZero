"use client";

import type { SearchFilters } from "@/lib/types";

interface FilterChipsProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
}

const ZONES = ["Sector_1", "Sector_2", "Sector_3", "Sector_4", "Sector_5", "Sector_6", "Sector_7", "Sector_8"];
const PRIORITIES = ["IMMEDIATE", "DELAYED", "MINOR", "EXPECTANT"];
const DATA_TYPES = ["TEXT", "PHOTO", "AUDIO"];
const ALLERGIES = ["penicillin", "sulfa", "codeine", "aspirin"];

export function FilterChips({ filters, onFilterChange }: FilterChipsProps) {
  const toggleZone = (zone: string) => {
    onFilterChange({
      ...filters,
      zone: filters.zone === zone ? undefined : zone,
    });
  };

  const togglePriority = (priority: string) => {
    onFilterChange({
      ...filters,
      priority_level: filters.priority_level === priority ? undefined : priority,
    });
  };

  const toggleDataType = (type: string) => {
    const current = filters.data_type || [];
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    onFilterChange({
      ...filters,
      data_type: updated.length > 0 ? updated : undefined,
    });
  };

  const toggleInventory = () => {
    onFilterChange({
      ...filters,
      inventory_check: !filters.inventory_check,
    });
  };

  const toggleAllergy = (allergy: string) => {
    const current = filters.exclude_allergies || [];
    const updated = current.includes(allergy)
      ? current.filter((a) => a !== allergy)
      : [...current, allergy];
    onFilterChange({
      ...filters,
      exclude_allergies: updated.length > 0 ? updated : undefined,
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Row 1: Zone + Priority + Inventory */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-(--color-text-muted) text-xs font-mono uppercase tracking-wider mr-1">
          Zone
        </span>
        {ZONES.map((zone) => (
          <button
            key={zone}
            onClick={() => toggleZone(zone)}
            className={`chip ${filters.zone === zone ? "chip-active" : ""}`}
          >
            {zone.replace("_", " ")}
          </button>
        ))}

        <span className="text-(--color-border) mx-2">|</span>

        <span className="text-(--color-text-muted) text-xs font-mono uppercase tracking-wider mr-1">
          Priority
        </span>
        {PRIORITIES.map((p) => (
          <button
            key={p}
            onClick={() => togglePriority(p)}
            className={`chip ${filters.priority_level === p ? "chip-active" : ""} ${
              p === "IMMEDIATE"
                ? "hover:border-(--color-red)"
                : p === "DELAYED"
                  ? "hover:border-(--color-amber)"
                  : ""
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Row 2: Data Type + Inventory + Allergies */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-(--color-text-muted) text-xs font-mono uppercase tracking-wider mr-1">
          Type
        </span>
        {DATA_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => toggleDataType(type)}
            className={`chip ${(filters.data_type || []).includes(type) ? "chip-active" : ""}`}
          >
            {type === "TEXT" ? "📄 Text" : type === "PHOTO" ? "📷 Photo" : "🎙️ Audio"}
          </button>
        ))}

        <span className="text-(--color-border) mx-2">|</span>

        <button
          onClick={toggleInventory}
          className={`chip ${filters.inventory_check ? "chip-active" : ""}`}
        >
          ✓ Inventory Available
        </button>

        <span className="text-(--color-border) mx-2">|</span>

        <span className="text-(--color-text-muted) text-xs font-mono uppercase tracking-wider mr-1">
          Exclude Allergy
        </span>
        {ALLERGIES.map((a) => (
          <button
            key={a}
            onClick={() => toggleAllergy(a)}
            className={`chip ${(filters.exclude_allergies || []).includes(a) ? "chip-active border-(--color-red)! text-(--color-red)! bg-[rgba(239,68,68,0.1)]!" : ""}`}
          >
            ⚠ {a}
          </button>
        ))}
      </div>
    </div>
  );
}
