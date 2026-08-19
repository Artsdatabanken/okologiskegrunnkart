#!/bin/bash -e
# Updates metadata and overview tiles for a single MBTiles file.
#
# This script works on an existing MBTiles database produced from the MapProxy
# cache. It ensures required metadata exists, removes stale overview tiles, and
# regenerates overview zoom levels when needed.
#
# Expected input:
#   $1 = path to an MBTiles file
#
# Main steps:
# 1. Count tiles and inspect metadata.
# 2. Initialize `minzoom`, `maxzoom`, and `format` for new files.
# 3. Remove outdated overview tiles older than the newest base-level tile.
# 4. Rebuild overviews with GDAL when metadata was added or stale tiles removed.
# 5. Print a small per-zoom summary at the end.

echo Updating metadata for $1...

# Show the total number of tiles currently present in the MBTiles file.
TILECOUNT=`sqlite3 $1 'SELECT count(*) from tiles'`
echo Tile count: $TILECOUNT

# Read the current max zoom from metadata. If it is missing, treat the file as a
# newly created dataset that still needs metadata initialization.
MAX_ZOOM=`sqlite3 $1 'SELECT value from metadata where name="maxzoom"'`
if [ -z ${MAX_ZOOM} ]; then 
    echo "New file, filling metadata.."; 

    # Determine the highest zoom actually present in the tiles table.
    MAX_ZOOM=`sqlite3 $1 'SELECT MAX(zoom_level) from tiles'`
    if [ -z ${MAX_ZOOM} ]; then 
      echo "Empty source file."
      exit
    else
      # Initialize minimal MBTiles metadata so downstream tools know the source
      # zoom range and tile format.
      sqlite3 $1 'INSERT INTO metadata (name,value) VALUES ("minzoom", '"$MAX_ZOOM"')'
      sqlite3 $1 'INSERT INTO metadata (name,value) VALUES ("maxzoom", '"$MAX_ZOOM"')'
      sqlite3 $1 'INSERT INTO metadata (name,value) VALUES ("format", "png")'
      NEED_NEW_OVERVIEWS=true
    fi
else 
    echo "Metadata ok, maxzoom set to ${MAX_ZOOM}"; 
fi

# Find the newest tile timestamp at the highest zoom level. This is used as the
# freshness cutoff for lower-resolution overview tiles.
NEWEST_TILE=`sqlite3 $1 'SELECT max(last_modified) from tiles where zoom_level="'"$MAX_ZOOM"'"'`
echo Removing overview tiles older than: $NEWEST_TILE

# Remove lower zoom tiles that are older than the latest highest-zoom tile.
# Those overviews may have been generated from outdated source tiles and should
# be rebuilt.
TRASH_COUNT=`sqlite3 $1 'DELETE FROM tiles WHERE zoom_level<'$MAX_ZOOM' AND last_modified<"'"$NEWEST_TILE"'"'`
if [ -z ${TRASH_COUNT} ]; then 
    echo "Trashed no tiles.";
else
    echo "Trashed $TRASH_COUNT tiles.";
    NEED_NEW_OVERVIEWS=true
fi

# Only rebuild overviews when something changed.
if [ -z ${NEED_NEW_OVERVIEWS} ]; then 
    echo "Overviews are ok.";
else
    echo "Refreshing overviews.";
#    gdaladdo -r cubic -minsize 1 $1

    # Run GDAL from Docker rather than relying on a host installation.
    docker run --rm -v /home:/home ghcr.io/osgeo/gdal:alpine-small-latest gdaladdo -r cubic -minsize 1 $1
fi

# Print a compact summary of tile sizes and counts per zoom level.
# The `length(tile_data)<>1189` filter preserves the legacy behavior of this
# script and excludes a specific tile size that is apparently not useful in the
# final summary.
echo "zoom|avg.bytes|tile count"
sqlite3 $1 "SELECT zoom_level, AVG(length(tile_data)), count(*) from tiles WHERE length(tile_data)<>1189 GROUP By zoom_level;"

echo "Perfoming defragmen - sqlite vacuum"
sqlite3 $1 "VACUUM;"

