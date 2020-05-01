-- Slett eksisterende data
DROP TABLE IF EXISTS stedsnavn;
DELETE FROM datasett WHERE datasettkode='SSR';

-- Sett inn nye
INSERT INTO datasett VALUES ('SSR', 'Stedsnavn');

CREATE TABLE stedsnavn AS
SELECT stedsnummer, komplettskrivemåte, sortering, navneobjekthovedgruppe, navneobjektgruppe,
    navneobjekttype, kommunenummer, kommunenavn, fylkesnummer, fylkesnavn, wkb_geometry geom 
FROM import.stedsnavn 
limit 10000;

-- index
CREATE INDEX stedsnavn_geom_idx on stedsnavn using gist(geom) 
ALTER TABLE stedsnavn CLUSTER ON stedsnavn_geom_idx;


-- REST API function 
-- http://localhost:3000/rpc/stedsnavn?lat=63&lng=10.5

DROP FUNCTION IF EXISTS stedsnavn
CREATE OR REPLACE FUNCTION stedsnavn(lng numeric, lat numeric)
RETURNS TABLE (
	stedsnummer integer,
    "komplettskrivemåte" character varying[],
    sortering character varying(10),
    navneobjekthovedgruppe character varying(23),
    navneobjektgruppe character varying(24) ,
    navneobjekttype character varying(33) ,
    kommunenummer integer[],
    kommunenavn character varying[],
    fylkesnummer integer[],
    fylkesnavn character varying[],
    geom geometry(Geometry,25833),
	distanceMeters integer
 ) AS $$
SELECT DISTINCT ON (sortering) 
 *, ST_Distance(geom,ST_Transform(ST_SetSRID(ST_Point(lng,lat),4326),25833)::geometry)::integer distanceMeters
FROM stedsnavn
WHERE ST_DWithin(geom, ST_Transform(ST_SetSRID(ST_Point(lng,lat),4326),25833), 50000.0)
ORDER BY sortering DESC, geom <-> ST_Transform(ST_SetSRID(ST_Point(lng,lat),4326),25833)::geometry
$$ LANGUAGE SQL IMMUTABLE;
