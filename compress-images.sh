#!/bin/bash

# Usage: ./compress-images.sh path/to/images/

INPUT_DIR="${1:-.}"
OUTPUT_DIR="$INPUT_DIR/compressed"
QUALITY=75  # Adjust this (0–100) for desired compression

mkdir -p "$OUTPUT_DIR"

find "$INPUT_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | while read -r img; do
    filename=$(basename "$img")
    ext="${filename##*.}"
    name="${filename%.*}"

    if [[ "$ext" =~ ^[Jj][Pp][Ee]?[Gg]$ ]]; then
        convert "$img" -strip -interlace Plane -gaussian-blur 0.05 -quality $QUALITY "$OUTPUT_DIR/$filename"
    elif [[ "$ext" =~ ^[Pp][Nn][Gg]$ ]]; then
        convert "$img" -strip -quality $QUALITY PNG24:"$OUTPUT_DIR/$filename"
    fi

    echo "Compressed: $filename"
done

