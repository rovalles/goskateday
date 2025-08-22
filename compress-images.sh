#!/bin/bash
set -euo pipefail

# Compress images stored under ./compress/<year>/ and build year JSON metadata.
# Each image is saved to ./data/images/<year>/.
# Existing images are preserved; duplicates are copied to ./compress/duplicate/<year>/.

QUALITY=75
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_DIR="$BASE_DIR/compress"
DEST_BASE="$BASE_DIR/data/images"
DUP_BASE="$SOURCE_DIR/duplicate"

compress_image() {
  local img="$1"
  local dest_dir="$2"
  local dup_dir="$3"

  local filename="$(basename "$img")"
  local dest_file="$dest_dir/$filename"

  if [[ -e "$dest_file" ]]; then
    mkdir -p "$dup_dir"
    cp "$img" "$dup_dir/$filename"
    echo "Duplicate found: $filename copied to $dup_dir"
    return
  fi

  local ext="${filename##*.}"
  if [[ "$ext" =~ ^[Jj][Pp][Ee]?[Gg]$ ]]; then
    convert "$img" -strip -interlace Plane -gaussian-blur 0.05 -quality "$QUALITY" "$dest_file"
  elif [[ "$ext" =~ ^[Pp][Nn][Gg]$ ]]; then
    convert "$img" -strip -quality "$QUALITY" PNG24:"$dest_file"
  else
    echo "Skipping unsupported file: $img"
    return
  fi
  echo "Compressed: $filename -> $dest_file"
}

generate_json() {
  local year="$1"
  local dest_dir="$2"
  local filePath="$BASE_DIR/data/${year}.json"

  local images
  images=$(ls -1 "$dest_dir" 2>/dev/null | \
            sort | jq -R -s -c 'split("\n")[:-1] | map("/data/images/'"$year"'/" + .)')

  if [[ -f "$filePath" ]]; then
    jq --argjson imgs "$images" '.galleryImages = $imgs' "$filePath" > "$filePath.tmp"
  else
    jq -n --arg date "${year}-06-21" \
          --arg gid "event-gallery-${year}" \
          --argjson imgs "$images" \
          '{date:$date, galleryId:$gid, galleryImages:$imgs, spots:[], sponsors:[]}' \
          > "$filePath.tmp"
  fi
  mv "$filePath.tmp" "$filePath"
}

process_year() {
  local year_path="$1"
  local year="$(basename "$year_path")"
  local dest_dir="$DEST_BASE/$year"
  local dup_dir="$DUP_BASE/$year"

  mkdir -p "$dest_dir"

  find "$year_path" -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | while read -r img; do
    compress_image "$img" "$dest_dir" "$dup_dir"
  done

  generate_json "$year" "$dest_dir"
}

main() {
  for year_path in "$SOURCE_DIR"/*; do
    [[ -d "$year_path" ]] || continue
    process_year "$year_path"
  done
}

main "$@"
