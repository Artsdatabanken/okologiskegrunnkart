#!/bin/bash 
set -e

exit 99
echo "Importing to database"
docker run --rm -v /home:/home osgeo/gdal:alpine-small-latest ogr2ogr -f "PostgreSQL" PG:"dbname=postgres host=172.17.0.2 user=postgres password=veldighemmelig" $PWD/temp/Basisdata_0000_Norge_25833_Stedsnavn_GML.gml -lco SCHEMA=import -nln stedsnavn -lco OVERWRITE=YES
