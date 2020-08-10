#!/bin/bash -e
# Display a report of the mbtiles built

find "$PWD/build" -type f -name "*.mbtiles" -exec ./show_build_statistics_for_file.sh {} \;

