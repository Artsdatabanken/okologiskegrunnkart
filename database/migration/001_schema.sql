CREATE EXTENSION postgis;

CREATE SCHEMA import;
CREATE SCHEMA import_nin;

CREATE TABLE public.datasett (datasettkode char(3), navn varchar);

DROP TABLE public.kart

CREATE TABLE public.kart (
   datasettkode char(3), id varchar, navn varchar, data json, bbox geometry, geom geometry);

CREATE INDEX geometries_geom_idx
  ON public.kart
  USING GIST (geom);

CREATE INDEX kart_datasett ON kart (datasettkode);
