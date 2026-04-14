"use client";

import type { SearchResultItem } from "@/lib/types";

interface ResultCardProps {
  result: SearchResultItem;
}

// HAZMAT GHS diamond SVG
function HazmatIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" className="type-icon-hazmat shrink-0">
      <path d="M16 2 L30 16 L16 30 L2 16 Z" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 14 C12 10 20 10 20 14 C20 18 16 16 16 20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="16" cy="24" r="1.5" fill="currentColor" />
    </svg>
  );
}

// Medical cross
function MedicalIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" className="type-icon-medical shrink-0">
      <rect x="12" y="4" width="8" height="24" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="4" y="12" width="24" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

// Camera for photos
function PhotoIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" className="type-icon-photo shrink-0">
      <rect x="4" y="8" width="24" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="16" cy="17" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="11" y="5" width="10" height="4" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

// Audio waveform
function AudioIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" className="type-icon-audio shrink-0">
      <line x1="6" y1="12" x2="6" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="10" y1="8" x2="10" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="14" y1="10" x2="14" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="6" x2="18" y2="26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="22" y1="10" x2="22" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="26" y1="13" x2="26" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function getTypeIcon(result: SearchResultItem) {
  if (result.data_type === "PHOTO") return <PhotoIcon />;
  if (result.data_type === "AUDIO") return <AudioIcon />;
  const category = result.metadata?.category as string | undefined;
  if (category === "HAZMAT") return <HazmatIcon />;
  return <MedicalIcon />;
}

function getTypeLabel(result: SearchResultItem) {
  if (result.data_type === "PHOTO") return "PHOTO CARD";
  if (result.data_type === "AUDIO") return "AUDIO CARD";
  const category = result.metadata?.category as string | undefined;
  return category === "HAZMAT" ? "HAZMAT PROTOCOL" : "MEDICAL PROTOCOL";
}

function getPriorityColor(priority: string | undefined) {
  switch (priority) {
    case "IMMEDIATE":
      return "text-[var(--color-red)]";
    case "DELAYED":
      return "text-[var(--color-amber)]";
    case "MINOR":
      return "text-[var(--color-green)]";
    case "EXPECTANT":
      return "text-[var(--color-text-muted)]";
    default:
      return "text-[var(--color-text-secondary)]";
  }
}

// Mock audio waveform bars
function AudioWaveform() {
  const bars = [3, 6, 4, 8, 5, 9, 3, 7, 5, 8, 4, 6, 3, 7, 5, 9, 4, 6, 3, 5, 7, 4, 8, 3, 6];
  return (
    <div className="flex items-end gap-[2px] h-10 py-2">
      <button className="shrink-0 mr-2 w-8 h-8 rounded-full bg-[var(--color-cyan)] flex items-center justify-center text-white">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <polygon points="2,0 12,6 2,12" />
        </svg>
      </button>
      {bars.map((height, i) => (
        <div
          key={i}
          className="waveform-bar w-[3px] opacity-60"
          style={{ height: `${height * 3}px` }}
        />
      ))}
    </div>
  );
}

export function ResultCard({ result }: ResultCardProps) {
  const priority = result.metadata?.priority_level as string | undefined;
  const unCode = result.metadata?.un_code as string | undefined;
  const equipment = result.metadata?.equipment_required as string[] | undefined;
  const zone = result.metadata?.zone as string | undefined;
  const reporter = result.metadata?.reporter as string | undefined;

  return (
    <div className="card-glass p-4 flex flex-col gap-3 group">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {getTypeIcon(result)}
          <div>
            <span className="text-[11px] font-[family-name:var(--font-mono)] text-[var(--color-text-muted)] uppercase tracking-wider">
              {getTypeLabel(result)}
            </span>
            {priority && (
              <span
                className={`ml-2 text-[10px] font-[family-name:var(--font-mono)] ${getPriorityColor(priority)} uppercase`}
              >
                {priority}
              </span>
            )}
          </div>
        </div>
        <span className="text-[var(--color-cyan)] font-[family-name:var(--font-mono)] text-xs tabular-nums shrink-0">
          {(result.score * 100).toFixed(1)}%
        </span>
      </div>

      {/* Title */}
      <h3 className="text-[var(--color-text-primary)] font-semibold text-sm leading-tight">
        {result.title}
      </h3>

      {/* Audio waveform */}
      {result.data_type === "AUDIO" && <AudioWaveform />}

      {/* Content */}
      <p className="text-[var(--color-text-secondary)] text-xs leading-relaxed font-[family-name:var(--font-mono)]">
        {result.data_type === "AUDIO" && (
          <span className="text-[var(--color-text-muted)] text-[10px] block mb-1 uppercase tracking-wider">
            WHISPER TRANSCRIPT
          </span>
        )}
        {result.data_type === "PHOTO" && (
          <span className="text-[var(--color-text-muted)] text-[10px] block mb-1 uppercase tracking-wider">
            AI CAPTION
          </span>
        )}
        {result.content_preview}
      </p>

      {/* Score bar */}
      <div className="w-full bg-[var(--color-surface-elevated)] rounded-full h-[3px]">
        <div className="score-bar" style={{ width: `${result.score * 100}%` }} />
      </div>

      {/* Metadata footer */}
      <div className="flex flex-wrap gap-2 text-[10px] font-[family-name:var(--font-mono)] text-[var(--color-text-muted)]">
        {unCode && (
          <span className="bg-[rgba(239,68,68,0.1)] text-[var(--color-red)] px-2 py-0.5 rounded">
            {unCode}
          </span>
        )}
        {zone && (
          <span className="bg-[rgba(6,182,212,0.1)] text-[var(--color-cyan)] px-2 py-0.5 rounded">
            {zone.replace("_", " ")}
          </span>
        )}
        {reporter && (
          <span className="bg-[rgba(148,163,184,0.1)] px-2 py-0.5 rounded">
            {reporter}
          </span>
        )}
        {equipment && equipment.length > 0 && (
          <span className="bg-[rgba(245,158,11,0.1)] text-[var(--color-amber)] px-2 py-0.5 rounded">
            PPE: {equipment.join(", ")}
          </span>
        )}
        <span className="ml-auto text-[var(--color-text-muted)] opacity-60">
          {result.match_type}
        </span>
      </div>
    </div>
  );
}
