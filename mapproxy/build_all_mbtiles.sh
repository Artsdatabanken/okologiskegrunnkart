#!/bin/bash -e
# Seeds the complete set of mbtiles for all layers and renders all missing overview zoom levels

for d in $PWD/cache/*/; do
    ./build_single_mbtiles.sh $d
done
