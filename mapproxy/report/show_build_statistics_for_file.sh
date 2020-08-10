#!/bin/bash -e
# Display a report of the mbtiles built

echo =============$1
echo "zoom|avg.bytes|tile count"
sqlite3 $1 "SELECT zoom_level, AVG(length(tile_data)), count(*) from tiles WHERE length(tile_data)<>1189 GROUP By zoom_level;"

