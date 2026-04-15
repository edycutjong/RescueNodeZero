#!/bin/bash

echo "🎥 Converting WebM files to high-quality GIFs..."

# Loop through all webm files in the docs directory
for file in docs/*.webm; do
  # Check if the file actually exists to avoid loop issues
  if [ -f "$file" ]; then
    # Extract just the filename without the .webm extension
    filename=$(basename "$file" .webm)
    output="docs/$filename.gif"
    
    echo "  -> Converting $filename.webm to $filename.gif"
    
    # Run ffmpeg with high-quality palette generation and scaling
    # fps=15 (smooth enough for UI, keeps file size down)
    # scale=1280:-1 (resize width to 1280px, auto-calculate height)
    /Users/edycu/homebrew/bin/ffmpeg -y -hide_banner -loglevel error -i "$file" -vf "fps=10,scale=800:-1:flags=lanczos,split[s0][s1];[s0]palettegen=stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle" "$output"
    
    echo "  ✅ Done: $output"
  fi
done

echo "🎉 All files successfully converted!"
