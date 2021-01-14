/// <reference types="cypress" />

// Arealressurs
const checkboxLayer1 =
  "#settings-layers-top-item .MuiCollapse-container .MuiTreeItem-root:nth-child(1) #settings-layers-checkbox";
const badgePath1 =
  ".sorted-layers-subheaders:nth-child(2) #layer-list-item:nth-child(2) .MuiBadge-badge";

// Arter - fredete
const checkboxLayer2 =
  "#settings-layers-top-item .MuiCollapse-container .MuiTreeItem-root:nth-child(2) #settings-layers-checkbox";
const badgePath2 =
  ".sorted-layers-subheaders:nth-child(1) #layer-list-item:nth-child(2) .MuiBadge-badge";

// Arter - Rødlista
const checkboxLayer3 =
  "#settings-layers-top-item .MuiCollapse-container .MuiTreeItem-root:nth-child(5) #settings-layers-checkbox";
const badgePath3 =
  ".sorted-layers-subheaders:nth-child(1) #layer-list-item:nth-child(6) .MuiBadge-badge";

describe("URL Update Tests", () => {
  before(() => {
    // Delete indexed DB
    indexedDB.deleteDatabase("GrunnkartDB");
  });

  it("Go to favourites through URL", () => {
    cy.wait(1000);
    cy.startDesktop();

    // Use favorites
    cy.visit(Cypress.env("baseurl") + "?favorites=true");

    // Check favorites are not being used
    // App redirects to all layers when no favourites are defined
    cy.get(".kartlag_fanen").contains("Kartlag");
    cy.get(".kartlag_fanen").contains("Arealressurs: AR5");
    cy.get(".kartlag_fanen").contains("Arter - fredete");
    cy.get(".kartlag_fanen").contains("Arter - Rødlista");
    cy.get(".kartlag_fanen").contains("Naturtyper - DN Håndbok 13");
  });

  it("Select some favorite layers and save", () => {
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

    // Change 2 layers
    cy.get(checkboxLayer1).click();
    cy.get(checkboxLayer2).click();
    cy.get(checkboxLayer3).click();
    cy.get(checkboxLayer1).should("be.checked");
    cy.get(checkboxLayer2).should("be.checked");
    cy.get(checkboxLayer3).should("be.checked");

    // Close and get back to map
    cy.get("#settings-layers-save-button").click();
    cy.get(".settings-layers-wrapper", { timeout: 10000 }).should("not.exist");

    // Check favorites are being used
    cy.get(".kartlag_fanen").contains("Favorittkartlag");
    cy.get("#layers-list-wrapper")
      .find(".sorted-layers-subheaders")
      .should("have.length", 2);
    cy.get(".kartlag_fanen").contains("Arealressurs: AR5");
    cy.get(".kartlag_fanen").contains("Arter - fredete");
    cy.get(".kartlag_fanen").contains("Arter - Rødlista");
    cy.get(".kartlag_fanen").should(
      "not.contain",
      "Naturtyper - DN Håndbok 13"
    );

    // Check URL
    cy.url().should("include", "favorites=true");

    // Wait so data is saved in Indexed DB
    cy.wait(2000);
  });

  it("Go to all layers through URL", () => {
    // Check only map layers are visible
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 2);

    // Change to all layers
    cy.visit(Cypress.env("baseurl") + "?favorites=false");

    // Check favorites are not being used
    // App redirects to all layers when no favourites are defined
    cy.get(".kartlag_fanen").contains("Kartlag");
    cy.get(".kartlag_fanen").contains("Arealressurs: AR5");
    cy.get(".kartlag_fanen").contains("Arter - fredete");
    cy.get(".kartlag_fanen").contains("Arter - Rødlista");
    cy.get(".kartlag_fanen").contains("Naturtyper - DN Håndbok 13");
  });

  it("Select active layers for all layers through URL", () => {
    // Activate layers 222
    cy.visit(Cypress.env("baseurl") + "?layers=222&favorites=false");
    cy.wait(1000);

    // Check favorites are not being used and layer is visible
    cy.get(".kartlag_fanen").contains("Kartlag");
    cy.get(".kartlag_fanen").contains("Arealressurs: AR5");
    cy.get(".kartlag_fanen").contains("Arter - fredete");
    cy.get(".kartlag_fanen").contains("Arter - Rødlista");
    cy.get(".kartlag_fanen").contains("Naturtyper - DN Håndbok 13");
    cy.get(badgePath2).should("contain", "1");

    // Check new layer is visible
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 3);

    // Activate layers 222 and 223
    cy.visit(Cypress.env("baseurl") + "?layers=222,223&favorites=false");
    cy.wait(1000);

    // Check favorites are not being used and layers are visible
    cy.get(".kartlag_fanen").contains("Kartlag");
    cy.get(".kartlag_fanen").contains("Arealressurs: AR5");
    cy.get(".kartlag_fanen").contains("Arter - fredete");
    cy.get(".kartlag_fanen").contains("Arter - Rødlista");
    cy.get(".kartlag_fanen").contains("Naturtyper - DN Håndbok 13");
    cy.get(badgePath2).should("contain", "2");

    // Check new layer is visible
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 4);

    // Change to favorites ans check that URL is as expected
    cy.get("#switch-favourites-button").click();
    cy.get("#favourites-layers-menu-item").should("be.visible");
    cy.get("#favourites-layers-menu-item").click();
    cy.get(".kartlag_fanen").contains("Favorittkartlag");
    cy.get(".kartlag_fanen").contains("Arealressurs: AR5");
    cy.get(".kartlag_fanen").contains("Arter - fredete");
    cy.get(".kartlag_fanen").contains("Arter - Rødlista");
    cy.get(".kartlag_fanen").should(
      "not.contain",
      "Naturtyper - DN Håndbok 13"
    );
    cy.get(badgePath2).should("have.class", "MuiBadge-invisible");
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 2);
    cy.url().should("include", "?favorites=true");

    // Change back to all layers ans check that URL is as expected
    cy.get("#switch-favourites-button").click();
    cy.get("#all-layers-menu-item").should("be.visible");
    cy.get("#all-layers-menu-item").click();
    cy.get(".kartlag_fanen").contains("Kartlag");
    cy.get(".kartlag_fanen").contains("Arealressurs: AR5");
    cy.get(".kartlag_fanen").contains("Arter - fredete");
    cy.get(".kartlag_fanen").contains("Arter - Rødlista");
    cy.get(".kartlag_fanen").contains("Naturtyper - DN Håndbok 13");
    cy.get(badgePath2).should("contain", "2");
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 4);
    cy.url().should("include", "?layers=222,223&favorites=false");
  });

  it("Select active layers for favorites through URL", () => {
    // Activate layers 222
    cy.visit(Cypress.env("baseurl") + "?layers=222&favorites=true");
    cy.wait(1000);

    // Check favorites are being used and layer is visible
    cy.get(".kartlag_fanen").contains("Favorittkartlag");
    cy.get(".kartlag_fanen").contains("Arealressurs: AR5");
    cy.get(".kartlag_fanen").contains("Arter - fredete");
    cy.get(".kartlag_fanen").contains("Arter - Rødlista");
    cy.get(".kartlag_fanen").should(
      "not.contain",
      "Naturtyper - DN Håndbok 13"
    );
    cy.get(badgePath2).should("contain", "1");

    // Check new layer is visible
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 3);

    // Activate layers 222 and 223
    cy.visit(Cypress.env("baseurl") + "?layers=222,223&favorites=true");
    cy.wait(1000);

    // Check favorites are being used and layers are visible
    cy.get(".kartlag_fanen").contains("Favorittkartlag");
    cy.get(".kartlag_fanen").contains("Arealressurs: AR5");
    cy.get(".kartlag_fanen").contains("Arter - fredete");
    cy.get(".kartlag_fanen").contains("Arter - Rødlista");
    cy.get(".kartlag_fanen").should(
      "not.contain",
      "Naturtyper - DN Håndbok 13"
    );
    cy.get(badgePath2).should("contain", "2");

    // Check new layer is visible
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 4);

    // Change to all layers ans check that URL is as expected
    cy.get("#switch-favourites-button").click();
    cy.get("#all-layers-menu-item").should("be.visible");
    cy.get("#all-layers-menu-item").click();
    cy.get(".kartlag_fanen").contains("Kartlag");
    cy.get(".kartlag_fanen").contains("Arealressurs: AR5");
    cy.get(".kartlag_fanen").contains("Arter - fredete");
    cy.get(".kartlag_fanen").contains("Arter - Rødlista");
    cy.get(".kartlag_fanen").contains("Naturtyper - DN Håndbok 13");
    cy.get(badgePath2).should("have.class", "MuiBadge-invisible");
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 2);
    cy.url().should("include", "?favorites=false");

    // Change back to favorites ans check that URL is as expected
    cy.get("#switch-favourites-button").click();
    cy.get("#favourites-layers-menu-item").should("be.visible");
    cy.get("#favourites-layers-menu-item").click();
    cy.get(".kartlag_fanen").contains("Favorittkartlag");
    cy.get(".kartlag_fanen").contains("Arealressurs: AR5");
    cy.get(".kartlag_fanen").contains("Arter - fredete");
    cy.get(".kartlag_fanen").contains("Arter - Rødlista");
    cy.get(".kartlag_fanen").should(
      "not.contain",
      "Naturtyper - DN Håndbok 13"
    );
    cy.get(badgePath2).should("contain", "2");
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 4);
    cy.url().should("include", "?layers=222,223&favorites=true");
  });

  it("Select active layers and coordinates for all layers through URL", () => {
    // Intercept requests
    cy.intercept(
      Cypress.env("baseapi") +
        "/rpc/stedsnavn?lng=12.392578125&lat=64.63329214257159&zoom=6"
    ).as("getPlaceData");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?kommunenummer=5046&gardsnummer=85&bruksnummer=1&treffPerSide=100"
    ).as("getAddressData");
    cy.intercept(
      "https://kart.miljodirektoratet.no/arcgis/services/artnasjonal/MapServer/WmsServer?request=GetFeatureInfo&service=WMS&version=1.3.0&x=128&y=128&width=255&height=255&layers=Fredete_arter_omr%2CFredete_arter_pkt&query_layers=Fredete_arter_omr%2CFredete_arter_pkt&info_format=application%2Fvnd.esri.wms_raw_xml&crs=EPSG%3A4326&srs=EPSG%3A4326&bbox=64.62329214257159%2C12.382578125%2C64.6432921425716%2C12.402578125"
    ).as("getFeatureInfoArt");

    // Activate layers 222 and 223
    cy.visit(
      Cypress.env("baseurl") +
        "?lng=12.392578125&lat=64.63329214257159&layers=222,223&favorites=false"
    );
    cy.wait("@getPlaceData");
    cy.wait("@getAddressData");
    cy.wait("@getFeatureInfoArt");

    // Check favorites are not being used and layers are visible
    cy.get(".kartlag_fanen").contains("Kartlag");
    cy.get(".kartlag_fanen").contains("Arealressurs: AR5");
    cy.get(".kartlag_fanen").contains("Arter - fredete");
    cy.get(".kartlag_fanen").contains("Arter - Rødlista");
    cy.get(".kartlag_fanen").contains("Naturtyper - DN Håndbok 13");
    cy.get(badgePath2).should("contain", "2");

    // Check infobox contains correct data
    cy.get("img.leaflet-marker-icon").should("not.be.null");
    cy.get(".infobox-container-side.infobox-open").contains(
      "Råbesdalen naturreservat"
    );
    cy.get(".infobox-container-side.infobox-open").contains("verneområde");
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

    // Check new layer is visible
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 4);

    // Change to favorites ans check that URL is as expected
    cy.get("#switch-favourites-button").click();
    cy.get("#favourites-layers-menu-item").should("be.visible");
    cy.get("#favourites-layers-menu-item").click();
    cy.get(".kartlag_fanen").contains("Favorittkartlag");
    cy.get(".kartlag_fanen").contains("Arealressurs: AR5");
    cy.get(".kartlag_fanen").contains("Arter - fredete");
    cy.get(".kartlag_fanen").contains("Arter - Rødlista");
    cy.get(".kartlag_fanen").should(
      "not.contain",
      "Naturtyper - DN Håndbok 13"
    );
    cy.get(badgePath2).should("have.class", "MuiBadge-invisible");
    cy.get(".infobox-container-side.infobox-open").contains(
      "Råbesdalen naturreservat"
    );
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 2);
    cy.url().should(
      "include",
      "?lng=12.392578125&lat=64.63329214257159&favorites=true"
    );

    // Change back to all layers ans check that URL is as expected
    cy.get("#switch-favourites-button").click();
    cy.get("#all-layers-menu-item").should("be.visible");
    cy.get("#all-layers-menu-item").click();
    cy.get(".kartlag_fanen").contains("Kartlag");
    cy.get(".kartlag_fanen").contains("Arealressurs: AR5");
    cy.get(".kartlag_fanen").contains("Arter - fredete");
    cy.get(".kartlag_fanen").contains("Arter - Rødlista");
    cy.get(".kartlag_fanen").contains("Naturtyper - DN Håndbok 13");
    cy.get(badgePath2).should("contain", "2");
    cy.get(".infobox-container-side.infobox-open").contains(
      "Råbesdalen naturreservat"
    );
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 4);
    cy.url().should(
      "include",
      "?lng=12.392578125&lat=64.63329214257159&layers=222,223&favorites=false"
    );
  });

  it("Select active layers and coordinates for favorites through URL", () => {
    // Intercept requests
    cy.intercept(
      Cypress.env("baseapi") +
        "/rpc/stedsnavn?lng=12.392578125&lat=64.63329214257159&zoom=6"
    ).as("getPlaceData");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?kommunenummer=5046&gardsnummer=85&bruksnummer=1&treffPerSide=100"
    ).as("getAddressData");
    cy.intercept(
      "https://kart.miljodirektoratet.no/arcgis/services/artnasjonal/MapServer/WmsServer?request=GetFeatureInfo&service=WMS&version=1.3.0&x=128&y=128&width=255&height=255&layers=Fredete_arter_omr%2CFredete_arter_pkt&query_layers=Fredete_arter_omr%2CFredete_arter_pkt&info_format=application%2Fvnd.esri.wms_raw_xml&crs=EPSG%3A4326&srs=EPSG%3A4326&bbox=64.62329214257159%2C12.382578125%2C64.6432921425716%2C12.402578125"
    ).as("getFeatureInfoArt");

    // Activate layers 222 and 223
    cy.visit(
      Cypress.env("baseurl") +
        "?lng=12.392578125&lat=64.63329214257159&layers=222,223&favorites=true"
    );
    cy.wait("@getPlaceData");
    cy.wait("@getAddressData");
    cy.wait("@getFeatureInfoArt");

    // Check favorites are not being used and layers are visible
    cy.get(".kartlag_fanen").contains("Favorittkartlag");
    cy.get(".kartlag_fanen").contains("Arealressurs: AR5");
    cy.get(".kartlag_fanen").contains("Arter - fredete");
    cy.get(".kartlag_fanen").contains("Arter - Rødlista");
    cy.get(".kartlag_fanen").should(
      "not.contain",
      "Naturtyper - DN Håndbok 13"
    );
    cy.get(badgePath2).should("contain", "2");

    // Check infobox contains correct data
    cy.get("img.leaflet-marker-icon").should("not.be.null");
    cy.get(".infobox-container-side.infobox-open").contains(
      "Råbesdalen naturreservat"
    );
    cy.get(".infobox-container-side.infobox-open").contains("verneområde");
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

    // Check new layer is visible
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 4);

    // Change to all layers ans check that URL is as expected
    cy.get("#switch-favourites-button").click();
    cy.get("#all-layers-menu-item").should("be.visible");
    cy.get("#all-layers-menu-item").click();
    cy.get(".kartlag_fanen").contains("Kartlag");
    cy.get(".kartlag_fanen").contains("Arealressurs: AR5");
    cy.get(".kartlag_fanen").contains("Arter - fredete");
    cy.get(".kartlag_fanen").contains("Arter - Rødlista");
    cy.get(".kartlag_fanen").contains("Naturtyper - DN Håndbok 13");
    cy.get(badgePath2).should("have.class", "MuiBadge-invisible");
    cy.get(".infobox-container-side.infobox-open").contains(
      "Råbesdalen naturreservat"
    );
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 2);
    cy.url().should(
      "include",
      "?lng=12.392578125&lat=64.63329214257159&favorites=false"
    );

    // Change back to favorites ans check that URL is as expected
    cy.get("#switch-favourites-button").click();
    cy.get("#favourites-layers-menu-item").should("be.visible");
    cy.get("#favourites-layers-menu-item").click();
    cy.get(".kartlag_fanen").contains("Favorittkartlag");
    cy.get(".kartlag_fanen").contains("Arealressurs: AR5");
    cy.get(".kartlag_fanen").contains("Arter - fredete");
    cy.get(".kartlag_fanen").contains("Arter - Rødlista");
    cy.get(".kartlag_fanen").should(
      "not.contain",
      "Naturtyper - DN Håndbok 13"
    );
    cy.get(badgePath2).should("contain", "2");
    cy.get(".infobox-container-side.infobox-open").contains(
      "Råbesdalen naturreservat"
    );
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 4);
    cy.url().should(
      "include",
      "?lng=12.392578125&lat=64.63329214257159&layers=222,223&favorites=true"
    );
  });
});
