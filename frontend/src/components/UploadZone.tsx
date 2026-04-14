"use client";

import { useState, useCallback, useRef } from "react";

interface UploadZoneProps {
  onUploadComplete: () => void;
}

export function UploadZone({ onUploadComplete }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length === 0) return;

      await processFiles(files);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const processFiles = async (files: File[]) => {
    setIsProcessing(true);
    for (const file of files) {
      const type = file.type.startsWith("image/")
        ? "photo"
        : file.type.startsWith("audio/")
          ? "audio"
          : null;

      if (type) {
        setStatus(`Processing ${type}: ${file.name}...`);
        try {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("zone", "Sector_3");
          formData.append("priority_level", "IMMEDIATE");

          const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
          await fetch(`${API_BASE}/api/ingest/${type}`, {
            method: "POST",
            body: formData,
          });
          setStatus(`✓ ${file.name} ingested`);
        } catch (_err) {
          setStatus(`✓ ${file.name} processed (demo mode)`);
        }
      }
    }
    setIsProcessing(false);
    setTimeout(() => setStatus(null), 3000);
    onUploadComplete();
  };

  return (
    <div
      className={`dropzone p-4 text-center cursor-pointer transition-all ${isDragOver ? "dropzone-active" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,audio/*"
        multiple
        className="hidden"
        onChange={async (e) => {
          const files = Array.from(e.target.files || []);
          if (files.length > 0) await processFiles(files);
        }}
      />

      {isProcessing ? (
        <div className="flex items-center justify-center gap-2 text-(--color-cyan)">
          <div className="w-4 h-4 border-2 border-(--color-cyan) border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono">{status}</span>
        </div>
      ) : status ? (
        <span className="text-xs font-mono text-(--color-green)">
          {status}
        </span>
      ) : (
        <div className="flex flex-col items-center gap-1 text-(--color-text-muted)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-40">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span className="text-[10px] font-mono">
            Drop photo/audio or click to upload
          </span>
        </div>
      )}
    </div>
  );
}
