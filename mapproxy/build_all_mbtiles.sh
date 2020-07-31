#!/bin/bash -e
# Updates the complete set of mbtiles including overview generation

for d in $PWD/cache/*/; do
    ./build_single_mbtiles.sh $d
done
