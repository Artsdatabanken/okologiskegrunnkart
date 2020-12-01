INSERT INTO datasett VALUES ('VV', 'Naturvernområde');

DELETE FROM kart WHERE datasettkode='VV';

INSERT INTO kart (datasettkode, id, navn, geom)
--SELECT 'VV' as kortkode, kode, (navn::json)->>'nob' AS navn, wkb_geometry AS geom 
SELECT 'VV' as kortkode, kode, '?', wkb_geometry AS geom 
FROM import.naturvernområde;
