docker stop forvaltningsportal-postgres
docker rm -f forvaltningsportal-postgres 
docker run -d \
    --name forvaltningsportal-postgres \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=veldighemmelig \
    -e PGDATA=/var/lib/postgresql/data/pgdata \
    -v /home:/home \
    -v /dockerdata/forvaltningsportal-postgres:/var/lib/postgresql/data \
    postgis/postgis
