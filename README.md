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
- [Administrasjonsverktøy](https://forvaltningsportaladmin.artsdatabanken.no/admin/)

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
- Get the example map data `kartlag.json` from `https://forvaltningsportal.test.artsdatabanken.no/kartlag.json`. Save this file in the `public` folder (there exists already a `kartlag_preview.json` file).
