[Admin panel](http://172.17.0.2:8000/admin/)

## Create container

Denne trenger ikke bygges for hver commit da den ikke inneholder annet enn Python og Django.

```bash
docker create \
  --name forvaltningsportal-django \
  -p 8000:8000 \
  -v /home/b/src/adb/forvaltningsportal/django:/usr/src/app \
  --restart unless-stopped \
  forvaltningsportal-django
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

Filer fra denne katalogen django
