INSERT INTO datasett VALUES ('KOM', 'Kommune');

DELETE FROM public.kart WHERE datasettkode='KOM'

INSERT INTO public.kart (datasettkode, kode, navn, geom)
SELECT 'KOM' as kortkode, kode, (navn::json)->>'nob' AS navn, wkb_geometry AS geom 
FROM import.kommune


INSERT INTO kart (datasettkode, kode, navn, bbox, geom)
SELECT 'KOM' as kortkode, kode, (navn::json)->>'nob' AS navn, ST_Extent(wkb_geometry) AS bbox, wkb_geometry AS geom 
FROM import.kommune
GROUP BY kommune.kode, navn, wkb_geometry;

INSERT INTO kart (datasettkode, navn, bbox, geom)
SELECT 'KOM' as kortkode, (navn::json)->>'nob' AS navn, ST_Extent(wkb_geometry) AS bbox, wkb_geometry AS geom 
FROM import.kommune
GROUP BY kommune.kode, navn, wkb_geometry;
