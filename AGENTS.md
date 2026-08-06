# AGENT GUIDANCE

## Project overview

This repository contains the Økologiske grunnkart web client, a legacy React/JavaScript frontend for a map-based application, plus a Django backend and a smaller helper app in [wms-assistent](wms-assistent).

## Where to look first

- Main frontend sources live in [src](src).
- Map and layer behavior is concentrated under [src/Kart](src/Kart), [src/Funksjoner](src/Funksjoner), and [src/Okologiskegrunnkart](src/Okologiskegrunnkart).
- Backend work belongs in [django](django) and related database docs in [database](database).
- Start with [README.md](README.md), [CONTRIBUTING.md](CONTRIBUTING.md), [django/README.md](django/README.md), and [database/README.md](database/README.md) for project context.

## Working conventions

- Keep changes small and focused. This codebase mixes older class-based React patterns with newer hooks, so follow the style used by the surrounding files.
- Map, layer, polygon, and URL state changes often touch multiple modules. Check adjacent files before editing to avoid breaking the existing flow.
- Prefer existing helpers in [src/Funksjoner](src/Funksjoner) and the shared context providers in [src](src) rather than introducing parallel implementations.
- Preserve the existing Norwegian naming and UI language where practical.

## Common commands

- Install dependencies: `npm install`
- Start the frontend locally: `npm start`
- Run unit tests: `npm test`
- Run Cypress end-to-end tests: `npm run e2e`
- Backend setup and Django commands are described in [django/README.md](django/README.md)

## Common pitfalls

- The frontend expects a local or remote `kartlag.json` under [public](public); missing data can cause the app to fall back to preview data.
- Layer and polygon behavior may depend on browser-side IndexedDB and URL state, so persistence changes may require updates in more than one place.
- The root app and the helper app in [wms-assistent](wms-assistent) have separate package setup and dependencies; changes in one do not automatically apply to the other.
