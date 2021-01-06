/// <reference types="cypress" />

// Arealressurs
const checkboxPath1 =
  "#settings-layers-top-item .MuiCollapse-container .MuiTreeItem-root:nth-child(1) input";
const resultPath1 =
  ".layers-results-subheaders:nth-child(2) .generic_element:nth-child(2)";
const resultBadgePath1 =
  ".layers-results-subheaders:nth-child(2) .generic_element:nth-child(2) .MuiBadge-badge";

// Arter - Rødlista
const checkboxPath2 =
  "#settings-layers-top-item .MuiCollapse-container .MuiTreeItem-root:nth-child(5) input";
const resultPath2 =
  ".layers-results-subheaders:nth-child(1) .generic_element:nth-child(2)";
const resultBadgePath2 =
  ".layers-results-subheaders:nth-child(1) .generic_element:nth-child(2) .MuiBadge-badge";

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
    cy.get(".leaflet-container").click(610, 718);
    cy.get(".infobox-container-side.infobox-open").should("be.visible");
    cy.wait("@getPlaceData", { timeout: 10000 });
    cy.wait("@getAddressData", { timeout: 10000 });

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
    cy.wait("@getFeatureInfoArt", { timeout: 10000 });
    cy.wait("@getFeatureInfoArea", { timeout: 10000 });
    cy.wait("@getFeatureInfoNatur", { timeout: 10000 });

    // Check results
    cy.get("#layers-results-list")
      .find(".layers-results-subheaders")
      .should("have.length", 3);
  });
});
