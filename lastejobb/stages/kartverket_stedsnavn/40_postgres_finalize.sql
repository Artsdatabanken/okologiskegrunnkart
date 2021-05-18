-- Slett eksisterende data
DROP TABLE IF EXISTS stedsnavn;
DELETE FROM datasett WHERE datasettkode='SSR';

-- Sett inn nye
INSERT INTO datasett VALUES ('SSR', 'Stedsnavn');

CREATE TABLE stedsnavn AS
SELECT stedsnummer, komplettskrivemåte, sortering, navneobjekthovedgruppe, navneobjektgruppe,
    navneobjekttype, kommunenummer, kommunenavn, fylkesnummer, fylkesnavn, wkb_geometry geom 
FROM import.sted;

-- index
CREATE INDEX stedsnavn_geom_idx on stedsnavn using gist(geom);
ALTER TABLE stedsnavn CLUSTER ON stedsnavn_geom_idx;


-- REST API function 
-- http://localhost:3000/rpc/stedsnavn?lat=63&lng=10.5&zoom=6

CREATE OR REPLACE FUNCTION stedsnavn_zoom_til_minpri(zoom numeric)
RETURNS character(10) AS $$
	SELECT CASE 
		WHEN zoom<3 THEN 'viktighetN'
		WHEN zoom<4.8 THEN 'viktighetM'
		WHEN zoom<7 THEN 'viktighetL'
		WHEN zoom<8 THEN 'viktighetK'
		WHEN zoom<9 THEN 'viktighetJ'
		WHEN zoom<10 THEN 'viktighetI'
		WHEN zoom<11 THEN 'viktighetH'
		WHEN zoom<12 THEN 'viktighetG'
		WHEN zoom<13 THEN 'viktighetF'
		WHEN zoom<14 THEN 'viktighetE'
		WHEN zoom<15.5 THEN 'viktighetD'
		ELSE 'viktighetC'
    END;
$$ LANGUAGE SQL;

--       SELECT * FROM stedsnavn_zoom_til_minpri(zoom+3)
--$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION stedsnavn_zoom_til_maxpri(zoom numeric)
RETURNS character(10) AS $$
	SELECT CASE 
		WHEN zoom<3 THEN 'viktighetL'
		WHEN zoom<4.8 THEN 'viktighetK'
		WHEN zoom<7 THEN 'viktighetJ'
		WHEN zoom<8 THEN 'viktighetI'
		WHEN zoom<9 THEN 'viktighetH'
		WHEN zoom<10 THEN 'viktighetG'
		WHEN zoom<11 THEN 'viktighetF'
		WHEN zoom<12 THEN 'viktighetE'
		WHEN zoom<13 THEN 'viktighetD'
		WHEN zoom<14 THEN 'viktighetC'
		WHEN zoom<15.5 THEN 'viktighetB'
	ELSE 'viktighetA'
    END;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION stedsnavn(lng numeric, lat numeric, zoom numeric)
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
AND sortering <= stedsnavn_zoom_til_minpri(zoom)
AND sortering >= stedsnavn_zoom_til_maxpri(zoom)
ORDER BY sortering DESC, geom <-> ST_Transform(ST_SetSRID(ST_Point(lng,lat),4326),25833)::geometry
$$ LANGUAGE SQL IMMUTABLE;
