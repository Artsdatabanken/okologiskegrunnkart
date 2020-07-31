#!/bin/bash -e
# Seed cache with mbtiles using mapproxy
docker run -u 1000:1000 -v /home/grunnkart/mapproxy:/mapproxy --entrypoint="/usr/local/bin/mapproxy-seed" -w="/mapproxy" kartoza/mapproxy -f mapproxy.yaml -s seed.yaml --dry-run --seed ALL --continue
