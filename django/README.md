[Admin panel](http://172.17.0.2:8000/admin/)

## Create container

Denne trenger ikke bygges for hver commit da den ikke inneholder annet enn Python og Django.

```bash
docker create \
  --name forvaltningsportal-django \
  -p 8000:8000 \
  -v /home/grunnkart/forvaltningsportal/django:/usr/src/app \
  --restart unless-stopped \
  forvaltningsportal-django
```

## Add superuser

Etter første gangs oppstart av containeren (uten gamle data) må det opprettes bruker fra innsiden av containeren.

```
python manage.py createsuperuser
```

## Variabler

Variabler i _settings.py_ som kan være greit å vite om.

OBS: SECRET_KEY bør antagelig settes i environment-variabel.

```
# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'v7gtxx=j=9xlu0e9!%!g8op6@o$@k#bjtnh9nex$ld&%rzlmw5'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["*"]
```

## Deployment

Filer fra denne katalogen django, deployes til katalogen som er mappet inn i _forvaltningsporta-django_ container.
