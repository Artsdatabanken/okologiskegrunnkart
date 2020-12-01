INSERT INTO datasett VALUES ('KOM', 'Kommune');

DELETE FROM public.kart WHERE datasettkode='KOM';

INSERT INTO kart (datasettkode, id, navn, bbox, geom)
SELECT 'KOM' as kortkode, autorkode, (navn::json)->>'nob' AS navn, ST_Extent(wkb_geometry) AS bbox, wkb_geometry AS geom 
FROM import.kommune
GROUP BY kommune.autorkode, navn, wkb_geometry;
