#!/bin/bash 
set -e

hello() {
    echo "$*"
}

raster2pgsql() {
    echo `"$*"`
}


#-- Prepare: Create the table
raster2pgsql "-s 25833 -p temp/7911_50m_33.tif dtm |psql"

