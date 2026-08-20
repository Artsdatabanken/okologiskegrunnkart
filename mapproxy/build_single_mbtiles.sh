#!/bin/bash -e
# Builds the final MBTiles file for a single layer from the newest MapProxy cache.
#
# Expected input:
#   $1 = path prefix to the layer cache directory, for example:
#        /mapproxy/cache/MyLayer/
#
# The script looks for the newest `.mbtile` file under either:
#   ${1}webmercator
#   ${1}google
#
# It then copies that file into the shared destination directory using the layer
# directory name as the output filename, and finally generates any missing
# overview zoom levels by calling `build_single_mbtiles_overviews.sh`.
#
# If the destination MBTiles file is newer than the newest cache file, the layer
# is skipped.

# Directory where final MBTiles datasets are stored.
DEST_PATH=/home/steinho/tilesdata/grunnkart

# Prefer the webmercator cache if it exists.
SOURCE_PATH=$1webmercator
if [ ! -d $SOURCE_PATH ]; then
  # Fall back to the google grid cache when webmercator is not available.
  echo Using google
  SOURCE_PATH=$1google
fi

# There may be multiple cache files present. Use the newest one.
SOURCE_MBTILES=$(ls -Art $SOURCE_PATH/*.mbtiles | tail -n 1)

# Abort early when no cache file exists for the selected source path.
if [ -z ${SOURCE_MBTILES} ]; then 
  echo No .mbtiles found in $SOURCE_PATH
  exit
fi

# Use the last path component of the input directory as dataset name.
DATASET=$( basename $1 )

# Final output file written to the shared destination directory.
TARGET_MBTILES=$DEST_PATH/${DATASET##*/}.mbtiles        

# Skip rebuilding when the target file is already newer than the latest cache.
if [[ $TARGET_MBTILES -nt $SOURCE_MBTILES ]]; 
then
  echo $DATASET Nothing new, moving on..
else
  # Copy the newest cache snapshot into place and build overview zoom levels.
  echo Processing more recent cache file for $TARGET_MBTILES
  cp $SOURCE_MBTILES $TARGET_MBTILES
  ./build_single_mbtiles_overviews.sh "$TARGET_MBTILES"
fi


