Build overview cache of zoom levels that are unavailable directly from the online resource. Required operating system: Linux flavored with wget, node and docker preinstalled.

- Overview cache location: https://data.test.artsdatabanken.no/grunnkart/

## Configuration helper scripts

The following scripts are defined in `package.json`, use `npm run <scriptname>` to run.

- _download_: Downloads the souce layers configuration file `kartlag.json`
- _makeconfig_: Create the `mapproxy.yaml` and `seed.yaml` files required by _Mapproxy_. Requires that kartlag.json was first downloaded by issuing `npm run download`
- _deploy_: Deploys this utility to the server

## Seeding map tiles from WMS server

This will seed the single lowest available zoom level for each layer.

Mapproxy seed documentation: https://mapproxy.org/docs/nightly/seed.html

### Dry-run

```bash
docker run -u 1000:1004 -v /home/grunnkart/mapproxy:/mapproxy --entrypoint="/usr/local/bin/mapproxy-seed" -w="/mapproxy" kartoza/mapproxy -f mapproxy.yaml -s seed.yaml --dry-run --seed ALL --continue
```

### Seed all missing or out of date tiles

```bash
docker run -u 1000:1004 -v /home/grunnkart/mapproxy:/mapproxy --entrypoint="/usr/local/bin/mapproxy-seed" -w="/mapproxy" kartoza/mapproxy -f mapproxy.yaml -s seed.yaml --seed ALL --continue
```

## Build overviews

After seeding this will build all the lower zoom levels based on the seeded zoom level.

### Build overviews for all layers

After having seeded, build the output cache files for all layers by issuing this command from the mapproxy directory:

```bash
./build_all_mbtiles.sh
```

### Build overviews for single layer

After having seeded, build the output cache files containing all cached lower zoom levels by issuing this command from the mapproxy directory:

```bash
./build_single_mbtiles.sh cache/BerggrunnN50_BergartflateN50/
```

Check the result at https://data.test.artsdatabanken.no/grunnkart/BerggrunnN50_BergartflateN50.mbtiles/

## Shortcuts taken

2 layers with zoom level of 16 was processed using available data files rather than WMS requests this time as the tile count was huge:

### Kulturminnerlokaliteter_Kulturminnerlokaliteter

- Geonorge: https://kartkatalog.geonorge.no/metadata/kulturminner-lokaliteter/c6896f24-71f9-4203-9b6f-faf3bfe1f5ed

1. Choose download, file format FGDB, tell them about your life and wait patiently for an email. Download and unzip.

Download the data set

```bash
docker run --rm -v /home:/home osgeo/gdal:alpine-small-latest ogr2ogr -t_srs EPSG:3857 $PWD/kulturminner_lokaliteter_3857.shp $PWD/kulturminner_lokaliteter.geojson
```

Build mbtiles

```bash
docker run --rm -u 1000:1004 -v /home:/home osgeo/gdal:alpine-small-latest gdal_rasterize -ot Byte -burn 102 -burn 124 -burn 171 -burn 255 -tr 2.3886571325 2.3886571325 -of MBTiles /home/grunnkart/mapproxy/cache_manual/kulturminner_lokaliteter_3857.shp /home/grunnkart/tilesdata/grunnkart/Kulturminnerlokaliteter_Kulturminnerlokaliteter.mbtiles

sqlite> select length(tile_data), count(*) from tiles group by length(tile_data) order by count(*) desc limit 10;
sqlite> delete from tiles where length(tile_data)=270;

docker run --rm -u 1000:1004 -v /home:/home osgeo/gdal:alpine-small-latest gdaladdo -r cubic -minsize 1 /home/grunnkart/tilesdata/grunnkart/Kulturminnerlokaliteter_Kulturminnerlokaliteter.mbtiles
```

### Forurensetgrunn_Forurensetomrdetilstand

- Geonorge: https://kartkatalog.geonorge.no/metadata/forurenset-grunn/e48e71ac-16fc-4e47-9e7f-c0a4a4bbfad0

Forurensetgrunn_Forurensetomrdetilstand.mbtiles viser inntil videre
cp Forurensetgrunn_Forurensetomrdetilstandpunkt.mbtiles Forurensetgrunn_Forurensetomrdetilstand.mbtiles

### Time estimates for layer downloads based on measurements

Coverage: alt (4.41, 57.92, 34.22, 81.06)

- Zoom 11: 15 minutter
- Zoom 12: 1 time
- Zoom 13: 4 timer
- Zoom 14: 16 timer
- Zoom 15: 64 timer
- Zoom 16: 10 døgn
