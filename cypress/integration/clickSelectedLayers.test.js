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

    // Click on map
    cy.get(".leaflet-container").click(650, 650);
    cy.get(".infobox-container-side.infobox-open").should("be.visible");

    // Check infobox contains correct data
    cy.get("img.leaflet-marker-icon").should("not.be.null");
    cy.get(".infobox-container-side.infobox-open").contains("Besa");
    cy.get(".infobox-container-side.infobox-open").contains("elv");
    cy.get(".infobox-container-side").contains("Trøndelag - Trööndelage");
    cy.get(".infobox-container-side.infobox-open").contains("50");
    cy.get(".infobox-container-side.infobox-open").contains("Høylandet");
    cy.get(".infobox-container-side.infobox-open").contains("5046");
    cy.get(".infobox-container-side").contains("Skarlandssetran 1");
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

    // Activate sublayer Fredete arter - områder
    cy.get(switchPath1).should("not.be.checked");
    cy.get(badgePath1).should("have.class", "MuiBadge-invisible");
    cy.get(switchPath1).click();
    cy.get(switchPath1).should("be.checked");
    cy.get(badgePath1).should("contain", "1");

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

    // Activate sublayer Arealressurs: AR5 Arealtype
    cy.get(allPath2).should("not.be.checked");
    cy.get(switchPath2).should("not.be.checked");
    cy.get(switchPath2).should("not.be.checked");
    cy.get(badgePath2).should("have.class", "MuiBadge-invisible");
    cy.get(switchPath2).click();
    cy.get(allPath2).should("not.be.checked");
    cy.get(switchPath2).should("be.checked");
    cy.get(badgePath2).should("contain", "1");

    // Layer results visible
    cy.get("#layers-results-list")
      .find(".layers-results-subheaders")
      .should("have.length", 2);
    cy.get("#layers-results-list").contains("Arealressurs");
    cy.get("#layers-results-list").contains("Lite produktiv");
    cy.get("#layers-results-list").contains("Arealressurs: AR5");
    cy.get("#layers-results-list").contains("NIBIO");
    cy.get(resultBadgePath2).should("contain", "1");

    // Activate all sublayers in Arealressurs
    cy.get(allPath2).click();
    cy.get(allPath2).should("be.checked");
    cy.get(switchPath2).should("be.checked");
    cy.get(badgePath2).should("contain", "3");

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
    // Click on another position updates details
    cy.get(".leaflet-container").click(600, 750);
    cy.get(".infobox-container-side .infobox-details-title-text").should(
      "contain",
      "Detaljerte resultater"
    );
    cy.get(".infobox-container-side").contains("Faktaark");
    cy.get(".infobox-container-side", { timeout: 8000 }).should(
      "contain",
      "Arealressurs: AR5 Arealtype"
    );
    cy.get(".infobox-container-side", { timeout: 8000 }).should(
      "contain",
      "Jordbruksareal"
    );
    cy.get(".infobox-container-side", { timeout: 8000 }).should(
      "contain",
      "Treslag"
    );
    cy.get(".infobox-container-side", { timeout: 8000 }).should(
      "contain",
      "Artreslag beskrivelse:"
    );
    cy.get(".infobox-container-side", { timeout: 8000 }).should(
      "contain",
      "Ikke relevant"
    );

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
