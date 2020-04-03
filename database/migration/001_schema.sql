CREATE EXTENSION postgis;

CREATE SCHEMA import;

CREATE TABLE public.datasett (datasettkode char(3), navn varchar);

DROP TABLE public.kart

CREATE TABLE public.kart (
   datasettkode char(3), kode varchar, navn varchar, bbox geometry, geom geometry);

CREATE INDEX geometries_geom_idx
  ON public.kart
  USING GIST (geom);

