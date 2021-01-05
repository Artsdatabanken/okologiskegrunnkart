/// <reference types="cypress" />

const allPath =
  ".sorted-layers-subheaders:nth-child(1) .MuiCollapse-container:first .collapsed_container .underlag-all input";
const switchPath1 =
  ".sorted-layers-subheaders:nth-child(1) .MuiCollapse-container:first .collapsed_container .underlag:first input";
const switchPath2 =
  ".sorted-layers-subheaders:nth-child(1) .MuiCollapse-container:first .collapsed_container .underlag:last input";
const badgePath =
  ".sorted-layers-subheaders:nth-child(1) #layer-list-item:first .MuiBadge-badge";

describe("Show Tiles Tests", () => {
  before(() => {
    // Delete indexed DB
    indexedDB.deleteDatabase("GrunnkartDB");
  });

  it("Show cached tiles", () => {
    cy.startDesktop();

    // Check all kartlag is used and arter-fredete layer exists
    cy.get('button[title="Polygon tool"]').click();
    cy.contains("Kartlag");
    cy.contains("Gruppert på tema");
    cy.contains("Arter - fredete");
    cy.contains("Miljødirektoratet");
    cy.get("#list-element-sublayer").should("not.exist");

    // Check only map layers are visible
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 2);

    // Expand
    cy.get("#layer-list-item").click();
    cy.contains("Fredete arter - områder");
    cy.contains("Fredete arter - punkt");

    // Activate sublayer Fredete arter - områder
    cy.get(allPath).should("not.be.checked");
    cy.get(switchPath1).should("not.be.checked");
    cy.get(switchPath2).should("not.be.checked");
    cy.get(badgePath).should("have.class", "MuiBadge-invisible");
    cy.get(switchPath1).click();
    cy.get(allPath).should("not.be.checked");
    cy.get(switchPath1).should("be.checked");
    cy.get(switchPath2).should("not.be.checked");
    cy.get(badgePath).should("contain", "1");

    // Check new layer is visible
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 3);

    // Activate sublayer Fredete arter - punkt
    cy.get(switchPath2).click();
    cy.get(allPath).should("be.checked");
    cy.get(switchPath1).should("be.checked");
    cy.get(switchPath2).should("be.checked");
    cy.get(badgePath).should("contain", "2");

    // Check new layer is visible
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 4);

    // Desactivate all sublayers
    cy.get(allPath).click();
    cy.get(allPath).should("not.be.checked");
    cy.get(switchPath1).should("not.be.checked");
    cy.get(switchPath2).should("not.be.checked");
    cy.get(badgePath).should("have.class", "MuiBadge-invisible");

    // Check layers are not visible
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 2);
  });

  it("Show legend with one layer on right side", () => {
    // Check legend in not active
    cy.get("#legend-link-list-item").should(
      "have.attr",
      "aria-disabled",
      "true"
    );
    cy.get("#legend-link-list-item .MuiBadge-badge").should(
      "have.class",
      "MuiBadge-invisible"
    );
    cy.get(".open-legend-left-button button").should("be.disabled");

    // Activate sublayer Fredete arter - områder
    cy.get(switchPath1).click();
    cy.get(allPath).should("not.be.checked");
    cy.get(switchPath1).should("be.checked");
    cy.get(switchPath2).should("not.be.checked");
    cy.get(badgePath).should("contain", "1");

    // Check legend is active now
    cy.get("#legend-link-list-item").should(
      "have.attr",
      "aria-disabled",
      "false"
    );
    cy.get("#legend-link-list-item .MuiBadge-badge").contains("1");
    cy.get(".open-legend-left-button button").should("not.be.disabled");

    // Open legend
    cy.get("#legend-link-list-item").click();
    cy.get(".legend-wrapper-right").contains("Arter - fredete");
    cy.get(".legend-wrapper-right").contains("Fredete arter - områder");
    cy.get(".legend-wrapper-right").should(
      "not.contain",
      "Fredete arter - punkt"
    );
    cy.get(".legend-wrapper-right")
      .find("img")
      .should("have.length", 1);

    // Close legend
    cy.get("#legend-title-wrapper").click();
    cy.get(".legend-wrapper-right").should("not.exist");
  });

  it("Show legend with one layer on left side", () => {
    // Open legend on left side
    cy.get(".open-legend-left-button button").click();
    cy.get(".legend-wrapper-left").contains("Arter - fredete");
    cy.get(".legend-wrapper-left").contains("Fredete arter - områder");
    cy.get(".legend-wrapper-left").should(
      "not.contain",
      "Fredete arter - punkt"
    );
    cy.get(".legend-wrapper-left")
      .find("img")
      .should("have.length", 1);

    // Close legend
    cy.get("#legend-title-wrapper").click();
    cy.get(".legend-wrapper-left").should("not.exist");
  });

  it("Show legend with two layers on right side", () => {
    // Activate sublayer Fredete arter - områder
    cy.get(allPath).click();
    cy.get(allPath).should("be.checked");
    cy.get(switchPath1).should("be.checked");
    cy.get(switchPath2).should("be.checked");
    cy.get(badgePath).should("contain", "2");

    // Open legend
    cy.get("#legend-link-list-item").click();
    cy.get(".legend-wrapper-right").contains("Arter - fredete");
    cy.get(".legend-wrapper-right").contains("Fredete arter - områder");
    cy.get(".legend-wrapper-right").contains("Fredete arter - punkt");
    cy.get(".legend-wrapper-right")
      .find("img")
      .should("have.length", 2);

    // Close legend
    cy.get("#legend-title-wrapper").click();
    cy.get(".legend-wrapper-right").should("not.exist");
  });

  it("Show legend with two layers on left side", () => {
    // Open legend on left side
    cy.get(".open-legend-left-button button").click();
    cy.get(".legend-wrapper-left").contains("Arter - fredete");
    cy.get(".legend-wrapper-left").contains("Fredete arter - områder");
    cy.get(".legend-wrapper-left").contains("Fredete arter - punkt");
    cy.get(".legend-wrapper-left")
      .find("img")
      .should("have.length", 2);

    // Close legend
    cy.get("#legend-title-wrapper").click();
    cy.get(".legend-wrapper-left").should("not.exist");
  });
});
