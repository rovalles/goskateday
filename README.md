# goskateday

Utilities for managing Go Skate Day images.

## Image workflow

The repository includes a `compress-images.sh` script that:

- scans `compressed/<year>` for source images
- writes compressed copies to `data/images/<year>` without removing the originals
- copies any would-be overwrites to `compression/duplicate/<year>`
- generates or updates `data/<year>.json` with the current list of gallery images

Run the script after placing photos in their year folder:

```bash
./compress-images.sh
```

This workflow requires [`jq`](https://stedolan.github.io/jq/) and ImageMagick's `convert` command.
