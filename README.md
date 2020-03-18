[![Build Status](https://travis-ci.org/Artsdatabanken/forvaltningsportal.svg?branch=master)](https://travis-ci.org/Artsdatabanken/forvaltningsportal)
[![Coverage Status](https://coveralls.io/repos/github/Artsdatabanken/forvaltningsportal/badge.svg?branch=master)](https://coveralls.io/github/Artsdatabanken/forvaltningsportal?branch=master)
[![Open Source Love](https://badges.frapsoft.com/os/v2/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md#pull-requests)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# Økologisk grunnkart forvaltningsportal

![image](./doc/screenshot.png)

## Nyttige lenker i prosjektet

- [Webklient](https://forvaltningsportal.artsdatabanken.no)
- [Webklient testversion](https://forvaltningsportal.test.artsdatabanken.no)

## Thanks

<a href="https://www.browserstack.com/"><img src="doc/Browserstack-logo.svg" width="200px">
</a>
<br/>Thanks to BrowserStack for providing an open-source account for testing & development!

# Django og kartlagfila

## Om du endrer noe i db som andre også skal få

- kartlag.json er ikke lenger i git, men håndteres lokalt, for å endre konflikt med ting som gjøres på server.
- Å endre på datadump er derfor kun relevant nå i startsfasen mens vi korrigerer kartlagene.
- Gå inn i djangomappa
- kjør kommandoen : python .\manage.py dumpdata -o initialdb.json --indent 4

## Å få i gang django når du har alt satt opp

- gå inn i django mappa
- aktiver environment med: .environment/Scripts/activate.ps1
- python .\manage.py migrate (hvis noe nytt er lagt til/endret)
- python .\manage.py loaddata initialdb.json
- python .\manage.py runserver
- når adminpanelet via localhost:8000/admin

## Å få i gang django når det er i prosjektet men du ikke har den lokalt

- gå inn i django mappa
- pass på at du har python3
- skriv: virtualenv.exe environment
- aktiver environment med: .environment/Scripts/activate.ps1
- pip install django
- django-admin.exe startproject forvaltningsportal .
- python .\manage.py migrate forvaltningsportal
- python .\manage.py createsuperuser
- følg det shellet sier for å sette opp brukeren din
- python .\manage.py loaddata initialdb.json
- python .\manage.py runserver
- når adminpanelet via localhost:8000/admin
- Endre noe i adminpanelet for å lage kartlag.json (har ikke egen kommando per nå)

## Sette opp django første gang i prosjektet

- gå inn i django mappa
- pass på at du har python3
- skriv virtualenv.exe environment
- aktiver environment med .environment/Scripts/activate.ps1
- pip install django
- django-admin.exe startproject forvaltningsportal .
- lag models.py
- .\manage.py makemigrations forvaltningsportal
- python .\manage.py migrate
- python .\manage.py createsuperuser
- lag admin.py
- python .\manage.py runserver
- når adminpanelet via localhost:8000/admin
