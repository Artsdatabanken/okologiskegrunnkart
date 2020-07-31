#!/bin/bash -e
# Builds mbtiles complete with overviews for a single layer using data from the Mapproxy SQLITE databases

echo Updating metadata for $1...
TILECOUNT=`sqlite3 $1 'SELECT count(*) from tiles'`
echo Tile count: $TILECOUNT
MAX_ZOOM=`sqlite3 $1 'SELECT value from metadata where name="maxzoom"'`
if [ -z ${MAX_ZOOM} ]; then 
    echo "New file, filling metadata.."; 
    MAX_ZOOM=`sqlite3 $1 'SELECT MAX(zoom_level) from tiles'`
    if [ -z ${MAX_ZOOM} ]; then 
      echo "Empty source file."
      exit
    else
      sqlite3 $1 'INSERT INTO metadata (name,value) VALUES ("minzoom", '"$MAX_ZOOM"')'
      sqlite3 $1 'INSERT INTO metadata (name,value) VALUES ("maxzoom", '"$MAX_ZOOM"')'
      sqlite3 $1 'INSERT INTO metadata (name,value) VALUES ("format", "png")'
      NEED_NEW_OVERVIEWS=true
    fi
else 
    echo "Metadata ok, maxzoom set to ${MAX_ZOOM}"; 
fi

NEWEST_TILE=`sqlite3 $1 'SELECT max(last_modified) from tiles where zoom_level="'"$MAX_ZOOM"'"'`
echo Removing overview tiles older than: $NEWEST_TILE
TRASH_COUNT=`sqlite3 $1 'DELETE FROM tiles WHERE zoom_level<'$MAX_ZOOM' AND last_modified<"'"$NEWEST_TILE"'"'`
if [ -z ${TRASH_COUNT} ]; then 
    echo "Trashed no tiles.";
else
    echo "Trashed $TRASH_COUNT tiles.";
    NEED_NEW_OVERVIEWS=true
fi


if [ -z ${NEED_NEW_OVERVIEWS} ]; then 
    echo "Overviews are ok.";
else
    echo "Refreshing overviews.";
#    gdaladdo -r cubic -minsize 1 $1
    docker run --rm -v /home:/home osgeo/gdal:alpine-small-latest gdaladdo -r cubic -minsize 1 $1
fi

echo "zoom|avg.bytes|tile count"
sqlite3 $1 "SELECT zoom_level, AVG(length(tile_data)), count(*) from tiles WHERE length(tile_data)<>1189 GROUP By zoom_level;"

