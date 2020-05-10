-- Slett eksisterende data
DELETE FROM kart WHERE datasettkode='DTM';
DELETE FROM datasett WHERE datasettkode='DTM';

-- Sett inn nye
INSERT INTO datasett VALUES ('DTM', 'Terrengmodell');
INSERT INTO kart (datasettkode, id, navn, bbox, geom)
SELECT 
    'DTM' as kortkode, 
    DTMmunenummer, 
    ((navn::json)->0->>'navn') AS navn, 
    ST_Extent(wkb_geometry) AS bbox, wkb_geometry AS geom 
FROM import.DTMmune
GROUP BY DTMmune.DTMmunenummer, navn, wkb_geometry;
