-- Slett eksisterende data
DELETE FROM kart WHERE datasettkode='KOM';
DELETE FROM datasett WHERE datasettkode='KOM';

-- Sett inn nye
INSERT INTO datasett VALUES ('KOM', 'Kommune');
INSERT INTO kart (datasettkode, id, navn, bbox, geom)
SELECT 
    'KOM' as kortkode, 
    kommunenummer, 
    ((navn::json)->0->>'navn') AS navn, 
    ST_Extent(wkb_geometry) AS bbox, wkb_geometry AS geom 
FROM import.kommune
GROUP BY kommune.kommunenummer, navn, wkb_geometry;
