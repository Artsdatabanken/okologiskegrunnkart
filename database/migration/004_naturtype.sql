
DELETE FROM public.kart WHERE datasettkode='NAT';
DELETE FROM public.datasett WHERE datasettkode='NAT';

INSERT INTO datasett VALUES ('NAT', 'Natursystem');

-- NT
INSERT INTO kart (datasettkode, navn, data, geom)
SELECT 'NAT', null, 
  import_nin.naturtype_nt_json(naturtypeid)::jsonb || import_nin.variabel_nt_json(naturtypeid)::jsonb,  
  ST_Transform(shape, 4326) AS geom 
FROM import_nin.områdernt
GROUP BY naturtypeid, shape;

-- 1:20000
INSERT INTO kart (datasettkode, data, geom)
SELECT 'NAT',  
import_nin.naturtype_20k_json(område20kid)::jsonb || import_nin.variabel_20k_json(område20kid)::jsonb, 
ST_Transform(shape, 4326) AS geom 
FROM import_nin.områder20k
GROUP BY område20kid, shape;

-- 1:5000
INSERT INTO kart (datasettkode, data, geom)
SELECT 'NAT', 
import_nin.naturtype_5k_json(område5kid)::jsonb || import_nin.variabel_5k_json(område5kid)::jsonb , 
ST_Transform(shape, 4326) AS geom 
FROM import_nin.områder5k
GROUP BY område5kid, shape;


docker run --rm -v /home:/home bjreppen/gdal-mbtiles:latest ogr2ogr -f "PostgreSQL" PG:"dbname=postgres host=172.17.0.27 user=postgres password=veldighemmelig" $PWD/build/nin.geojsonl  -lco SCHEMA=import -nln nin -lco OVERWRITE=YES


INSERT INTO public.kart (datasettkode, id, data, geom) SELECT 'NAT', id, props::JSONB, wkb_geometry AS geom FROM import.nin;

