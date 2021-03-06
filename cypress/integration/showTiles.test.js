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
const layerAllPath1 =
  ".sorted-layers-subheaders:nth-child(1) .MuiCollapse-container:nth-child(3) .collapsed_container .underlag-all";
const sublayerPath1A =
  ".sorted-layers-subheaders:nth-child(1) .MuiCollapse-container:nth-child(3) .collapsed_container .underlag:first";

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
    cy.wait(1000);
    cy.startDesktop();

    // Check all kartlag is used and arter-fredete layer exists
    cy.contains("Kartlag");
    cy.contains("Gruppert på tema");
    cy.contains("Arter - fredete");
    cy.contains("Miljødirektoratet");
    cy.get(collapsePath1).should("not.exist");
    cy.url().should("not.include", "layers=");

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
    cy.url().should("include", "layers=222");

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
    cy.url().should("include", "layers=222,223");

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
    cy.url().should("not.include", "layers=");

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
    cy.url().should("include", "layers=222");

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
    cy.url().should("include", "layers=222,223");

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
    cy.url().should("include", "layers=222,223");

    // Check layers are visible
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
    cy.url().should("include", "layers=222,223,38");

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
    cy.url().should("include", "layers=222,223,38,43");

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
    cy.url().should("include", "layers=222,223,38,43,29,39,40,41");

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
    cy.url().should("include", "layers=222,223");

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
    cy.url().should("include", "layers=222,223,29,38,39,40,41,42,43");

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
    cy.url().should("include", "layers=222,223,38,39,40,41,42");

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

  it("Show tiles for a sublayer in details and change opacity of all sublayers", () => {
    // Deactivate all layers
    cy.get(allPath1).click();
    cy.get(allPath1).should("not.be.checked");
    cy.get(switchPath1A).should("not.be.checked");
    cy.get(switchPath1B).should("not.be.checked");
    cy.get(badgePath1).should("have.class", "MuiBadge-invisible");
    cy.get(allPath2).click();
    cy.get(allPath2).should("be.checked");
    cy.get(allPath2).click();
    cy.get(allPath2).should("not.be.checked");
    cy.get(switchPath2A).should("not.be.checked");
    cy.get(switchPath2B).should("not.be.checked");
    cy.get(switchPath2C).should("not.be.checked");
    cy.get(switchPath2D).should("not.be.checked");
    cy.get(switchPath2E).should("not.be.checked");
    cy.get(switchPath2F).should("not.be.checked");
    cy.get(badgePath2).should("have.class", "MuiBadge-invisible");
    cy.url().should("include", "?favorites=false");

    // Check only map layers are visible
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 2);

    // Go to Fredete arter - områder details
    cy.get(".details-content-wrapper").should("not.exist");
    cy.get(sublayerPath1A).click();
    cy.get(".layer-details-div").should("be.visible");
    cy.get(".layer-details-div").contains("Detaljert info om lag");
    cy.get(".details-content-wrapper").should("be.visible");
    cy.get(".details-content-wrapper").contains("Arter - fredete");
    cy.get(".details-content-wrapper .MuiBadge-badge").should(
      "have.class",
      "MuiBadge-invisible"
    );
    cy.get(".details-content-wrapper").contains("Fredete arter - områder");

    // Activate sublayer
    cy.get(".details-content-wrapper .MuiSlider-thumb").should(
      "have.class",
      "Mui-disabled"
    );
    cy.get(".details-content-wrapper #sublayer-details-list input").should(
      "not.be.checked"
    );
    cy.get(".details-content-wrapper #sublayer-details-list input").click();
    cy.get(".details-content-wrapper #sublayer-details-list input").should(
      "be.checked"
    );
    cy.get(".details-content-wrapper .MuiSlider-thumb").should(
      "not.have.class",
      "Mui-disabled"
    );
    cy.url().should("include", "?layers=222&favorites=false");

    // Check new layer visible
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 3);

    // Change opacity with slider
    cy.get(".leaflet-container .leaflet-layer:nth-child(3)").should(
      "have.attr",
      "style",
      "z-index: 1; opacity: 0.8;"
    );
    cy.get(".details-content-wrapper .opacity-slider-wrapper .MuiSlider-thumb")
      .trigger("mousedown")
      .trigger("mousemove", { clientX: 1698, clientY: 500 })
      .trigger("mouseup");
    cy.get(".leaflet-container .leaflet-layer:nth-child(3)").should(
      "have.attr",
      "style",
      "z-index: 1; opacity: 0.4;"
    );

    // Go back to kartlag
    cy.get("#details-title-wrapper").click();
    cy.get(".layer-details-div").should("not.exist");
    cy.get(badgePath1).should("contain", "1");
  });

  it("Show tiles for a layer in details and change opacity", () => {
    // Go to all sublayers detail of Arter - fredete
    cy.get(".details-content-wrapper").should("not.exist");
    cy.get(layerAllPath1).click();
    cy.get(".layer-details-div").should("be.visible");
    cy.get(".layer-details-div").contains("Detaljert info om lag");
    cy.get(".details-content-wrapper").should("be.visible");
    cy.get(".details-content-wrapper").contains("Arter - fredete");
    cy.get(".details-content-wrapper .MuiBadge-badge").should("contain", "1");
    cy.get(".details-content-wrapper").contains("Alle kategorier");

    // Activate layer
    cy.get(".details-content-wrapper .MuiSlider-thumb").should(
      "have.class",
      "Mui-disabled"
    );
    cy.get(".details-content-wrapper #sublayer-details-list input").should(
      "not.be.checked"
    );
    cy.get(".details-content-wrapper #sublayer-details-list input").click();
    cy.get(".details-content-wrapper #sublayer-details-list input").should(
      "be.checked"
    );
    cy.get(".details-content-wrapper .MuiSlider-thumb").should(
      "not.have.class",
      "Mui-disabled"
    );
    cy.url().should("include", "?layers=222,223&favorites=false");

    // Check new layer visible
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 4);

    // Change opacity with slider
    cy.get(".leaflet-container .leaflet-layer:nth-child(3)").should(
      "have.attr",
      "style",
      "z-index: 1; opacity: 0.4;"
    );
    cy.get(".leaflet-container .leaflet-layer:nth-child(4)").should(
      "have.attr",
      "style",
      "z-index: 1; opacity: 0.8;"
    );
    cy.get(".details-content-wrapper .opacity-slider-wrapper .MuiSlider-thumb")
      .trigger("mousedown")
      .trigger("mousemove", { clientX: 1670, clientY: 500 })
      .trigger("mouseup");
    cy.get(".leaflet-container .leaflet-layer:nth-child(3)").should(
      "have.attr",
      "style",
      "z-index: 1; opacity: 0.3;"
    );
    cy.get(".leaflet-container .leaflet-layer:nth-child(4)").should(
      "have.attr",
      "style",
      "z-index: 1; opacity: 0.3;"
    );

    // Go back to kartlag
    cy.get("#details-title-wrapper").click();
    cy.get(".layer-details-div").should("not.exist");
    cy.get(badgePath1).should("contain", "2");
  });
});
