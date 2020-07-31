#!/bin/bash -e

rsync -avhW --max-size=10m build/*.mbtiles grunnkart@hydra:~/tilesdata/grunnkart/

