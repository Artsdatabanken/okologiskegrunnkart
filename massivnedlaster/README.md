# Massiv Nedlaster

Laster ned oppdateringer av kartdatasett fra GeoNorge. For å konfigurere datasett brukes Windows [GUI-klient](https://www.geonorge.no/verktoy/APIer-og-grensesnitt/massivnedlastingsklient/).

Datasettene lastes videre inn i PostgreSQL av [lastejobben](../lastejobb/README.md)

## Konfigurasjon

På Ubuntu ligger konfigurasjonsfilen _settings.json_ i

```
~/.local/share/Geonorge/Nedlasting
```

Konfigurasjon av datasett ligger i filen _default.json_. Katalogen denne ligger i er konfigurert i _settings.json_.

Download directory settes til å peke på temp-katalogen til lastejobben, f.eks.

```
"DownloadDirectory": "/home/grunnkart/src/adb/forvaltningsportal/lastejobb/temp"
```
