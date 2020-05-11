#!/bin/bash 
set -e

echo "Importing to database"

docker run --rm \
  -v /home:/home \
  --env PGUSER=$PGPUSER \
  --env PGPASSWORD=$PGPASSWORD \
  --env PGHOST=$PGHOST \
  osgeo/gdal:alpine-small-latest \
  ogr2ogr -f "PostgreSQL" \
  PG:"dbname=postgres host=$PGHOST user=$PGUSER" \
  $PWD/temp/Basisdata_0000_Norge_25833_Stedsnavn_GML.gml -lco SCHEMA=import_stedsnavn -lco OVERWRITE=YES 
