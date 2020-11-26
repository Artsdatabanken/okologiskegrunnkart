[![Build Status](https://travis-ci.org/Artsdatabanken/forvaltningsportal.svg?branch=master)](https://travis-ci.org/Artsdatabanken/forvaltningsportal)
[![Coverage Status](https://coveralls.io/repos/github/Artsdatabanken/forvaltningsportal/badge.svg?branch=master)](https://coveralls.io/github/Artsdatabanken/forvaltningsportal?branch=master)
[![Open Source Love](https://badges.frapsoft.com/os/v2/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md#pull-requests)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# Økologiske grunnkart

![image](./doc/screenshot.png)

## Nyttige lenker i prosjektet

- [Webklient](https://okologiskegrunnkart.artsdatabanken.no)
- [Webklient testversion](https://okologiskegrunnkart.test.artsdatabanken.no)
- [Administrasjonsverktøy](https://forvaltningsportaladmin.artsdatabanken.no/admin/)
- [Wms-hjelper for å legge inn klikk url til underlag](https://okologiskegrunnkartadmin.artsdatabanken.no/static/index.html)
- [Kartlag.json file](https://okologiskegrunnkart.test.artsdatabanken.no/kartlag.json)
- [Cached tiles](https://data.test.artsdatabanken.no/grunnkart/)
- [Responssjekk](https://responssjekk.test.artsdatabanken.no/)

## Wiki

Dette prosjektet har en wiki, se den her:

- https://github.com/Artsdatabanken/forvaltningsportal/wiki

## Thanks

<a href="https://www.browserstack.com/"><img src="doc/Browserstack-logo.svg" width="200px">
</a>
<br/>Thanks to BrowserStack for providing an open-source account for testing & development!

## Oppsett django og kartlagfila

Les mer på vår wiki:

- https://github.com/Artsdatabanken/forvaltningsportal/wiki/Django-og-Kartlagfila

## Start app in localhost

Follow these steps:

- Run `npm install`
- Run `npm start`
- Get the example map data `kartlag.json` from `https://okologiskegrunnkart.test.artsdatabanken.no/kartlag.json`. Save this file in the `public` folder (there exists already a `kartlag_preview.json` file).

## Update automatically database layers and sublayers

Follow these steps.

Localhost:

- Make sure you have django running locally.
- Log in as superuser in the admin panel `http://localhost:8000/admin/`
- Run the following HTTP request: `http://localhost:8000/api/v1/kartlag/fill/data/`

Test environment:

- Log in as superuser in the admin panel `https://forvaltningsportaladmin.artsdatabanken.no/admin/`
- Run the following HTTP request: `https://forvaltningsportaladmin.artsdatabanken.no/api/v1/kartlag/fill/data/`

You will receive a timeout error `504 Gateway Time-out` after 30 seconds. This, however, will not affect the update script which will contionue running in the background.
