/// <reference types="cypress" />

// Arter - fredete
const layerPath1 =
  "#layers-list-wrapper .sorted-layers-subheaders:nth-child(1) #layer-list-item:nth-child(2)";
const switchPath1 =
  ".sorted-layers-subheaders:nth-child(1) .MuiCollapse-container:nth-child(3) .collapsed_container .underlag:first input";
const badgePath1 =
  ".sorted-layers-subheaders:nth-child(1) #layer-list-item:nth-child(2) .MuiBadge-badge";
const resultPath1 =
  ".layers-results-subheaders:nth-child(1) .generic_element:nth-child(2)";
const resultBadgePath1 =
  ".layers-results-subheaders:nth-child(1) .generic_element:nth-child(2) .MuiBadge-badge";

// Arealressurs
const layerPath2 =
  "#layers-list-wrapper .sorted-layers-subheaders:nth-child(2) #layer-list-item:nth-child(2)";
const allPath2 =
  ".sorted-layers-subheaders:nth-child(2) .MuiCollapse-container:nth-child(3) .collapsed_container .underlag-all input";
const switchPath2 =
  ".sorted-layers-subheaders:nth-child(2) .MuiCollapse-container:nth-child(3) .collapsed_container .underlag:first input";
const badgePath2 =
  ".sorted-layers-subheaders:nth-child(2) #layer-list-item:nth-child(2) .MuiBadge-badge";
const resultPath2 =
  ".layers-results-subheaders:nth-child(2) .generic_element:nth-child(2)";
const resultBadgePath2 =
  ".layers-results-subheaders:nth-child(2) .generic_element:nth-child(2) .MuiBadge-badge";

describe("Click on Map with Selected Layers Tests", () => {
  before(() => {
    // Delete indexed DB
    indexedDB.deleteDatabase("GrunnkartDB");
  });

  it("Click on map first time", () => {
    cy.startDesktop();

    // Zoom in map
    cy.get('a[title="Zoom in"]').click();
    cy.wait(300);

    // Infobox and marker should not be visible
    cy.get(".infobox-container-side.infobox-open").should("not.exist");
    cy.get("img.leaflet-marker-icon").should("not.exist");

    // Intercept requests
    cy.intercept(
      "https://okologiskegrunnkartapi.test.artsdatabanken.no/rpc/stedsnavn?lng=12.392578125&lat=64.63329214257159&zoom=7"
    ).as("getPlaceData");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?kommunenummer=5046&gardsnummer=85&bruksnummer=1&treffPerSide=100"
    ).as("getAddressData");

    // Click on map
    cy.url().should("not.include", "lng=12.39257");
    cy.url().should("not.include", "lat=64.63329");
    cy.get(".leaflet-container").click(650, 650);
    cy.get(".infobox-container-side.infobox-open").should("be.visible");
    cy.wait("@getPlaceData");
    cy.wait("@getAddressData");
    cy.url().should("include", "lng=12.39257");
    cy.url().should("include", "lat=64.63329");
    cy.url().should("include", "favorites=false");
    cy.url().should("not.include", "layers=");

    // Check infobox contains correct data
    cy.get("img.leaflet-marker-icon").should("not.be.null");
    cy.get(".infobox-container-side.infobox-open").contains("Besa");
    cy.get(".infobox-container-side.infobox-open").contains("elv");
    cy.get(".infobox-container-side").contains("Trøndelag - Trööndelage");
    cy.get(".infobox-container-side.infobox-open").contains("50");
    cy.get(".infobox-container-side.infobox-open").contains("Høylandet");
    cy.get(".infobox-container-side.infobox-open").contains("5046");
    cy.get(".infobox-container-side.infobox-open").contains(
      "Skarlandssetran 1"
    );
    cy.get(".infobox-container-side.infobox-open").contains("85 / 1");
    cy.get(".infobox-container-side").contains("64.6333° N 12.3926° Ø");
    cy.get(".infobox-container-side.infobox-open").contains("329 moh");
    cy.get(".infobox-container-side.infobox-open").contains("Marker grense");
    cy.get(".infobox-container-side.infobox-open").contains("Fylke");
    cy.get(".infobox-container-side.infobox-open").contains("Kommune");
    cy.get(".infobox-container-side.infobox-open").contains("Eiendom");
    cy.get(".infobox-container-side.infobox-open").contains("Valgte kartlag");
    cy.get(".infobox-container-side.infobox-open").contains("Alle kartlag");
  });

  it("Show empty results when activating Fredete arter - områder", () => {
    // Layer results not visible
    cy.get("#layers-results-list")
      .find(".layers-results-subheaders")
      .should("have.length", 0);

    // Expand
    cy.get(layerPath1).click();
    cy.get("#layers-list-wrapper").contains("Arter - fredete");
    cy.get("#layers-list-wrapper").contains("Fredete arter - områder");
    cy.get("#layers-list-wrapper").contains("Fredete arter - punkt");

    // Intercept request
    cy.intercept(
      "https://kart.miljodirektoratet.no/arcgis/services/artnasjonal/MapServer/WmsServer?request=GetFeatureInfo&service=WMS&version=1.3.0&x=128&y=128&width=255&height=255&layers=Fredete_arter_omr&query_layers=Fredete_arter_omr&info_format=application%2Fvnd.esri.wms_raw_xml&crs=EPSG%3A4326&srs=EPSG%3A4326&bbox=64.62329214257159%2C12.382578125%2C64.6432921425716%2C12.402578125"
    ).as("getFeatureInfo");

    // Activate sublayer Fredete arter - områder
    cy.get(switchPath1).should("not.be.checked");
    cy.get(badgePath1).should("have.class", "MuiBadge-invisible");
    cy.get(switchPath1).click();
    cy.get(switchPath1).should("be.checked");
    cy.get(badgePath1).should("contain", "1");
    cy.wait("@getFeatureInfo");
    cy.url().should("include", "lng=12.39257");
    cy.url().should("include", "lat=64.63329");
    cy.url().should("include", "layers=222&favorites=false");

    // Layer results visible
    cy.get("#layers-results-list")
      .find(".layers-results-subheaders")
      .should("have.length", 1);
    cy.get("#layers-results-list").contains("Arter");
    cy.get("#layers-results-list").contains("Ingen treff");
    cy.get("#layers-results-list").contains("Arter - fredete");
    cy.get("#layers-results-list").contains("Miljødirektoratet");
    cy.get(resultBadgePath1).should("have.class", "MuiBadge-invisible");
  });

  it("Show results when activating Arealressurs", () => {
    // Layer results not visible
    cy.get("#layers-results-list")
      .find(".layers-results-subheaders")
      .should("have.length", 1);

    // Expand
    cy.get(layerPath2).click();
    cy.get("#layers-list-wrapper").contains("Arter - fredete");
    cy.get("#layers-list-wrapper").contains("Fredete arter - områder");
    cy.get("#layers-list-wrapper").contains("Fredete arter - punkt");

    // Intercept request
    cy.intercept(
      "https://wms.nibio.no/cgi-bin/ar5?request=GetFeatureInfo&service=WMS&version=1.3.0&x=128&y=128&width=255&height=255&layers=Arealtype&query_layers=Arealtype&info_format=application%2Fvnd.ogc.gml&crs=EPSG%3A4326&srs=EPSG%3A4326&bbox=64.62329214257159%2C12.382578125%2C64.6432921425716%2C12.402578125"
    ).as("getFeatureInfo1");

    // Activate sublayer Arealressurs: AR5 Arealtype
    cy.get(allPath2).should("not.be.checked");
    cy.get(switchPath2).should("not.be.checked");
    cy.get(switchPath2).should("not.be.checked");
    cy.get(badgePath2).should("have.class", "MuiBadge-invisible");
    cy.get(switchPath2).click();
    cy.get(allPath2).should("not.be.checked");
    cy.get(switchPath2).should("be.checked");
    cy.get(badgePath2).should("contain", "1");
    cy.wait("@getFeatureInfo1");
    cy.url().should("include", "lng=12.39257");
    cy.url().should("include", "lat=64.63329");
    cy.url().should("include", "layers=222,2&favorites=false");

    // Layer results visible
    cy.get("#layers-results-list")
      .find(".layers-results-subheaders")
      .should("have.length", 2);
    cy.get("#layers-results-list").contains("Arealressurs");
    cy.get("#layers-results-list").contains("Lite produktiv");
    cy.get("#layers-results-list").contains("Arealressurs: AR5");
    cy.get("#layers-results-list").contains("NIBIO");
    cy.get(resultBadgePath2).should("contain", "1");

    // Intercept request
    cy.intercept(
      "https://wms.nibio.no/cgi-bin/ar5?request=GetFeatureInfo&service=WMS&version=1.3.0&x=128&y=128&width=255&height=255&layers=Arealtype%2CJordbruksareal%2CTreslag&query_layers=Arealtype%2CJordbruksareal%2CTreslag&info_format=application%2Fvnd.ogc.gml&crs=EPSG%3A4326&srs=EPSG%3A4326&bbox=64.62329214257159%2C12.382578125%2C64.6432921425716%2C12.402578125"
    ).as("getFeatureInfo2");

    // Activate all sublayers in Arealressurs
    cy.get(allPath2).click();
    cy.get(allPath2).should("be.checked");
    cy.get(switchPath2).should("be.checked");
    cy.get(badgePath2).should("contain", "3");
    cy.wait("@getFeatureInfo2");
    cy.url().should("include", "lng=12.39257");
    cy.url().should("include", "lat=64.63329");
    cy.url().should("include", "layers=222,2,37,36&favorites=false");

    // Layer results visible
    cy.get(resultBadgePath2).should("contain", "3");
  });

  it("Check result details", () => {
    // Click on empty results doesn't change anything
    cy.get(resultPath1).click();
    cy.get(".infobox-container-side .infobox-details-title-text").should(
      "not.exist"
    );

    // Click on results shows details
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
    cy.get(".infobox-container-side").contains("Ikke tresatt");
  });

  it("Click on map second time should update results", () => {
    // Intercept requests
    cy.intercept(
      "https://kart.miljodirektoratet.no/arcgis/services/artnasjonal/MapServer/WmsServer?request=GetFeatureInfo&service=WMS&version=1.3.0&x=128&y=128&width=255&height=255&layers=Fredete_arter_omr&query_layers=Fredete_arter_omr&info_format=application%2Fvnd.esri.wms_raw_xml&crs=EPSG%3A4326&srs=EPSG%3A4326&bbox=64.14853105194119%2C11.833261718750002%2C64.1685310519412%2C11.853261718750002"
    ).as("getFeatureInfoArt");
    cy.intercept(
      "https://wms.nibio.no/cgi-bin/ar5?request=GetFeatureInfo&service=WMS&version=1.3.0&x=128&y=128&width=255&height=255&layers=Arealtype%2CJordbruksareal%2CTreslag&query_layers=Arealtype%2CJordbruksareal%2CTreslag&info_format=application%2Fvnd.ogc.gml&crs=EPSG%3A4326&srs=EPSG%3A4326&bbox=64.14853105194119%2C11.833261718750002%2C64.1685310519412%2C11.853261718750002"
    ).as("getFeatureInfoArea");

    // Click on another position and wait for requests
    cy.get(".leaflet-container").click(600, 750);
    cy.get(".infobox-container-side .infobox-details-title-text").should(
      "contain",
      "Detaljerte resultater"
    );
    cy.wait("@getFeatureInfoArt");
    cy.wait("@getFeatureInfoArea");
    cy.url().should("include", "lng=11.84326");
    cy.url().should("include", "lat=64.15853");
    cy.url().should("include", "layers=222,2,37,36&favorites=false");

    // Details are updated
    cy.get(".infobox-container-side").contains("Faktaark");
    cy.get(".infobox-container-side").contains("Arealressurs: AR5 Arealtype");
    cy.get(".infobox-container-side").contains("Jordbruksareal");
    cy.get(".infobox-container-side").contains("Treslag");
    cy.get(".infobox-container-side").contains("Artreslag beskrivelse:");
    cy.get(".infobox-container-side").contains("Ikke relevant");

    // Go back outside details
    cy.get(".infobox-details-title-text").click();
    cy.get("#layers-results-list")
      .find(".layers-results-subheaders")
      .should("have.length", 2);
    cy.get("#layers-results-list").contains("Arealressurs");
    cy.get("#layers-results-list").contains("Ikke klassifisert");
    cy.get("#layers-results-list").contains("Arealressurs: AR5");
    cy.get("#layers-results-list").contains("NIBIO");
    cy.get(resultBadgePath2).should("contain", "3");

    // Infobox data
    cy.get(".infobox-container-side.infobox-open").contains("Snåsavatnet");
    cy.get(".infobox-container-side.infobox-open").contains("innsjø");
    cy.get(".infobox-container-side").contains("Trøndelag - Trööndelage");
    cy.get(".infobox-container-side.infobox-open").contains("50");
    cy.get(".infobox-container-side.infobox-open").contains("Snåase - Snåsa");
    cy.get(".infobox-container-side.infobox-open").contains("5041");
    cy.get(".infobox-container-side").contains("Skarlandssetran 1");
    cy.get(".infobox-container-side.infobox-open").contains("85 / 1");
    cy.get(".infobox-container-side").contains("64.1585° N 11.8433° Ø");
    cy.get(".infobox-container-side.infobox-open").contains("23 moh");
  });

  it("Hide results when deactivating Arealressurs", () => {
    // Deactivate all sublayers in Arealressurs
    cy.get(allPath2).click();
    cy.get(allPath2).should("not.be.checked");
    cy.get(switchPath2).should("not.be.checked");
    cy.get(badgePath2).should("have.class", "MuiBadge-invisible");
    cy.url().should("include", "lng=11.84326");
    cy.url().should("include", "lat=64.15853");
    cy.url().should("include", "layers=222&favorites=false");

    // Layer results not visible
    cy.get("#layers-results-list")
      .find(".layers-results-subheaders")
      .should("have.length", 1);
    cy.get("#layers-results-list").should("not.contain", "Arealressurs");
    cy.get("#layers-results-list").should("not.contain", "Ikke klassifisert");
    cy.get("#layers-results-list").should("not.contain", "Arealressurs: AR5");
    cy.get("#layers-results-list").should("not.contain", "NIBIO");

    // Results for Arter - fredete still visible
    cy.get("#layers-results-list").contains("Arter");
    cy.get("#layers-results-list").contains("Ingen treff");
    cy.get("#layers-results-list").contains("Arter - fredete");
    cy.get("#layers-results-list").contains("Miljødirektoratet");
    cy.get(resultBadgePath1).should("have.class", "MuiBadge-invisible");
  });

  it("Hide results when deactivating Arter - fredete", () => {
    // Deactivate all sublayers in Arter - fredete
    cy.get(switchPath1).click();
    cy.get(switchPath1).should("not.be.checked");
    cy.get(badgePath1).should("have.class", "MuiBadge-invisible");
    cy.url().should("include", "lng=11.84326");
    cy.url().should("include", "lat=64.15853");
    cy.url().should("include", "favorites=false");
    cy.url().should("not.include", "layers=");

    // Layer results not visible
    cy.get("#layers-results-list")
      .find(".layers-results-subheaders")
      .should("have.length", 0);
    cy.get("#layers-results-list").should("not.contain", "Arter");
    cy.get("#layers-results-list").should("not.contain", "Ingen treff");
    cy.get("#layers-results-list").should("not.contain", "Arter - fredete");
    cy.get("#layers-results-list").should("not.contain", "Miljødirektoratet");
  });
});
