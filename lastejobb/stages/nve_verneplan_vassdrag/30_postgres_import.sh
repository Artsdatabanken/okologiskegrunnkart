#!/bin/bash 
set -e

echo "Importing to database"
docker run --rm -e OGR_GEOJSON_MAX_OBJ_SIZE=999 -v /home:/home osgeo/gdal:alpine-small-latest ogr2ogr -f "PostgreSQL" PG:"dbname=postgres host=172.17.0.2 user=postgres password=veldighemmelig" $PWD/temp/kommune.geojson -lco SCHEMA=import -nln kommune -lco OVERWRITE=YES



docker run --rm -v /home:/home osgeo/gdal:alpine-small-latest ogr2ogr -f "PostgreSQL" PG:"dbname=postgres host=172.17.0.2 user=postgres password=veldighemmelig" $PWD/temp/Natur_0000_Norge_25833_VerneplanVassdrag_GML.gml  -lco SCHEMA=import -nln fylke -lco OVERWRITE=YES
