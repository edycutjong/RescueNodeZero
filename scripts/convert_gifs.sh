#!/bin/bash
# convert_gifs.sh — Convert all WebM files to optimized, looping GIFs (<10MB)
# Usage: ./scripts/convert_gifs.sh [directory]
# Default directory: docs/

DIR="${1:-docs}"

echo "🎥 Converting WebM files in '$DIR' to high-quality GIFs..."

# Check for ffmpeg
FFMPEG=$(command -v ffmpeg || echo "$HOME/homebrew/bin/ffmpeg")
if [ ! -x "$FFMPEG" ]; then
  echo "❌ ffmpeg not found. Install with: brew install ffmpeg"
  exit 1
fi

count=0
for file in "$DIR"/*.webm; do
  if [ -f "$file" ]; then
    filename=$(basename "$file" .webm)
    output="$DIR/$filename.gif"
    
    echo "  -> Converting $filename.webm to $filename.gif"
    
    # fps=10, width=800px, diff-based palette for small file size
    "$FFMPEG" -y -hide_banner -loglevel error -i "$file" \
      -vf "fps=10,scale=800:-1:flags=lanczos,split[s0][s1];[s0]palettegen=stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle" \
      "$output"
    
    size=$(du -h "$output" | cut -f1)
    echo "  ✅ Done: $output ($size)"
    count=$((count + 1))
  fi
done

if [ $count -eq 0 ]; then
  echo "⚠️  No .webm files found in '$DIR'"
else
  echo "🎉 $count file(s) converted successfully!"
fi
