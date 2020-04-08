INSERT INTO datasett VALUES ('FYL', 'Fylke');

DELETE FROM public.kart WHERE datasettkode='FYL';

INSERT INTO public.kart (datasettkode, id, navn, bbox, geom)
SELECT 'FYL' as kortkode, autorkode, (navn::json)->>'nob' AS navn, ST_Extent(wkb_geometry) AS bbox, wkb_geometry AS geom 
FROM import.fylke
GROUP BY fylke.autorkode, navn, wkb_geometry;

