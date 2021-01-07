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
  });

  it("Show tiles for favorite layers", () => {
    // Check only map layers are visible
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 2);

    // Activate sublayer Fredete arter - punkt
    cy.get(allPath1).click();
    cy.get(allPath1).should("be.checked");
    cy.get(switchPath1A).should("be.checked");
    cy.get(switchPath1B).should("be.checked");
    cy.get(badgePath1).should("contain", "2");

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

    // Check new layers are visible
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 5);
  });

  it("Switch to all layers from kartlag", () => {
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

    // Check new layers are visible
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 3);
  });

  it("Switch to favorite layers from kartlag", () => {
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

    // Check new layers are visible
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 5);
  });

  it("Switch to all layers from drawer menu", () => {
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

    // Check new layers are visible
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 3);
  });

  it("Switch to favorite layers from drawer menu", () => {
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

    // Check new layers are visible
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 5);
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

    // Check only map layers layers are visible
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 2);

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

    // Check new layers are visible
    cy.get(".leaflet-container")
      .find(".leaflet-layer ")
      .should("have.length", 3);
  });
});
