# Installasjon

Variabler justeres og hardening gjøres etter behov. I produksjon kan databasen være read-only.

## PostGIS

### Sett opp PostGIS docker container

Dokumentasjon: https://github.com/postgis/docker-postgis

```bash
docker stop forvaltningsportal-postgres
docker rm -f forvaltningsportal-postgres

docker run -d \
    --name forvaltningsportal-postgres \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=<jall> \
    -e PGDATA=/var/lib/postgresql/data/pgdata \
    -v /home:/home \
    -v /dockerdata/forvaltningsportal-postgres:/var/lib/postgresql/data \
    postgis/postgis
```

#### Volum

- **/home**: for å kunne laste inn filer til containeren
- **/var/lib/postgresql/data**: PostgreSQL databasefilene som automatisk opprettes av containeren

## PostgREST

Eksponerer et REST API på toppen av databasen.

https://forvaltningsportalapi.test.artsdatabanken.no

- Dokumentasjon: http://postgrest.org/en/v6.0/install.html#docker

### Installer

```bash
docker run --rm --net=host -p 3000:3000 \
  --name postgrest \
  -e PGRST_DB_URI="postgres://postgres:veldighemmelig@172.17.0.2/postgres" \
  -e PGRST_DB_ANON_ROLE="postgres" \
  postgrest/postgrest
```

### Test

```bash
curl "http://localhost:3000/"
```
