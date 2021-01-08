/// <reference types="cypress" />

// FAVORITES
// Arealressurs
const checkboxLayer1 =
  "#settings-layers-top-item .MuiCollapse-container .MuiTreeItem-root:nth-child(1) #settings-layers-checkbox";
// Arter
const checkboxLayer2 =
  "#settings-layers-top-item .MuiCollapse-container .MuiTreeItem-root:nth-child(2) #settings-layers-checkbox";
const checkboxLayer3 =
  "#settings-layers-top-item .MuiCollapse-container .MuiTreeItem-root:nth-child(3) #settings-layers-checkbox";
const checkboxLayer4 =
  "#settings-layers-top-item .MuiCollapse-container .MuiTreeItem-root:nth-child(4) #settings-layers-checkbox";
const checkboxLayer5 =
  "#settings-layers-top-item .MuiCollapse-container .MuiTreeItem-root:nth-child(5) #settings-layers-checkbox";
const checkboxLayer6 =
  "#settings-layers-top-item .MuiCollapse-container .MuiTreeItem-root:nth-child(6) #settings-layers-checkbox";

// KARTLAG
// Arter - fredete
const layerPath1 =
  "#layers-list-wrapper .sorted-layers-subheaders:nth-child(1) #layer-list-item:nth-child(2)";
const collapsePath1 =
  ".sorted-layers-subheaders:nth-child(1) .MuiCollapse-container:nth-child(3)";
const allPath1 =
  ".sorted-layers-subheaders:nth-child(1) .MuiCollapse-container:nth-child(3) .collapsed_container .underlag-all input";
const switchPath1A =
  ".sorted-layers-subheaders:nth-child(1) .MuiCollapse-container:nth-child(3) .collapsed_container .underlag:first input";
const switchPath1B =
  ".sorted-layers-subheaders:nth-child(1) .MuiCollapse-container:nth-child(3) .collapsed_container .underlag:last input";
const badgePath1 =
  ".sorted-layers-subheaders:nth-child(1) #layer-list-item:nth-child(2) .MuiBadge-badge";

// Arter - rødlista
const layerPath2 =
  "#layers-list-wrapper .sorted-layers-subheaders:nth-child(1) #layer-list-item:nth-child(6)";
const allPath2 =
  ".sorted-layers-subheaders:nth-child(1) .MuiCollapse-container:nth-child(7) .collapsed_container .underlag-all input";
const switchPath2A =
  ".sorted-layers-subheaders:nth-child(1) .MuiCollapse-container:nth-child(7) .collapsed_container .underlag:nth-child(2) input";
const switchPath2B =
  ".sorted-layers-subheaders:nth-child(1) .MuiCollapse-container:nth-child(7) .collapsed_container .underlag:nth-child(3) input";
const switchPath2C =
  ".sorted-layers-subheaders:nth-child(1) .MuiCollapse-container:nth-child(7) .collapsed_container .underlag:nth-child(4) input";
const switchPath2D =
  ".sorted-layers-subheaders:nth-child(1) .MuiCollapse-container:nth-child(7) .collapsed_container .underlag:nth-child(5) input";
const switchPath2E =
  ".sorted-layers-subheaders:nth-child(1) .MuiCollapse-container:nth-child(7) .collapsed_container .underlag:nth-child(6) input";
const switchPath2F =
  ".sorted-layers-subheaders:nth-child(1) .MuiCollapse-container:nth-child(7) .collapsed_container .underlag:nth-child(7) input";
const badgePath2 =
  ".sorted-layers-subheaders:nth-child(1) #layer-list-item:nth-child(6) .MuiBadge-badge";

describe("Swicth Between All Layers and Favorite Layers Tests", () => {
  before(() => {
    // Delete indexed DB
    indexedDB.deleteDatabase("GrunnkartDB");
  });

  it("Show tiles for all layers", () => {
    cy.startDesktop();

    // Zoom in map
    cy.get('a[title="Zoom in"]').click();
    cy.wait(300);

    // Check all kartlag is used and arter-fredete layer exists
    cy.contains("Kartlag");
    cy.contains("Gruppert på tema");
    cy.contains("Arter - fredete");
    cy.contains("Miljødirektoratet");
    cy.get(collapsePath1).should("not.exist");

    // Check only map layers are visible
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 2);

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
    cy.url().should("include", "favorites=false");
    cy.url().should("not.include", "layers=");
    cy.get(".leaflet-container").click(650, 650);
    cy.get(".infobox-container-side.infobox-open").should("be.visible");
    cy.wait("@getPlaceData");
    cy.wait("@getAddressData");
    cy.url().should("include", "lng=12.39257");
    cy.url().should("include", "lat=64.63329");
    cy.url().should("include", "favorites=false");
    cy.url().should("not.include", "layers=");

    // Expand
    cy.get(layerPath1).click();
    cy.contains("Fredete arter - områder");
    cy.contains("Fredete arter - punkt");
    cy.get(collapsePath1).should("be.visible");

    // Intercept request
    cy.intercept(
      "https://kart.miljodirektoratet.no/arcgis/services/artnasjonal/MapServer/WmsServer?request=GetFeatureInfo&service=WMS&version=1.3.0&x=128&y=128&width=255&height=255&layers=Fredete_arter_omr&query_layers=Fredete_arter_omr&info_format=application%2Fvnd.esri.wms_raw_xml&crs=EPSG%3A4326&srs=EPSG%3A4326&bbox=64.62329214257159%2C12.382578125%2C64.6432921425716%2C12.402578125"
    ).as("getFeatureInfoFredete");

    // Activate sublayer Fredete arter - områder
    cy.get(allPath1).should("not.be.checked");
    cy.get(switchPath1A).should("not.be.checked");
    cy.get(switchPath1B).should("not.be.checked");
    cy.get(badgePath1).should("have.class", "MuiBadge-invisible");
    cy.get(switchPath1A).click();
    cy.get(allPath1).should("not.be.checked");
    cy.get(switchPath1A).should("be.checked");
    cy.get(switchPath1B).should("not.be.checked");
    cy.get(badgePath1).should("contain", "1");
    cy.wait("@getFeatureInfoFredete");
    cy.url().should("include", "lng=12.39257");
    cy.url().should("include", "lat=64.63329");
    cy.url().should("include", "layers=222&favorites=false");

    // Check new layer is visible
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 3);

    // Layer results visible
    cy.get("#layers-results-list")
      .find(".layers-results-subheaders")
      .should("have.length", 1);
    cy.get("#layers-results-list").contains("Arter");
    cy.get("#layers-results-list").contains("Ingen treff");
    cy.get("#layers-results-list").contains("Arter - fredete");
    cy.get("#layers-results-list").contains("Miljødirektoratet");
  });

  it("Select some favorite layers and save", () => {
    // Open favorites edit page and expand relevant layers
    cy.get(".help_button").click();
    cy.get("#settings-drawer").contains("Endre favorittkartlag");
    cy.get("#drawer-menuitem-edit-kartlag").click();
    cy.get(".settings-layers-wrapper").should("be.visible");
    cy.get(".settings-layers-wrapper").contains("Kartlag");
    cy.get(".settings-layers-list-item-wrapper").click();
    cy.get(".settings-layers-wrapper").contains("Arealressurs: AR5");
    cy.get(".settings-layers-wrapper").contains("Arter - Rødlista");
    cy.get(".settings-layers-wrapper").contains("Naturtyper - DN Håndbok 13");

    // Select 5 layers
    cy.get(checkboxLayer1).click();
    cy.get(checkboxLayer2).click();
    cy.get(checkboxLayer3).click();
    cy.get(checkboxLayer4).click();
    cy.get(checkboxLayer5).click();

    // Save and get back to map
    cy.get("#settings-layers-save-button").click();
    cy.get(".settings-layers-wrapper", { timeout: 10000 }).should("not.exist");
    cy.url().should("include", "lng=12.39257");
    cy.url().should("include", "lat=64.63329");
    cy.url().should("include", "favorites=true");
    cy.url().should("not.include", "layers=");

    // Check favorites are being used
    cy.get(".kartlag_fanen").contains("Favorittkartlag");
    cy.get("#layers-list-wrapper")
      .find(".sorted-layers-subheaders")
      .should("have.length", 2);
    cy.get(".kartlag_fanen").contains("Arealressurs: AR5");
    cy.get(".kartlag_fanen").contains("Arter - fredete");
    cy.get(".kartlag_fanen").contains("Arter - Fremmede arter 2018");
    cy.get(".kartlag_fanen").contains("Arter - Prioriterte");
    cy.get(".kartlag_fanen").contains("Arter - Rødlista");

    // Check no results are shown in infobox
    cy.get("#layers-results-list")
      .find(".layers-results-subheaders")
      .should("have.length", 0);
    cy.get("#layers-results-list").should("not.contain", "Arter");
    cy.get("#layers-results-list").should("not.contain", "Ingen treff");
    cy.get("#layers-results-list").should("not.contain", "Arter - fredete");
    cy.get("#layers-results-list").should("not.contain", "Miljødirektoratet");
  });

  it("Show tiles for favorite layers", () => {
    // Check only map layers are visible
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 2);

    // Intercept request
    cy.intercept(
      "https://kart.miljodirektoratet.no/arcgis/services/artnasjonal/MapServer/WmsServer?request=GetFeatureInfo&service=WMS&version=1.3.0&x=128&y=128&width=255&height=255&layers=Fredete_arter_omr%2CFredete_arter_pkt&query_layers=Fredete_arter_omr%2CFredete_arter_pkt&info_format=application%2Fvnd.esri.wms_raw_xml&crs=EPSG%3A4326&srs=EPSG%3A4326&bbox=64.62329214257159%2C12.382578125%2C64.6432921425716%2C12.402578125"
    ).as("getFeatureInfoFredete");

    // Activate sublayer Fredete arter - punkt
    cy.get(allPath1).click();
    cy.get(allPath1).should("be.checked");
    cy.get(switchPath1A).should("be.checked");
    cy.get(switchPath1B).should("be.checked");
    cy.get(badgePath1).should("contain", "2");
    cy.url().should("include", "lng=12.39257");
    cy.url().should("include", "lat=64.63329");
    cy.url().should("include", "layers=222,223&favorites=true");

    // Check new layers are visible
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 4);

    // Expand
    cy.get(layerPath2).click();
    cy.contains("RE - Regionalt utdødd");
    cy.contains("CR - Kritisk truet");
    cy.contains("EN - Sterkt truet");
    cy.contains("VU - Sårbar");
    cy.contains("NT - Nær truet");
    cy.contains("DD - Datamangel");

    // Intercept request
    cy.intercept(
      "https://kart.artsdatabanken.no/WMS/artskart.aspx?request=GetFeatureInfo&service=WMS&version=1.3.0&x=128&y=128&width=255&height=255&layers=Artskart&query_layers=Artskart&info_format=application%2Fvnd.ogc.gml&crs=EPSG%3A4326&srs=EPSG%3A4326&bbox=64.62329214257159%2C12.382578125%2C64.6432921425716%2C12.402578125"
    ).as("getFeatureInfoRødlista");

    // Activate layer Arter - Rødlista
    cy.get(allPath2).click();
    cy.get(allPath2).should("be.checked");
    cy.get(switchPath2A).should("be.checked");
    cy.get(switchPath2B).should("be.checked");
    cy.get(switchPath2C).should("be.checked");
    cy.get(switchPath2D).should("be.checked");
    cy.get(switchPath2F).should("be.checked");
    cy.get(switchPath2F).should("be.checked");
    cy.get(badgePath2).should("contain", "6");

    // Wait for request responses
    cy.wait("@getFeatureInfoFredete");
    cy.wait("@getFeatureInfoRødlista");
    cy.url().should("include", "lng=12.39257");
    cy.url().should("include", "lat=64.63329");
    cy.url().should(
      "include",
      "layers=222,223,29,38,39,40,41,42,43&favorites=true"
    );

    // Check new layers are visible
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 5);

    // Layer results visible
    cy.get("#layers-results-list")
      .find(".layers-results-subheaders")
      .should("have.length", 1);
    cy.get("#layers-results-list").contains("Arter");
    cy.get("#layers-results-list").contains("Ingen treff");
    cy.get("#layers-results-list").contains("Arter - fredete");
    cy.get("#layers-results-list").contains("Miljødirektoratet");
    cy.get("#layers-results-list").contains("Arter - Rødlista");
    cy.get("#layers-results-list").contains("Artsdatabanken");
  });

  it("Switch to all layers from kartlag", () => {
    // Intercept request
    cy.intercept(
      "https://kart.miljodirektoratet.no/arcgis/services/artnasjonal/MapServer/WmsServer?request=GetFeatureInfo&service=WMS&version=1.3.0&x=128&y=128&width=255&height=255&layers=Fredete_arter_omr&query_layers=Fredete_arter_omr&info_format=application%2Fvnd.esri.wms_raw_xml&crs=EPSG%3A4326&srs=EPSG%3A4326&bbox=64.62329214257159%2C12.382578125%2C64.6432921425716%2C12.402578125"
    ).as("getFeatureInfoFredete");

    // Change to all layers
    cy.get("#switch-favourites-button").click();
    cy.get("#all-layers-menu-item").should("be.visible");
    cy.get("#all-layers-menu-item").click();
    cy.get(".kartlag_fanen").contains("Kartlag");

    // Only sublayer Fredete arter - punkt is active
    cy.get(allPath1).should("not.be.checked");
    cy.get(switchPath1A).should("be.checked");
    cy.get(switchPath1B).should("not.be.checked");
    cy.get(badgePath1).should("contain", "1");

    // Layer Arter - Rødlista in inactive
    cy.get(allPath2).should("not.be.checked");
    cy.get(switchPath2A).should("not.be.checked");
    cy.get(switchPath2B).should("not.be.checked");
    cy.get(switchPath2C).should("not.be.checked");
    cy.get(switchPath2D).should("not.be.checked");
    cy.get(switchPath2F).should("not.be.checked");
    cy.get(switchPath2F).should("not.be.checked");
    cy.get(badgePath2).should("have.class", "MuiBadge-invisible");

    // Wait for request responses
    cy.wait("@getFeatureInfoFredete");
    cy.url().should("include", "lng=12.39257");
    cy.url().should("include", "lat=64.63329");
    cy.url().should("include", "layers=222&favorites=false");

    // Check new layers are visible
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 3);

    // Layer results visible
    cy.get("#layers-results-list")
      .find(".layers-results-subheaders")
      .should("have.length", 1);
    cy.get("#layers-results-list").contains("Arter");
    cy.get("#layers-results-list").contains("Ingen treff");
    cy.get("#layers-results-list").contains("Arter - fredete");
    cy.get("#layers-results-list").contains("Miljødirektoratet");
  });

  it("Switch to favorite layers from kartlag", () => {
    // Intercept request
    cy.intercept(
      "https://kart.miljodirektoratet.no/arcgis/services/artnasjonal/MapServer/WmsServer?request=GetFeatureInfo&service=WMS&version=1.3.0&x=128&y=128&width=255&height=255&layers=Fredete_arter_omr%2CFredete_arter_pkt&query_layers=Fredete_arter_omr%2CFredete_arter_pkt&info_format=application%2Fvnd.esri.wms_raw_xml&crs=EPSG%3A4326&srs=EPSG%3A4326&bbox=64.62329214257159%2C12.382578125%2C64.6432921425716%2C12.402578125"
    ).as("getFeatureInfoFredete");
    cy.intercept(
      "https://kart.artsdatabanken.no/WMS/artskart.aspx?request=GetFeatureInfo&service=WMS&version=1.3.0&x=128&y=128&width=255&height=255&layers=Artskart&query_layers=Artskart&info_format=application%2Fvnd.ogc.gml&crs=EPSG%3A4326&srs=EPSG%3A4326&bbox=64.62329214257159%2C12.382578125%2C64.6432921425716%2C12.402578125"
    ).as("getFeatureInfoRødlista");

    // Change to favorite layers
    cy.get("#switch-favourites-button").click();
    cy.get("#favourites-layers-menu-item").should("be.visible");
    cy.get("#favourites-layers-menu-item").click();
    cy.get(".kartlag_fanen").contains("Favorittkartlag");

    // Only sublayer Fredete arter - punkt is active
    cy.get(allPath1).should("be.checked");
    cy.get(switchPath1A).should("be.checked");
    cy.get(switchPath1B).should("be.checked");
    cy.get(badgePath1).should("contain", "2");

    // Layer Arter - Rødlista in inactive
    cy.get(allPath2).should("be.checked");
    cy.get(switchPath2A).should("be.checked");
    cy.get(switchPath2B).should("be.checked");
    cy.get(switchPath2C).should("be.checked");
    cy.get(switchPath2D).should("be.checked");
    cy.get(switchPath2F).should("be.checked");
    cy.get(switchPath2F).should("be.checked");
    cy.get(badgePath2).should("contain", "6");

    // Wait for request responses
    cy.wait("@getFeatureInfoFredete");
    cy.wait("@getFeatureInfoRødlista");
    cy.url().should("include", "lng=12.39257");
    cy.url().should("include", "lat=64.63329");
    cy.url().should(
      "include",
      "layers=222,223,29,38,39,40,41,42,43&favorites=true"
    );

    // Check new layers are visible
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 5);

    // Layer results visible
    cy.get("#layers-results-list")
      .find(".layers-results-subheaders")
      .should("have.length", 1);
    cy.get("#layers-results-list").contains("Arter");
    cy.get("#layers-results-list").contains("Ingen treff");
    cy.get("#layers-results-list").contains("Arter - fredete");
    cy.get("#layers-results-list").contains("Miljødirektoratet");
    cy.get("#layers-results-list").contains("Arter - Rødlista");
    cy.get("#layers-results-list").contains("Artsdatabanken");
  });

  it("Switch to all layers from drawer menu", () => {
    // Intercept request
    cy.intercept(
      "https://kart.miljodirektoratet.no/arcgis/services/artnasjonal/MapServer/WmsServer?request=GetFeatureInfo&service=WMS&version=1.3.0&x=128&y=128&width=255&height=255&layers=Fredete_arter_omr&query_layers=Fredete_arter_omr&info_format=application%2Fvnd.esri.wms_raw_xml&crs=EPSG%3A4326&srs=EPSG%3A4326&bbox=64.62329214257159%2C12.382578125%2C64.6432921425716%2C12.402578125"
    ).as("getFeatureInfoFredete");

    // Change to all layers
    cy.get(".help_button").click();
    cy.get("#settings-drawer").contains("Vis alle kartlag");
    cy.get("#drawer-menuitem-all-kartlag").click();
    cy.get(".kartlag_fanen").contains("Kartlag");

    // Only sublayer Fredete arter - punkt is active
    cy.get(allPath1).should("not.be.checked");
    cy.get(switchPath1A).should("be.checked");
    cy.get(switchPath1B).should("not.be.checked");
    cy.get(badgePath1).should("contain", "1");

    // Layer Arter - Rødlista in inactive
    cy.get(allPath2).should("not.be.checked");
    cy.get(switchPath2A).should("not.be.checked");
    cy.get(switchPath2B).should("not.be.checked");
    cy.get(switchPath2C).should("not.be.checked");
    cy.get(switchPath2D).should("not.be.checked");
    cy.get(switchPath2F).should("not.be.checked");
    cy.get(switchPath2F).should("not.be.checked");
    cy.get(badgePath2).should("have.class", "MuiBadge-invisible");

    // Wait for request responses
    cy.wait("@getFeatureInfoFredete");
    cy.url().should("include", "lng=12.39257");
    cy.url().should("include", "lat=64.63329");
    cy.url().should("include", "layers=222&favorites=false");

    // Check new layers are visible
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 3);

    // Layer results visible
    cy.get("#layers-results-list")
      .find(".layers-results-subheaders")
      .should("have.length", 1);
    cy.get("#layers-results-list").contains("Arter");
    cy.get("#layers-results-list").contains("Ingen treff");
    cy.get("#layers-results-list").contains("Arter - fredete");
    cy.get("#layers-results-list").contains("Miljødirektoratet");
  });

  it("Switch to favorite layers from drawer menu", () => {
    // Intercept request
    cy.intercept(
      "https://kart.miljodirektoratet.no/arcgis/services/artnasjonal/MapServer/WmsServer?request=GetFeatureInfo&service=WMS&version=1.3.0&x=128&y=128&width=255&height=255&layers=Fredete_arter_omr%2CFredete_arter_pkt&query_layers=Fredete_arter_omr%2CFredete_arter_pkt&info_format=application%2Fvnd.esri.wms_raw_xml&crs=EPSG%3A4326&srs=EPSG%3A4326&bbox=64.62329214257159%2C12.382578125%2C64.6432921425716%2C12.402578125"
    ).as("getFeatureInfoFredete");
    cy.intercept(
      "https://kart.artsdatabanken.no/WMS/artskart.aspx?request=GetFeatureInfo&service=WMS&version=1.3.0&x=128&y=128&width=255&height=255&layers=Artskart&query_layers=Artskart&info_format=application%2Fvnd.ogc.gml&crs=EPSG%3A4326&srs=EPSG%3A4326&bbox=64.62329214257159%2C12.382578125%2C64.6432921425716%2C12.402578125"
    ).as("getFeatureInfoRødlista");

    // Change to favorite layers
    cy.get(".help_button").click();
    cy.get("#settings-drawer").contains("Vis favorittkartlag");
    cy.get("#drawer-menuitem-favourite-kartlag").click();
    cy.get(".kartlag_fanen").contains("Favorittkartlag");

    // Only sublayer Fredete arter - punkt is active
    cy.get(allPath1).should("be.checked");
    cy.get(switchPath1A).should("be.checked");
    cy.get(switchPath1B).should("be.checked");
    cy.get(badgePath1).should("contain", "2");

    // Layer Arter - Rødlista in inactive
    cy.get(allPath2).should("be.checked");
    cy.get(switchPath2A).should("be.checked");
    cy.get(switchPath2B).should("be.checked");
    cy.get(switchPath2C).should("be.checked");
    cy.get(switchPath2D).should("be.checked");
    cy.get(switchPath2F).should("be.checked");
    cy.get(switchPath2F).should("be.checked");
    cy.get(badgePath2).should("contain", "6");

    // Wait for request responses
    cy.wait("@getFeatureInfoFredete");
    cy.wait("@getFeatureInfoRødlista");
    cy.url().should("include", "lng=12.39257");
    cy.url().should("include", "lat=64.63329");
    cy.url().should(
      "include",
      "layers=222,223,29,38,39,40,41,42,43&favorites=true"
    );

    // Check new layers are visible
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 5);

    // Layer results visible
    cy.get("#layers-results-list")
      .find(".layers-results-subheaders")
      .should("have.length", 1);
    cy.get("#layers-results-list").contains("Arter");
    cy.get("#layers-results-list").contains("Ingen treff");
    cy.get("#layers-results-list").contains("Arter - fredete");
    cy.get("#layers-results-list").contains("Miljødirektoratet");
    cy.get("#layers-results-list").contains("Arter - Rødlista");
    cy.get("#layers-results-list").contains("Artsdatabanken");
  });

  it("Editting favorites switches off favorite layers toggles, but not all layers toggles", () => {
    // Open favorites edit page and expand relevant layers
    cy.get(".help_button").click();
    cy.get("#settings-drawer").contains("Endre favorittkartlag");
    cy.get("#drawer-menuitem-edit-kartlag").click();
    cy.get(".settings-layers-wrapper").should("be.visible");
    cy.get(".settings-layers-wrapper").contains("Kartlag");
    cy.get(".settings-layers-list-item-wrapper").click();
    cy.get(".settings-layers-wrapper").contains("Arealressurs: AR5");
    cy.get(".settings-layers-wrapper").contains("Arter - Rødlista");
    cy.get(".settings-layers-wrapper").contains("Naturtyper - DN Håndbok 13");

    // Add 1 more layer
    cy.get(checkboxLayer6).click();

    // Save and get back to map
    cy.get("#settings-layers-save-button").click();
    cy.get(".settings-layers-wrapper", { timeout: 10000 }).should("not.exist");

    // Check favorites are being used
    cy.get(".kartlag_fanen").contains("Favorittkartlag");
    cy.get("#layers-list-wrapper")
      .find(".sorted-layers-subheaders")
      .should("have.length", 2);
    cy.get(".kartlag_fanen").contains("Arealressurs: AR5");
    cy.get(".kartlag_fanen").contains("Arter - fredete");
    cy.get(".kartlag_fanen").contains("Arter - Fremmede arter 2018");
    cy.get(".kartlag_fanen").contains("Arter - Prioriterte");
    cy.get(".kartlag_fanen").contains("Arter - Rødlista");
    cy.get(".kartlag_fanen").contains("Arter - Truede arter - hot spots");

    // Nothing is active
    cy.get(allPath1).should("not.be.checked");
    cy.get(switchPath1A).should("not.be.checked");
    cy.get(switchPath1B).should("not.be.checked");
    cy.get(badgePath1).should("have.class", "MuiBadge-invisible");

    cy.get(allPath2).should("not.be.checked");
    cy.get(switchPath2A).should("not.be.checked");
    cy.get(switchPath2B).should("not.be.checked");
    cy.get(switchPath2C).should("not.be.checked");
    cy.get(switchPath2D).should("not.be.checked");
    cy.get(switchPath2F).should("not.be.checked");
    cy.get(switchPath2F).should("not.be.checked");
    cy.get(badgePath2).should("have.class", "MuiBadge-invisible");

    cy.url().should("include", "lng=12.39257");
    cy.url().should("include", "lat=64.63329");
    cy.url().should("include", "favorites=true");
    cy.url().should("not.include", "layers=");

    // Check only map layers layers are visible
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 2);

    // Check no results are shown in infobox
    cy.get("#layers-results-list")
      .find(".layers-results-subheaders")
      .should("have.length", 0);
    cy.get("#layers-results-list").should("not.contain", "Arter");
    cy.get("#layers-results-list").should("not.contain", "Ingen treff");
    cy.get("#layers-results-list").should("not.contain", "Arter - fredete");
    cy.get("#layers-results-list").should("not.contain", "Miljødirektoratet");
    cy.get("#layers-results-list").should("not.contain", "Arter - Rødlista");
    cy.get("#layers-results-list").should("not.contain", "Artsdatabanken");

    // Intercept request
    cy.intercept(
      "https://kart.miljodirektoratet.no/arcgis/services/artnasjonal/MapServer/WmsServer?request=GetFeatureInfo&service=WMS&version=1.3.0&x=128&y=128&width=255&height=255&layers=Fredete_arter_omr&query_layers=Fredete_arter_omr&info_format=application%2Fvnd.esri.wms_raw_xml&crs=EPSG%3A4326&srs=EPSG%3A4326&bbox=64.62329214257159%2C12.382578125%2C64.6432921425716%2C12.402578125"
    ).as("getFeatureInfoFredete");

    // Change to all layers
    cy.get("#switch-favourites-button").click();
    cy.get("#all-layers-menu-item").should("be.visible");
    cy.get("#all-layers-menu-item").click();
    cy.get(".kartlag_fanen").contains("Kartlag");

    // Only sublayer Fredete arter - punkt is active
    cy.get(allPath1).should("not.be.checked");
    cy.get(switchPath1A).should("be.checked");
    cy.get(switchPath1B).should("not.be.checked");
    cy.get(badgePath1).should("contain", "1");

    // Layer Arter - Rødlista in inactive
    cy.get(allPath2).should("not.be.checked");
    cy.get(switchPath2A).should("not.be.checked");
    cy.get(switchPath2B).should("not.be.checked");
    cy.get(switchPath2C).should("not.be.checked");
    cy.get(switchPath2D).should("not.be.checked");
    cy.get(switchPath2F).should("not.be.checked");
    cy.get(switchPath2F).should("not.be.checked");
    cy.get(badgePath2).should("have.class", "MuiBadge-invisible");

    // Wait for request responses
    cy.wait("@getFeatureInfoFredete");
    cy.url().should("include", "lng=12.39257");
    cy.url().should("include", "lat=64.63329");
    cy.url().should("include", "layers=222&favorites=false");

    // Check new layers are visible
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 3);

    // Layer results visible
    cy.get("#layers-results-list")
      .find(".layers-results-subheaders")
      .should("have.length", 1);
    cy.get("#layers-results-list").contains("Arter");
    cy.get("#layers-results-list").contains("Ingen treff");
    cy.get("#layers-results-list").contains("Arter - fredete");
    cy.get("#layers-results-list").contains("Miljødirektoratet");
  });
});
