/// <reference types="cypress" />

// Arter - Rødlista
const checkboxPath1 =
  "#settings-layers-top-item .MuiCollapse-container .MuiTreeItem-root:nth-child(5) input";
const resultPath1 =
  ".layers-results-subheaders:nth-child(1) .generic_element:nth-child(2)";
const resultBadgePath1 =
  ".layers-results-subheaders:nth-child(1) .generic_element:nth-child(2) .MuiBadge-badge";

// Arealressurs
const checkboxPath2 =
  "#settings-layers-top-item .MuiCollapse-container .MuiTreeItem-root:nth-child(1) input";
const resultPath2 =
  ".layers-results-subheaders:nth-child(2) .generic_element:nth-child(2)";
const resultBadgePath2 =
  ".layers-results-subheaders:nth-child(2) .generic_element:nth-child(2) .MuiBadge-badge";

// Naturtyper - DN Håndbok 13
const checkboxPath3 =
  "#settings-layers-top-item .MuiCollapse-container .MuiTreeItem-root:nth-child(35) input";
const resultPath3 =
  ".layers-results-subheaders:nth-child(3) .generic_element:nth-child(2)";
const resultBadgePath3 =
  ".layers-results-subheaders:nth-child(3) .generic_element:nth-child(2) .MuiBadge-badge";

describe("Click on Map with Selected Layers Tests", () => {
  before(() => {
    // Delete indexed DB
    indexedDB.deleteDatabase("GrunnkartDB");
  });

  it("Click on map first time", () => {
    cy.wait(1000);
    cy.startDesktop();

    // Zoom in map
    cy.get('a[title="Zoom in"]').click();
    cy.wait(300);

    // Infobox and marker should not be visible
    cy.get(".infobox-container-side.infobox-open").should("not.exist");
    cy.get("img.leaflet-marker-icon").should("not.exist");

    // Intercept requests
    cy.intercept(
      "https://okologiskegrunnkartapi.test.artsdatabanken.no/rpc/stedsnavn?lng=11.953125000000002&lat=64.3113485053558&zoom=7"
    ).as("getPlaceData");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?kommunenummer=5047&gardsnummer=86&bruksnummer=1&treffPerSide=100"
    ).as("getAddressData");

    // Click on map
    cy.url().should("not.include", "lng=11.95312");
    cy.url().should("not.include", "lat=64.31134");
    cy.get(".leaflet-container").click(610, 718);
    cy.get(".infobox-container-side.infobox-open").should("be.visible");
    cy.wait("@getPlaceData");
    cy.wait("@getAddressData");
    cy.url().should("include", "lng=11.95312");
    cy.url().should("include", "lat=64.31134");
    cy.url().should("include", "favorites=false");
    cy.url().should("not.include", "layers=");

    // Check infobox contains correct data
    cy.get("img.leaflet-marker-icon").should("not.be.null");
    cy.get(".infobox-container-side.infobox-open").contains("Midter-Bangsjøen");
    cy.get(".infobox-container-side.infobox-open").contains("innsjø");
    cy.get(".infobox-container-side").contains("Trøndelag - Trööndelage");
    cy.get(".infobox-container-side.infobox-open").contains("50");
    cy.get(".infobox-container-side.infobox-open").contains("Overhalla");
    cy.get(".infobox-container-side.infobox-open").contains("5047");
    cy.get(".infobox-container-side.infobox-open").contains(
      "Midter-Bangsjøen 4"
    );
    cy.get(".infobox-container-side.infobox-open").contains("86 / 1");
    cy.get(".infobox-container-side").contains("64.3113° N 11.9531° Ø");
    cy.get(".infobox-container-side.infobox-open").contains("351 moh");
    cy.get(".infobox-container-side.infobox-open").contains("Marker grense");
    cy.get(".infobox-container-side.infobox-open").contains("Fylke");
    cy.get(".infobox-container-side.infobox-open").contains("Kommune");
    cy.get(".infobox-container-side.infobox-open").contains("Eiendom");
    cy.get(".infobox-container-side.infobox-open").contains("Valgte kartlag");
    cy.get(".infobox-container-side.infobox-open").contains("Alle kartlag");
  });

  it("Select some favorite layers", () => {
    // Open favorites edit page
    cy.get(".help_button").click();
    cy.get("#settings-drawer").contains("Endre favorittkartlag");
    cy.get("#drawer-menuitem-edit-kartlag").click();
    cy.get(".settings-layers-wrapper").should("be.visible");
    cy.get(".settings-layers-wrapper").contains("Kartlag");
    cy.get(".settings-layers-list-item-wrapper").click();
    cy.get(".settings-layers-wrapper").contains("Arealressurs: AR5");
    cy.get(".settings-layers-wrapper").contains("Arter - Rødlista");
    cy.get(".settings-layers-wrapper").contains("Naturtyper - DN Håndbok 13");

    // Select 3 layers
    cy.get(checkboxPath1).should("not.be.checked");
    cy.get(checkboxPath2).should("not.be.checked");
    cy.get(checkboxPath3).should("not.be.checked");
    cy.get(checkboxPath1).click();
    cy.get(checkboxPath2).click();
    cy.get(checkboxPath3).click();
    cy.get(checkboxPath1).should("be.checked");
    cy.get(checkboxPath2).should("be.checked");
    cy.get(checkboxPath3).should("be.checked");

    // Save and get back to map
    cy.get("#settings-layers-save-button").click();
    cy.get(".settings-layers-wrapper", { timeout: 10000 }).should("not.exist");

    // Check favorites are being used
    cy.url().should("include", "favorites=true");
    cy.get(".kartlag_fanen").contains("Favorittkartlag");
    cy.get("#layers-list-wrapper")
      .find(".sorted-layers-subheaders")
      .should("have.length", 3);
    cy.get(".kartlag_fanen").contains("Arealressurs: AR5");
    cy.get(".kartlag_fanen").contains("Arter - Rødlista");
    cy.get(".kartlag_fanen").contains("Naturtyper - DN Håndbok 13");
  });

  it("Show all results when activating toggle", () => {
    // Layer results not visible
    cy.get("#layers-results-list")
      .find(".layers-results-subheaders")
      .should("have.length", 0);

    // Intercept requests
    cy.intercept(
      "https://kart.artsdatabanken.no/WMS/artskart.aspx?request=GetFeatureInfo&service=WMS&version=1.3.0&x=128&y=128&width=255&height=255&layers=Artskart%2CRE%2CCR%2CEN%2CVU%2CNT%2CDD&query_layers=Artskart%2CRE%2CCR%2CEN%2CVU%2CNT%2CDD&info_format=application%2Fvnd.ogc.gml&crs=EPSG%3A4326&srs=EPSG%3A4326&bbox=64.30134850535579%2C11.943125000000002%2C64.3213485053558%2C11.963125000000002"
    ).as("getFeatureInfoArt");
    cy.intercept(
      "https://wms.nibio.no/cgi-bin/ar5?request=GetFeatureInfo&service=WMS&version=1.3.0&x=128&y=128&width=255&height=255&layers=Arealtype%2CJordbruksareal%2CTreslag&query_layers=Arealtype%2CJordbruksareal%2CTreslag&info_format=application%2Fvnd.ogc.gml&crs=EPSG%3A4326&srs=EPSG%3A4326&bbox=64.30134850535579%2C11.943125000000002%2C64.3213485053558%2C11.963125000000002"
    ).as("getFeatureInfoArea");
    cy.intercept(
      "https://kart.miljodirektoratet.no/arcgis/services/naturtyper_hb13/mapserver/WMSServer?request=GetFeatureInfo&service=WMS&version=1.3.0&x=128&y=128&width=255&height=255&layers=hovednaturtype_hb13_andre_viktige%2Chovednaturtype_hb13_ferskvann_vatmark%2Chovednaturtype_hb13_fjell%2Chovednaturtype_hb13_kulturlandskap%2Chovednaturtype_hb13_kyst_havstrand%2Chovednaturtype_hb13_myr_og_kilde%2Chovednaturtype_hb13_rasmark_berg_kantkratt%2Chovednaturtype_hb13_skog%2Cnaturtyper_hb13_alle&query_layers=hovednaturtype_hb13_andre_viktige%2Chovednaturtype_hb13_ferskvann_vatmark%2Chovednaturtype_hb13_fjell%2Chovednaturtype_hb13_kulturlandskap%2Chovednaturtype_hb13_kyst_havstrand%2Chovednaturtype_hb13_myr_og_kilde%2Chovednaturtype_hb13_rasmark_berg_kantkratt%2Chovednaturtype_hb13_skog%2Cnaturtyper_hb13_alle&info_format=application%2Fvnd.esri.wms_raw_xml&crs=EPSG%3A4326&srs=EPSG%3A4326&bbox=64.30134850535579%2C11.943125000000002%2C64.3213485053558%2C11.963125000000002"
    ).as("getFeatureInfoNatur");

    // Activate all layers
    cy.get("#search-layers-toggle").should("not.be.checked");
    cy.get("#search-layers-toggle").click();
    cy.get("#search-layers-toggle").should("be.checked");
    cy.wait("@getFeatureInfoArt");
    cy.wait("@getFeatureInfoArea");
    cy.wait("@getFeatureInfoNatur");
    cy.url().should("include", "lng=11.95312");
    cy.url().should("include", "lat=64.31134");
    cy.url().should("include", "favorites=true");
    cy.url().should("not.include", "layers=");

    // Check results
    cy.get("#layers-results-list")
      .find(".layers-results-subheaders")
      .should("have.length", 3);

    // Results for Arter - Rødlista
    cy.get("#layers-results-list").contains("Arter");
    cy.get("#layers-results-list").contains("Ingen treff");
    cy.get("#layers-results-list").contains("Arter - Rødlista");
    cy.get("#layers-results-list").contains("Artsdatabanken");
    cy.get(resultBadgePath1).should("have.class", "MuiBadge-invisible");

    // Results for Arealressurs
    cy.get("#layers-results-list").contains("Arealressurs");
    cy.get("#layers-results-list").contains("Produktiv skog");
    cy.get("#layers-results-list").contains("Arealressurs: AR5");
    cy.get("#layers-results-list").contains("NIBIO");
    cy.get(resultBadgePath2).should("contain", "3");

    // Results for Naturtyper
    cy.get("#layers-results-list").contains("Naturtyper");
    cy.get("#layers-results-list").contains("Kalkskog");
    cy.get("#layers-results-list").contains("Naturtyper - DN Håndbok 13");
    cy.get("#layers-results-list").contains("Miljødirektoratet");
    cy.get(resultBadgePath3).should("contain", "2");
  });

  it("Check result details", () => {
    // Click on empty results doesn't change anything
    cy.get(resultPath1).click();
    cy.get(".infobox-container-side .infobox-details-title-text").should(
      "not.exist"
    );

    // Click on arealressurs shows details
    cy.get(resultPath2).click();
    cy.get(".infobox-container-side .infobox-details-title-text").should(
      "be.visible"
    );
    cy.get(".infobox-container-side .infobox-details-title-text").should(
      "contain",
      "Detaljerte resultater"
    );
    cy.get(".infobox-container-side").contains("Faktaark");
    cy.get(".infobox-container-side").contains("Arealressurs: AR5 Arealtype");
    cy.get(".infobox-container-side").contains("Jordbruksareal");
    cy.get(".infobox-container-side").contains("Treslag");
    cy.get(".infobox-container-side").contains("Artreslag beskrivelse:");
    cy.get(".infobox-container-side").contains("Barskog");
    cy.get(".infobox-details-title-text").click();

    // Click on naturtyper shows details
    cy.get(resultPath3).click();
    cy.get(".infobox-container-side .infobox-details-title-text").should(
      "be.visible"
    );
    cy.get(".infobox-container-side .infobox-details-title-text").should(
      "contain",
      "Detaljerte resultater"
    );
    cy.get(".infobox-container-side").contains("Faktaark");
    cy.get(".infobox-container-side").contains("Hovednaturtype - skog");
    cy.get(".infobox-container-side").contains("Miljødirektoratet");
    cy.get(".infobox-details-title-text").click();
  });

  it("Click on map second time should update results", () => {
    // Intercept requests
    cy.intercept(
      "https://kart.artsdatabanken.no/WMS/artskart.aspx?request=GetFeatureInfo&service=WMS&version=1.3.0&x=128&y=128&width=255&height=255&layers=Artskart%2CRE%2CCR%2CEN%2CVU%2CNT%2CDD&query_layers=Artskart%2CRE%2CCR%2CEN%2CVU%2CNT%2CDD&info_format=application%2Fvnd.ogc.gml&crs=EPSG%3A4326&srs=EPSG%3A4326&bbox=64.14853105194119%2C11.61353515625%2C64.1685310519412%2C11.63353515625"
    ).as("getFeatureInfoArt");
    cy.intercept(
      "https://wms.nibio.no/cgi-bin/ar5?request=GetFeatureInfo&service=WMS&version=1.3.0&x=128&y=128&width=255&height=255&layers=Arealtype%2CJordbruksareal%2CTreslag&query_layers=Arealtype%2CJordbruksareal%2CTreslag&info_format=application%2Fvnd.ogc.gml&crs=EPSG%3A4326&srs=EPSG%3A4326&bbox=64.14853105194119%2C11.61353515625%2C64.1685310519412%2C11.63353515625"
    ).as("getFeatureInfoArea");
    cy.intercept(
      "https://kart.miljodirektoratet.no/arcgis/services/naturtyper_hb13/mapserver/WMSServer?request=GetFeatureInfo&service=WMS&version=1.3.0&x=128&y=128&width=255&height=255&layers=hovednaturtype_hb13_andre_viktige%2Chovednaturtype_hb13_ferskvann_vatmark%2Chovednaturtype_hb13_fjell%2Chovednaturtype_hb13_kulturlandskap%2Chovednaturtype_hb13_kyst_havstrand%2Chovednaturtype_hb13_myr_og_kilde%2Chovednaturtype_hb13_rasmark_berg_kantkratt%2Chovednaturtype_hb13_skog%2Cnaturtyper_hb13_alle&query_layers=hovednaturtype_hb13_andre_viktige%2Chovednaturtype_hb13_ferskvann_vatmark%2Chovednaturtype_hb13_fjell%2Chovednaturtype_hb13_kulturlandskap%2Chovednaturtype_hb13_kyst_havstrand%2Chovednaturtype_hb13_myr_og_kilde%2Chovednaturtype_hb13_rasmark_berg_kantkratt%2Chovednaturtype_hb13_skog%2Cnaturtyper_hb13_alle&info_format=application%2Fvnd.esri.wms_raw_xml&crs=EPSG%3A4326&srs=EPSG%3A4326&bbox=64.14853105194119%2C11.61353515625%2C64.1685310519412%2C11.63353515625"
    ).as("getFeatureInfoNatur");

    // Click on another position and wait for requests
    cy.get(".leaflet-container").click(580, 750);
    cy.wait("@getFeatureInfoArt");
    cy.wait("@getFeatureInfoArea");
    cy.wait("@getFeatureInfoNatur");
    cy.url().should("include", "lng=11.62353");
    cy.url().should("include", "lat=64.15853");
    cy.url().should("include", "favorites=true");
    cy.url().should("not.include", "layers=");

    // Check results
    cy.get("#layers-results-list")
      .find(".layers-results-subheaders")
      .should("have.length", 3);

    // Results for Arter - Rødlista
    cy.get("#layers-results-list").contains("Arter");
    cy.get("#layers-results-list").contains("Ingen treff");
    cy.get("#layers-results-list").contains("Arter - Rødlista");
    cy.get("#layers-results-list").contains("Artsdatabanken");
    cy.get(resultBadgePath1).should("have.class", "MuiBadge-invisible");

    // Results for Arealressurs
    cy.get("#layers-results-list").contains("Arealressurs");
    cy.get("#layers-results-list").contains("Produktiv skog");
    cy.get("#layers-results-list").contains("Arealressurs: AR5");
    cy.get("#layers-results-list").contains("NIBIO");
    cy.get(resultBadgePath2).should("contain", "3");

    // Results for Naturtyper
    cy.get("#layers-results-list").contains("Naturtyper");
    cy.get("#layers-results-list").contains("Naturtyper - DN Håndbok 13");
    cy.get("#layers-results-list").contains("Miljødirektoratet");
    cy.get(resultBadgePath3).should("have.class", "MuiBadge-invisible");

    // Infobox data
    cy.get(".infobox-container-side.infobox-open").contains("Moldelva");
    cy.get(".infobox-container-side.infobox-open").contains("elv");
    cy.get(".infobox-container-side").contains("Trøndelag - Trööndelage");
    cy.get(".infobox-container-side.infobox-open").contains("50");
    cy.get(".infobox-container-side.infobox-open").contains("Steinkjer");
    cy.get(".infobox-container-side.infobox-open").contains("5006");
    cy.get(".infobox-container-side").contains("Dalbygdvegen 1300");
    cy.get(".infobox-container-side.infobox-open").contains("274 / 1");
    cy.get(".infobox-container-side").contains("64.1585° N 11.6235° Ø");
    cy.get(".infobox-container-side.infobox-open").contains("195 moh");
  });

  it("Hide all results when deactivating toggle", () => {
    // Deactivate all layers
    cy.get("#search-layers-toggle").click();
    cy.get("#search-layers-toggle").should("not.be.checked");

    // Layer results not visible
    cy.get("#layers-results-list")
      .find(".layers-results-subheaders")
      .should("have.length", 0);

    // Results for Arter - Rødlista
    cy.get("#layers-results-list").should("not.contain", "Arter");
    cy.get("#layers-results-list").should("not.contain", "Arter - Rødlista");
    cy.get("#layers-results-list").should("not.contain", "Arealressurs");
    cy.get("#layers-results-list").should("not.contain", "Arealressurs: AR5");
    cy.get("#layers-results-list").should("not.contain", "Naturtyper");
    cy.get("#layers-results-list").should(
      "not.contain",
      "Naturtyper - DN Håndbok 13"
    );
  });
});
