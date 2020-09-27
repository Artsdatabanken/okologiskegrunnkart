#!/bin/bash -e
cd /home/grunnkart/mapproxy/

# Update mapproxy layer configuration from configuration at https://forvaltningsportaladmin.artsdatabanken.no/admin/
DEBUG=*
npm run build >>makeconfig.log

# Refresh cache sets
docker run -u 1000:1004 -v /home/grunnkart/mapproxy:/mapproxy --entrypoint="/usr/local/bin/mapproxy-seed" -w="/mapproxy" kartoza/mapproxy -f mapproxy.yaml -s seed.yaml --seed ALL --continue

# Build .mbtiles cache with overview zoom levels from 0 to lowest available zoom in source set.
./build_all_mbtiles.sh >>makeconfig.log
