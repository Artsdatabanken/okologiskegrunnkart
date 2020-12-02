```bash
❯ ogrinfo NiN_hovedbase_2019_20200328.gdb

1: VariablerNaturtyper (None)
2: Variabler20K (None)
3: Variabler5K (None)
4: Prosjekter (Multi Polygon)
5: Prosjekt_Kartleggere (None)
6: Prosjekt_Kontrollører (None)
7: Kode_Variabler (None)
8: Program (None)
9: Kode_Naturtyper (None)
10: Kode_uLKM (None)
11: Kobling_NT_BV (None)
12: Kode_Kartleggingsenheter (None)
13: KartleggingsenheterNT (None)
14: Kartleggingsenheter5K (None)
15: Kartleggingsenheter20K (None)
16: Brukere (None)
17: OmråderNT (Multi Polygon)
18: Områder5K (Multi Polygon)
19: Områder20K (Multi Polygon)
```

```bash
docker run --rm -v /home:/home osgeo/gdal:alpine-small-latest ogr2ogr -f "PostgreSQL" PG:"dbname=postgres host=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' forvaltningsportal-postgres) user=postgres password=veldighemmelig" $PWD/NiN_hovedbase_2019_20200328.gdb.zip -lco SCHEMA=import_nin -lco OVERWRITE=YES
```

```sql
SELECT o.område20kid as id, shape as geom, kartleggingsenhetkode kode
FROM import_nin.områder20k o JOIN import_nin.kartleggingsenheter20k k ON o.område20kid=k.område20kid
WHERE o.område20kid='NIN7109610'
```

## Adhoc

### Variabler

```sql
SELECT to_json(sub) AS container_with_things
FROM  (
   SELECT json_agg(variabelkode) AS "variabelkode"
   FROM   import_nin.kartleggingsenheter20k c
   LEFT   JOIN import_nin.variabler20k ct ON  ct.kartleggingsenhet20kid = c.kartleggingsenhet20kid
   WHERE  c.kartleggingsenhet20kid IN ('NIN7109610-01')
   GROUP  BY c.kartleggingsenhet20kid
   ) sub;
```

"{"variabelkode":["1AR-A-L_3", "7FA_0", "1AR-A-PUsy_0", "1AG-A-0_7", "T4-HI_2", "7SD-0_1", "1AR-A-PIab_2", "1AR-A-B_2", "1AR-A-V_0", "1AR-A-E_0", "1AG-B_3", "T4-BK_1"]}"

### Naturtyper

```sql
SELECT to_json(sub) AS naturtype
FROM  (
   SELECT json_agg(REPLACE(kartleggingsenhetkode,'NA_','')) AS "type"
   FROM   import_nin.områder20k c
   LEFT   JOIN import_nin.kartleggingsenheter20k ct ON ct.område20kid = c.område20kid
   WHERE  c.område20kid IN ('NIN7000046')
   GROUP  BY c.område20kid
   ) sub;
```

## Functions

### Naturtyper 1:20000

```sql
DROP FUNCTION import_nin.naturtype_20k_json(naturtype_id varchar);
CREATE OR REPLACE FUNCTION import_nin.naturtype_20k_json(områdekid varchar)
RETURNS json AS $$
BEGIN
	RETURN (SELECT to_json(sub)
	FROM  (
      SELECT json_agg(REPLACE(kartleggingsenhetkode,'NA_','')) AS "type"
	   FROM   import_nin.områder20k c
	   LEFT   JOIN import_nin.kartleggingsenheter20k ct ON ct.område20kid = c.område20kid
	   WHERE  c.område20kid = områdekid
	   GROUP  BY c.område20kid
	   ) sub);
END; $$
LANGUAGE PLPGSQL;
```

### Naturtyper 1:5000

```sql
DROP FUNCTION import_nin.naturtype_5k_json(naturtype_id varchar);
CREATE OR REPLACE FUNCTION .naturtype_5k_json(områdekid varchar)
RETURNS json AS $$import_nin
BEGIN
	RETURN (SELECT to_json(sub)
	FROM  (
      SELECT json_agg(REPLACE(kartleggingsenhetkode,'NA_','')) AS "type"
	   FROM   import_nin.områder5k c
	   LEFT   JOIN import_nin.kartleggingsenheter5k ct ON ct.område5kid = c.område5kid
	   WHERE  c.område5kid = områdekid
	   GROUP  BY c.område5kid
	   ) sub);
END; $$
LANGUAGE PLPGSQL;
```

### Naturtyper NT

```sql
DROP FUNCTION import_nin.naturtype_nt_json;
CREATE OR REPLACE FUNCTION import_nin.naturtype_nt_json(naturtype_id varchar)
RETURNS json AS $$
BEGIN
	RETURN (SELECT to_json(sub)
	FROM  (
	   SELECT json_agg(REPLACE(kartleggingsenhetkode,'NA_','')) AS "type"
      FROM   import_nin.kartleggingsenheternt ct
	   WHERE  ct.naturtypeid = naturtype_id
	   GROUP  BY ct.naturtypeid
	   ) sub);
END; $$
LANGUAGE PLPGSQL;
```

### Variabel 1:5000

```sql
DROP FUNCTION import_nin.variabel_5k_json;
CREATE OR REPLACE FUNCTION import_nin.variabel_5k_json(områdekid varchar)
RETURNS json AS $$
BEGIN
	RETURN (SELECT to_json(sub)
	FROM  (
	   SELECT json_agg(variabelkode) AS "variabel"
	   FROM   import_nin.områder5k c
	   LEFT   JOIN import_nin.kartleggingsenheter5k ct ON ct.område5kid = c.område5kid
	   LEFT   JOIN import_nin.variabler5k v ON v.kartleggingsenhet5kid = ct.kartleggingsenhet5kid
	   WHERE  c.område5kid = områdekid
	   GROUP  BY c.område5kid
	   ) sub);
END; $$
LANGUAGE PLPGSQL;
```

### Variabel 1:20000

```sql
DROP FUNCTION import_nin.variabel_20k_json;
CREATE OR REPLACE FUNCTION import_nin.variabel_20k_json(områdekid varchar)
RETURNS json AS $$
BEGIN
	RETURN (SELECT to_json(sub)
	FROM  (
	   SELECT json_agg(variabelkode) AS "variabel"
	   FROM   import_nin.områder20k c
	   LEFT   JOIN import_nin.kartleggingsenheter20k ct ON ct.område20kid = c.område20kid
	   LEFT   JOIN import_nin.variabler20k v ON v.kartleggingsenhet20kid = ct.kartleggingsenhet20kid
	   WHERE  c.område20kid = områdekid
	   GROUP  BY c.område20kid
	   ) sub);
END; $$
LANGUAGE PLPGSQL;
```

### Variabel naturtype

```sql
DROP FUNCTION import_nin.variabel_nt_json;
CREATE OR REPLACE FUNCTION import_nin.variabel_nt_json(områdekid varchar)
RETURNS json AS $$
BEGIN
	RETURN (SELECT to_json(sub)
	FROM  (
	   SELECT json_agg(variabelkode) AS "variabel"
	   FROM   import_nin.variablernaturtyper c
	   WHERE  c.naturtypeid=områdekid
	   GROUP  BY c.naturtypeid
	   ) sub);
END; $$
LANGUAGE PLPGSQL;

```

```sql
SELECT import_nin.naturtype_20k_json('NIN7109610');
SELECT import_nin.naturtype_5k_json('NIN6000016');
select import_nin.naturtype_nt_json('NINFP1910007047');
select import_nin.variabel_5k_json('NIN5013589');
select import_nin.variabel_20k_json('NIN7000006');
select import_nin.variabel_nt_json('NINFP1810000528');
```
