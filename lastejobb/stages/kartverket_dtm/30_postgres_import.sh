#!/bin/bash 
set -e

echo "Importing to database"

raster2pgsql() {
  docker run --rm -v /home:/home artsdatabanken/raster2pgsql:latest raster2pgsql $*
}


#-- Prepare: Create the table
raster2pgsql -s 25833 -p $PWD/temp/7911_50m_33.tif dtm |psql

#-- Tile and import all files 
for f in temp/*_50m_33.tif ; do raster2pgsql -s 25833 -t 128x128 -a $(readlink -f $f) dtm |psql ; done
#raster2pgsql -s 25833 -t 128x128 -a $PWD/temp/7911_50m_33.tif dtm |psql 

#
#SELECT rid, ST_Value(rast, foo.pt_geom) 
#FROM dtm CROSS JOIN (SELECT ST_Transform(ST_SetSRID(ST_Point(10.3652865,63.4329034), 4326),25833) As pt_geom) As foo 
#WHERE ST_Value(rast,foo.pt_geom) IS NOT NULL;
#
#SELECT rid, ST_Value(rast, ST_Transform(ST_SetSRID(ST_MakePoint(10.3652865,63.4329034),4326),25833))
#FROM dtm      
#WHERE ST_Intersects(rast, ST_Transform(ST_SetSRID(ST_MakePoint(10.3652865,63.4329034),4326),25833));
