/// <reference types="cypress" />

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

describe("Show Tiles Tests", () => {
  before(() => {
    // Delete indexed DB
    indexedDB.deleteDatabase("GrunnkartDB");
  });

  it("Show tiles for simple layers", () => {
    cy.startDesktop();

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

    // Expand
    cy.get(layerPath1).click();
    cy.contains("Fredete arter - områder");
    cy.contains("Fredete arter - punkt");
    cy.get(collapsePath1).should("be.visible");

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

    // Check new layer is visible
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 3);

    // Activate sublayer Fredete arter - punkt
    cy.get(switchPath1B).click();
    cy.get(allPath1).should("be.checked");
    cy.get(switchPath1A).should("be.checked");
    cy.get(switchPath1B).should("be.checked");
    cy.get(badgePath1).should("contain", "2");

    // Check new layer is visible
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 4);

    // Desactivate all sublayers
    cy.get(allPath1).click();
    cy.get(allPath1).should("not.be.checked");
    cy.get(switchPath1A).should("not.be.checked");
    cy.get(switchPath1B).should("not.be.checked");
    cy.get(badgePath1).should("have.class", "MuiBadge-invisible");

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
    cy.get(switchPath1A).click();
    cy.get(allPath1).should("not.be.checked");
    cy.get(switchPath1A).should("be.checked");
    cy.get(switchPath1B).should("not.be.checked");
    cy.get(badgePath1).should("contain", "1");

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
    cy.get(allPath1).click();
    cy.get(allPath1).should("be.checked");
    cy.get(switchPath1A).should("be.checked");
    cy.get(switchPath1B).should("be.checked");
    cy.get(badgePath1).should("contain", "2");

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

  it("Show tiles for aggregated layers", () => {
    // Check all kartlag is used and arter-fredete layer exists
    cy.contains("Kartlag");
    cy.contains("Gruppert på tema");
    cy.contains("Arter - Rødlista");
    cy.contains("Artsdatabanken");

    // Check only map layers are visible
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

    // Activate sublayer RE - Regionalt utdødd
    cy.get(allPath2).should("not.be.checked");
    cy.get(switchPath2A).should("not.be.checked");
    cy.get(switchPath2B).should("not.be.checked");
    cy.get(switchPath2C).should("not.be.checked");
    cy.get(switchPath2D).should("not.be.checked");
    cy.get(switchPath2E).should("not.be.checked");
    cy.get(switchPath2F).should("not.be.checked");
    cy.get(badgePath2).should("have.class", "MuiBadge-invisible");
    cy.get(switchPath2A).click();
    cy.get(allPath2).should("not.be.checked");
    cy.get(switchPath2A).should("be.checked");
    cy.get(switchPath2B).should("not.be.checked");
    cy.get(switchPath2C).should("not.be.checked");
    cy.get(switchPath2D).should("not.be.checked");
    cy.get(switchPath2F).should("not.be.checked");
    cy.get(switchPath2F).should("not.be.checked");
    cy.get(badgePath2).should("contain", "1");

    // Check new layer is visible
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 5);

    // Activate sublayer DD - Datamangel
    cy.get(switchPath2F).click();
    cy.get(allPath2).should("not.be.checked");
    cy.get(switchPath2A).should("be.checked");
    cy.get(switchPath2B).should("not.be.checked");
    cy.get(switchPath2C).should("not.be.checked");
    cy.get(switchPath2D).should("not.be.checked");
    cy.get(switchPath2E).should("not.be.checked");
    cy.get(switchPath2F).should("be.checked");
    cy.get(badgePath2).should("contain", "2");

    // Check new layer is visible
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 6);

    // Activate all sublayers
    cy.get(allPath2).click();
    cy.get(allPath2).should("be.checked");
    cy.get(switchPath2A).should("be.checked");
    cy.get(switchPath2B).should("be.checked");
    cy.get(switchPath2C).should("be.checked");
    cy.get(switchPath2D).should("be.checked");
    cy.get(switchPath2E).should("be.checked");
    cy.get(switchPath2F).should("be.checked");
    cy.get(badgePath2).should("contain", "6");

    // Check aggregated only layer is visible
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 5);

    // Desactivate all sublayers
    cy.get(allPath2).click();
    cy.get(allPath2).should("not.be.checked");
    cy.get(switchPath2A).should("not.be.checked");
    cy.get(switchPath2B).should("not.be.checked");
    cy.get(switchPath2C).should("not.be.checked");
    cy.get(switchPath2D).should("not.be.checked");
    cy.get(switchPath2E).should("not.be.checked");
    cy.get(switchPath2F).should("not.be.checked");
    cy.get(badgePath2).should("have.class", "MuiBadge-invisible");

    // Check layers are not visible
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 4);

    // Activate all sublayers
    cy.get(allPath2).click();
    cy.get(allPath2).should("be.checked");
    cy.get(switchPath2A).should("be.checked");
    cy.get(switchPath2B).should("be.checked");
    cy.get(switchPath2C).should("be.checked");
    cy.get(switchPath2D).should("be.checked");
    cy.get(switchPath2E).should("be.checked");
    cy.get(switchPath2F).should("be.checked");
    cy.get(badgePath2).should("contain", "6");

    // Check aggregated only layer is visible
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 5);

    // Deactivate sublayer DD - Datamangel
    cy.get(switchPath2F).click();
    cy.get(allPath2).should("not.be.checked");
    cy.get(switchPath2A).should("be.checked");
    cy.get(switchPath2B).should("be.checked");
    cy.get(switchPath2C).should("be.checked");
    cy.get(switchPath2D).should("be.checked");
    cy.get(switchPath2E).should("be.checked");
    cy.get(switchPath2F).should("not.be.checked");
    cy.get(badgePath2).should("contain", "5");

    // Check all other sublayers layer are visible
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 9);
  });

  it("Show legend with 7 layers on right side", () => {
    // Check legend is active
    cy.get("#legend-link-list-item").should(
      "have.attr",
      "aria-disabled",
      "false"
    );
    cy.get("#legend-link-list-item .MuiBadge-badge").contains("7");
    cy.get(".open-legend-left-button button").should("not.be.disabled");

    // Open legend
    cy.get("#legend-link-list-item").click();
    cy.get(".legend-wrapper-right").contains("Arter - fredete");
    cy.get(".legend-wrapper-right").contains("Fredete arter - områder");
    cy.get(".legend-wrapper-right").contains("Fredete arter - punkt");
    cy.get(".legend-wrapper-right").contains("Arter - Rødlista");
    cy.get(".legend-wrapper-right").contains("RE - Regionalt utdødd");
    cy.get(".legend-wrapper-right").contains("CR - Kritisk truet");
    cy.get(".legend-wrapper-right").contains("EN - Sterkt truet");
    cy.get(".legend-wrapper-right").contains("VU - Sårbar");
    cy.get(".legend-wrapper-right").contains("NT - Nær truet");
    cy.get(".legend-wrapper-right")
      .find("img")
      .should("have.length", 7);

    // Close legend
    cy.get("#legend-title-wrapper").click();
    cy.get(".legend-wrapper-right").should("not.exist");
  });
});
