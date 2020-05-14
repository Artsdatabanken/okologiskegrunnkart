-- Slett eksisterende data
DELETE FROM kart WHERE datasettkode='DTM';
DELETE FROM datasett WHERE datasettkode='DTM';

-- Sett inn nye
INSERT INTO datasett VALUES ('DTM', 'Terrengmodell');


CREATE OR REPLACE FUNCTION elevasjon(lng numeric, lat numeric)
RETURNS float
  AS $$
SELECT ST_Value(rast, ST_Transform(ST_SetSRID(ST_MakePoint(lng, lat),4326),25833))
 FROM dtm
 INNER JOIN ST_Transform(ST_SetSRID(ST_MakePoint(lng, lat),4326),25833) AS geom 
  ON ST_Intersects(dtm.rast, geom)
$$ LANGUAGE SQL IMMUTABLE;
