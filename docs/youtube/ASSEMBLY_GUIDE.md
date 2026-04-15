# 🎬 Video Assembly Guide

> How to combine the recorded segments into a final YouTube-ready video

---

## Recording Setup

### Automated Capture (Playwright)

```bash
cd /Users/edycu/Projects/Hackathon/RescueNodeZero
# Ensure backend is running
cd backend && DEMO_MODE=true uvicorn main:app --port 8000 --reload &

# Ensure frontend is running
cd frontend && npm run dev &

# Run automated capture
node scripts/capture_video.js
```

### Manual Recording (Faster Path)

1. Open OBS Studio or QuickTime screen recording
2. Set resolution to 1920×1080
3. Open http://localhost:3000
4. Follow the `VIDEO_SCRIPT.md` scene breakdown
5. Record, then upload directly to YouTube

---

## Recommended Segments to Record

| # | Scene | Duration | Content |
|---|---|---|---|
| 1 | Dashboard Overview | ~15s | Full dashboard with all panels, offline badge, stats |
| 2 | HAZMAT Search | ~20s | Type "chemical burn treatment acetone" → results load in 0.9ms |
| 3 | Medical Triage | ~10s | Search "crush syndrome field extraction" → protocol cards |
| 4 | Drone Image Upload | ~15s | Drag image into upload zone → CLIP captioning → searchable |
| 5 | Audio Report Upload | ~15s | Drag audio file → Whisper transcription → indexed |
| 6 | Allergen Filters | ~10s | Toggle penicillin filter → results update |
| 7 | Inventory Panel | ~10s | Show LOW STOCK / CRITICAL badges |
| 8 | B-Roll | ~5s | Clean static shots for overlays |

---

## Timeline Assembly (CapCut / DaVinci Resolve / Premiere)

```
[0:00 ─ 0:03]  Title card — "⚡ RescueNode Zero" on dark navy bg (#0f172a)
[0:03 ─ 0:08]  Text overlay: "When the grid goes dark, the AI stays on."
[0:08 ─ 0:25]  → Segment 1: Dashboard Overview (pan across panels)
[0:25 ─ 0:45]  → Segment 2: HAZMAT search (focus on 0.9ms latency badge)
[0:45 ─ 0:55]  → Segment 3: Medical Triage (crush syndrome)
[0:55 ─ 1:15]  → Segments 4+5: Multimodal (drone + audio uploads)
[1:15 ─ 1:35]  → Segments 6+7: Allergen filters + inventory
[1:35 ─ 1:45]  → Zoom out to full dashboard
[1:45 ─ 2:00]  End card — logo + GitHub URL + hackathon badge
```

---

## Text Overlays to Add

| Timestamp | Overlay Text | Style |
|---|---|---|
| 0:03 | `WHEN THE GRID GOES DARK` | Large, white, fade in |
| 0:08 | `THE AI STAYS ON` | Large, cyan glow, fade in |
| 0:12 | `49 documents • 0.9ms • 100% offline` | Small subtitle, cyan |
| 0:28 | `HAZMAT SEARCH: "chemical burn treatment acetone"` | Lower third, cyan badge |
| 0:32 | `⚡ 0.9ms — RRF Fusion (Semantic + Keyword)` | Center, cyan pulse |
| 0:47 | `🏥 CRUSH SYNDROME — Field Extraction Protocol` | Lower third, amber |
| 0:58 | `📸 DRONE RECON — MobileCLIP Captioning (Local)` | Lower third, cyan |
| 1:08 | `🎙️ AUDIO REPORT — Whisper Transcription (Local)` | Lower third, green |
| 1:20 | `⚠️ ALLERGEN FILTER: Penicillin excluded` | Center, red badge |
| 1:30 | `📦 INVENTORY: LOW STOCK / CRITICAL alerts` | Lower third, amber |
| 1:50 | `github.com/edycutjong/RescueNodeZero` | End card, white |

---

## Audio Track Options

1. **Voiceover**: Record using `VIDEO_SCRIPT.md` narration
2. **No voice**: Add text callout overlays at each key moment instead
3. **AI Voice**: Use ElevenLabs TTS with the script

---

## Export Settings (YouTube Optimized)

| Setting | Value |
|---|---|
| Resolution | 1920×1080 |
| Frame rate | 30fps |
| Codec | H.264 / H.265 |
| Bitrate | 12–16 Mbps |
| Format | MP4 |
| Audio | AAC, 48kHz, 320kbps |

---

## Quick Upload Checklist

- [x] Video exported as MP4 (H.264)
- [x] Thumbnail uploaded (`thumbnail.png`, 1280×720)
- [ ] Title, description, and tags pasted from `YOUTUBE_METADATA.md`
- [ ] Timestamps added to description
- [ ] Category: Science & Technology
- [ ] Not made for kids
- [ ] 3 hashtags set: `#RescueNodeZero #ActianVectorAI #DoraHacks`
- [ ] End screen added (subscribe + GitHub link)
