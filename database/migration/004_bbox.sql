INSERT INTO datasett VALUES ('VV', 'Naturvernområde');

DELETE FROM kart WHERE datasettkode='VV'

INSERT INTO kart (datasettkode, kode, navn, geom)
--SELECT 'VV' as kortkode, kode, (navn::json)->>'nob' AS navn, wkb_geometry AS geom 
SELECT 'VV' as kortkode, kode, '?', wkb_geometry AS geom 
FROM import.naturvernområde



UPDATE kart SET bbox=ST_Extent(geom)

UPDATE kart SET bbox=subq.bbox FROM (SELECT ST_Extent(geom) FROM kart AS bbox) AS subq;
;
