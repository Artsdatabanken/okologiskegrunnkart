INSERT INTO datasett VALUES ('FYL', 'Fylke');

DELETE FROM public.kart WHERE datasettkode='FYL';

INSERT INTO public.kart (datasettkode, kode, navn, bbox, geom)
SELECT 'FYL' as kortkode, kode, (navn::json)->>'nob' AS navn, ST_Extent(wkb_geometry) AS bbox, wkb_geometry AS geom 
FROM import.fylke
GROUP BY fylke.kode, navn, wkb_geometry;

INSERT INTO public.kart (datasettkode, navn, bbox, geom)
SELECT 'FYL' as kortkode, (navn::json)->>'nob' AS navn, ST_Extent(wkb_geometry) AS bbox, wkb_geometry AS geom 
FROM import.fylke
GROUP BY navn, wkb_geometry;
