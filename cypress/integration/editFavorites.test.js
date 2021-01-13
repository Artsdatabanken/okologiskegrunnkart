/// <reference types="cypress" />

// Kartlag top element
const checkboxKartlag = "#settings-kartlag-checkbox";

// Arealressurs
const layer1 =
  "#settings-layers-top-item .MuiCollapse-container .MuiTreeItem-root:nth-child(1)";
const checkboxLayer1 =
  "#settings-layers-top-item .MuiCollapse-container .MuiTreeItem-root:nth-child(1) #settings-layers-checkbox";
const checkboxSublayer1A =
  "#settings-layers-top-item .MuiCollapse-container .MuiTreeItem-root:nth-child(1) .MuiCollapse-container .MuiTreeItem-root:nth-child(1) #settings-sublayers-checkbox";
const checkboxSublayer1B =
  "#settings-layers-top-item .MuiCollapse-container .MuiTreeItem-root:nth-child(1) .MuiCollapse-container .MuiTreeItem-root:nth-child(2) #settings-sublayers-checkbox";
const checkboxSublayer1C =
  "#settings-layers-top-item .MuiCollapse-container .MuiTreeItem-root:nth-child(1) .MuiCollapse-container .MuiTreeItem-root:nth-child(3) #settings-sublayers-checkbox";
const layerKartlag1 =
  "#layers-list-wrapper .sorted-layers-subheaders:nth-child(2) #layer-list-item:nth-child(2)";

// Arter - fredete
const checkboxLayer2 =
  "#settings-layers-top-item .MuiCollapse-container .MuiTreeItem-root:nth-child(2) #settings-layers-checkbox";

// Arter - Rødlista
const checkboxLayer3 =
  "#settings-layers-top-item .MuiCollapse-container .MuiTreeItem-root:nth-child(5) #settings-layers-checkbox";

// Naturtyper - DN Håndbok 13
const checkboxLayer4 =
  "#settings-layers-top-item .MuiCollapse-container .MuiTreeItem-root:nth-child(35) #settings-layers-checkbox";

describe("Edit Favorites Tests", () => {
  before(() => {
    // Delete indexed DB
    indexedDB.deleteDatabase("GrunnkartDB");
  });

  it("Select some favorite layers and save", () => {
    cy.wait(1000);
    cy.startDesktop();

    // Check all layers are visible
    cy.get(".kartlag_fanen").contains("Kartlag");
    cy.get("#layers-list-wrapper")
      .find(".sorted-layers-subheaders")
      .should("have.length", 10);
    cy.get(".kartlag_fanen").contains("Arter");
    cy.get(".kartlag_fanen").contains("Arealressurs");
    cy.get(".kartlag_fanen").contains("Naturtyper");
    cy.get(".kartlag_fanen").contains("Skog");
    cy.get(".kartlag_fanen").contains("Marint");
    cy.get(".kartlag_fanen").contains("Ferskvann");
    cy.get(".kartlag_fanen").contains("Landskap");
    cy.get(".kartlag_fanen").contains("Geologi");
    cy.get(".kartlag_fanen").contains("Miljøvariabel");
    cy.get(".kartlag_fanen").contains("Administrative støttekart");
    cy.get(".kartlag_fanen").contains("Arealressurs: AR5");
    cy.get(".kartlag_fanen").contains("Arter - fredete");
    cy.get(".kartlag_fanen").contains("Arter - Rødlista");
    cy.get(".kartlag_fanen").contains("Naturtyper - DN Håndbok 13");
    cy.get(".kartlag_fanen").contains("Livsmiljøer");
    cy.get(".kartlag_fanen").contains("Flomsoner");

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
    cy.get(layer1).click();
    cy.get(".settings-layers-wrapper").contains("Arealressurs: AR5 Arealtype");
    cy.get(".settings-layers-wrapper").contains("Jordbruksareal");
    cy.get(".settings-layers-wrapper").contains("Treslag");

    // Select 3 layers
    cy.get(checkboxKartlag).should("not.be.checked");
    cy.get(checkboxKartlag).should("have.attr", "data-indeterminate", "false");
    cy.get(checkboxLayer1).should("not.be.checked");
    cy.get(checkboxSublayer1A).should("not.be.checked");
    cy.get(checkboxSublayer1B).should("not.be.checked");
    cy.get(checkboxSublayer1C).should("not.be.checked");
    cy.get(checkboxLayer2).should("not.be.checked");
    cy.get(checkboxLayer4).should("not.be.checked");
    cy.get(checkboxLayer4).should("not.be.checked");
    cy.get(checkboxLayer1).click();
    cy.get(checkboxLayer3).click();
    cy.get(checkboxLayer4).click();
    cy.get(checkboxKartlag).should("be.checked");
    cy.get(checkboxLayer1).should("be.checked");
    cy.get(checkboxSublayer1A).should("be.checked");
    cy.get(checkboxSublayer1B).should("be.checked");
    cy.get(checkboxSublayer1C).should("be.checked");
    cy.get(checkboxLayer2).should("not.be.checked");
    cy.get(checkboxLayer3).should("be.checked");
    cy.get(checkboxLayer4).should("be.checked");

    // Verify no checkbox has data-indeterminate, only kartlag top element
    cy.get(checkboxKartlag).should("have.attr", "data-indeterminate", "true");
    cy.get(checkboxLayer1).should("have.attr", "data-indeterminate", "false");
    cy.get(checkboxSublayer1A).should(
      "have.attr",
      "data-indeterminate",
      "false"
    );
    cy.get(checkboxSublayer1B).should(
      "have.attr",
      "data-indeterminate",
      "false"
    );
    cy.get(checkboxSublayer1C).should(
      "have.attr",
      "data-indeterminate",
      "false"
    );
    cy.get(checkboxLayer2).should("have.attr", "data-indeterminate", "false");
    cy.get(checkboxLayer3).should("have.attr", "data-indeterminate", "false");
    cy.get(checkboxLayer4).should("have.attr", "data-indeterminate", "false");

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

    // Verify all is saved correctly
    cy.get(".help_button").click();
    cy.get("#settings-drawer").contains("Endre favorittkartlag");
    cy.get("#drawer-menuitem-edit-kartlag").click();
    cy.get(".settings-layers-wrapper").should("be.visible");
    cy.get(".settings-layers-wrapper").contains("Kartlag");
    cy.get(".settings-layers-list-item-wrapper").click();
    cy.get(layer1).click();
    cy.get(checkboxLayer1).should("be.checked");
    cy.get(checkboxSublayer1A).should("be.checked");
    cy.get(checkboxSublayer1B).should("be.checked");
    cy.get(checkboxSublayer1C).should("be.checked");
    cy.get(checkboxLayer2).should("not.be.checked");
    cy.get(checkboxLayer3).should("be.checked");
    cy.get(checkboxLayer4).should("be.checked");
    cy.get("#settings-layers-cancel-button").click();
    cy.get(".settings-layers-wrapper", { timeout: 10000 }).should("not.exist");
  });

  it("Select some favorite layers and cancel", () => {
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
    cy.get(layer1).click();
    cy.get(".settings-layers-wrapper").contains("Arealressurs: AR5 Arealtype");
    cy.get(".settings-layers-wrapper").contains("Jordbruksareal");
    cy.get(".settings-layers-wrapper").contains("Treslag");

    // Change 2 layers
    cy.get(checkboxLayer2).click();
    cy.get(checkboxLayer3).click();
    cy.get(checkboxLayer1).should("be.checked");
    cy.get(checkboxSublayer1A).should("be.checked");
    cy.get(checkboxSublayer1B).should("be.checked");
    cy.get(checkboxSublayer1C).should("be.checked");
    cy.get(checkboxLayer2).should("be.checked");
    cy.get(checkboxLayer3).should("not.be.checked");
    cy.get(checkboxLayer4).should("be.checked");

    // Close and get back to map
    cy.get("#settings-layers-cancel-button").click();
    cy.get(".settings-layers-wrapper", { timeout: 10000 }).should("not.exist");

    // Check favorites are being used
    cy.get(".kartlag_fanen").contains("Favorittkartlag");
    cy.get("#layers-list-wrapper")
      .find(".sorted-layers-subheaders")
      .should("have.length", 3);
    cy.get(".kartlag_fanen").contains("Arealressurs: AR5");
    cy.get(".kartlag_fanen").contains("Arter - Rødlista");
    cy.get(".kartlag_fanen").contains("Naturtyper - DN Håndbok 13");

    // Verify all is saved correctly
    cy.get(".help_button").click();
    cy.get("#settings-drawer").contains("Endre favorittkartlag");
    cy.get("#drawer-menuitem-edit-kartlag").click();
    cy.get(".settings-layers-wrapper").should("be.visible");
    cy.get(".settings-layers-wrapper").contains("Kartlag");
    cy.get(".settings-layers-list-item-wrapper").click();
    cy.get(layer1).click();
    cy.get(checkboxLayer1).should("be.checked");
    cy.get(checkboxSublayer1A).should("be.checked");
    cy.get(checkboxSublayer1B).should("be.checked");
    cy.get(checkboxSublayer1C).should("be.checked");
    cy.get(checkboxLayer2).should("not.be.checked");
    cy.get(checkboxLayer3).should("be.checked");
    cy.get(checkboxLayer4).should("be.checked");
    cy.get("#settings-layers-cancel-button").click();
    cy.get(".settings-layers-wrapper", { timeout: 10000 }).should("not.exist");
  });

  it("Select some favorite sublayers and save", () => {
    // Verify all sublayers in Arealressurs are visible
    cy.get(".kartlag_fanen").contains("Favorittkartlag");
    cy.get("#layers-list-wrapper")
      .find(".sorted-layers-subheaders")
      .should("have.length", 3);
    cy.get(".kartlag_fanen").contains("Arealressurs: AR5");
    cy.get(".kartlag_fanen").contains("Arter - Rødlista");
    cy.get(".kartlag_fanen").contains("Naturtyper - DN Håndbok 13");
    cy.get(layerKartlag1).click();
    cy.get(".kartlag_fanen").contains("Arealressurs: AR5 Arealtype");
    cy.get(".kartlag_fanen").contains("Jordbruksareal");
    cy.get(".kartlag_fanen").contains("Treslag");

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
    cy.get(layer1).click();
    cy.get(".settings-layers-wrapper").contains("Arealressurs: AR5 Arealtype");
    cy.get(".settings-layers-wrapper").contains("Jordbruksareal");
    cy.get(".settings-layers-wrapper").contains("Treslag");

    // Select 2 sublayers by deselecting one sublayer
    cy.get(checkboxLayer1).should("have.attr", "data-indeterminate", "false");
    cy.get(checkboxSublayer1B).click();
    cy.get(checkboxLayer1).should("be.checked");
    cy.get(checkboxLayer1).should("have.attr", "data-indeterminate", "true");
    cy.get(checkboxSublayer1A).should("be.checked");
    cy.get(checkboxSublayer1B).should("not.be.checked");
    cy.get(checkboxSublayer1C).should("be.checked");
    cy.get(checkboxLayer2).should("not.be.checked");
    cy.get(checkboxLayer3).should("be.checked");
    cy.get(checkboxLayer4).should("be.checked");

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
    cy.get(".kartlag_fanen").contains("Arealressurs: AR5 Arealtype");
    cy.get(".kartlag_fanen").should("not.contain", "Jordbruksareal");
    cy.get(".kartlag_fanen").contains("Treslag");

    // Verify all is saved correctly
    cy.get(".help_button").click();
    cy.get("#settings-drawer").contains("Endre favorittkartlag");
    cy.get("#drawer-menuitem-edit-kartlag").click();
    cy.get(".settings-layers-wrapper").should("be.visible");
    cy.get(".settings-layers-wrapper").contains("Kartlag");
    cy.get(".settings-layers-list-item-wrapper").click();
    cy.get(layer1).click();
    cy.get(checkboxLayer1).should("be.checked");
    cy.get(checkboxLayer1).should("have.attr", "data-indeterminate", "true");
    cy.get(checkboxSublayer1A).should("be.checked");
    cy.get(checkboxSublayer1B).should("not.be.checked");
    cy.get(checkboxSublayer1C).should("be.checked");
    cy.get(checkboxLayer2).should("not.be.checked");
    cy.get(checkboxLayer3).should("be.checked");
    cy.get(checkboxLayer4).should("be.checked");
    cy.get("#settings-layers-cancel-button").click();
    cy.get(".settings-layers-wrapper", { timeout: 10000 }).should("not.exist");
  });

  it("Select some favorite sublayers and cancel", () => {
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
    cy.get(layer1).click();
    cy.get(".settings-layers-wrapper").contains("Arealressurs: AR5 Arealtype");
    cy.get(".settings-layers-wrapper").contains("Jordbruksareal");
    cy.get(".settings-layers-wrapper").contains("Treslag");

    // Deselect all sublayers in Arealressurs
    cy.get(checkboxSublayer1A).click();
    cy.get(checkboxSublayer1C).click();
    cy.get(checkboxLayer1).should("not.be.checked");
    cy.get(checkboxLayer1).should("have.attr", "data-indeterminate", "false");
    cy.get(checkboxSublayer1A).should("not.be.checked");
    cy.get(checkboxSublayer1B).should("not.be.checked");
    cy.get(checkboxSublayer1C).should("not.be.checked");
    cy.get(checkboxLayer2).should("not.be.checked");
    cy.get(checkboxLayer3).should("be.checked");
    cy.get(checkboxLayer4).should("be.checked");

    // Close and get back to map
    cy.get("#settings-layers-cancel-button").click();
    cy.get(".settings-layers-wrapper", { timeout: 10000 }).should("not.exist");

    // Check favorites are being used
    cy.get(".kartlag_fanen").contains("Favorittkartlag");
    cy.get("#layers-list-wrapper")
      .find(".sorted-layers-subheaders")
      .should("have.length", 3);
    cy.get(".kartlag_fanen").contains("Arealressurs: AR5");
    cy.get(".kartlag_fanen").contains("Arter - Rødlista");
    cy.get(".kartlag_fanen").contains("Naturtyper - DN Håndbok 13");
    cy.get(".kartlag_fanen").contains("Arealressurs: AR5 Arealtype");
    cy.get(".kartlag_fanen").should("not.contain", "Jordbruksareal");
    cy.get(".kartlag_fanen").contains("Treslag");

    // Verify all is saved correctly
    cy.get(".help_button").click();
    cy.get("#settings-drawer").contains("Endre favorittkartlag");
    cy.get("#drawer-menuitem-edit-kartlag").click();
    cy.get(".settings-layers-wrapper").should("be.visible");
    cy.get(".settings-layers-wrapper").contains("Kartlag");
    cy.get(".settings-layers-list-item-wrapper").click();
    cy.get(layer1).click();
    cy.get(checkboxLayer1).should("be.checked");
    cy.get(checkboxLayer1).should("have.attr", "data-indeterminate", "true");
    cy.get(checkboxSublayer1A).should("be.checked");
    cy.get(checkboxSublayer1B).should("not.be.checked");
    cy.get(checkboxSublayer1C).should("be.checked");
    cy.get(checkboxLayer2).should("not.be.checked");
    cy.get(checkboxLayer3).should("be.checked");
    cy.get(checkboxLayer4).should("be.checked");
    cy.get("#settings-layers-cancel-button").click();
    cy.get(".settings-layers-wrapper", { timeout: 10000 }).should("not.exist");
  });

  it("Select again favorite layers and save. This should change the status of the sublayers too", () => {
    // Verify status of layers and sublayers in kartlag
    cy.get(".kartlag_fanen").contains("Favorittkartlag");
    cy.get("#layers-list-wrapper")
      .find(".sorted-layers-subheaders")
      .should("have.length", 3);
    cy.get(".kartlag_fanen").contains("Arealressurs: AR5");
    cy.get(".kartlag_fanen").should("not.contain", "Arter - fredete");
    cy.get(".kartlag_fanen").contains("Arter - Rødlista");
    cy.get(".kartlag_fanen").contains("Naturtyper - DN Håndbok 13");
    cy.get(".kartlag_fanen").contains("Arealressurs: AR5 Arealtype");
    cy.get(".kartlag_fanen").should("not.contain", "Jordbruksareal");
    cy.get(".kartlag_fanen").contains("Treslag");

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
    cy.get(layer1).click();
    cy.get(".settings-layers-wrapper").contains("Arealressurs: AR5 Arealtype");
    cy.get(".settings-layers-wrapper").contains("Jordbruksareal");
    cy.get(".settings-layers-wrapper").contains("Treslag");

    // Deselect Arealressurs and selected Arter - fredete
    cy.get(checkboxLayer1).should("be.checked");
    cy.get(checkboxLayer1).should("have.attr", "data-indeterminate", "true");
    cy.get(checkboxLayer2).should("not.be.checked");
    cy.get(checkboxLayer2).should("have.attr", "data-indeterminate", "false");
    cy.get(checkboxLayer1).click();
    cy.get(checkboxLayer2).click();
    cy.get(checkboxLayer1).should("not.be.checked");
    cy.get(checkboxLayer1).should("have.attr", "data-indeterminate", "false");
    cy.get(checkboxSublayer1A).should("not.be.checked");
    cy.get(checkboxSublayer1B).should("not.be.checked");
    cy.get(checkboxSublayer1C).should("not.be.checked");
    cy.get(checkboxLayer2).should("be.checked");
    cy.get(checkboxLayer3).should("be.checked");
    cy.get(checkboxLayer4).should("be.checked");

    // Save and get back to map
    cy.get("#settings-layers-save-button").click();
    cy.get(".settings-layers-wrapper", { timeout: 10000 }).should("not.exist");

    // Check favorites are being used
    cy.get(".kartlag_fanen").contains("Favorittkartlag");
    cy.get("#layers-list-wrapper")
      .find(".sorted-layers-subheaders")
      .should("have.length", 2);
    cy.get(".kartlag_fanen").should("not.contain", "Arealressurs: AR5");
    cy.get(".kartlag_fanen").contains("Arter - fredete");
    cy.get(".kartlag_fanen").contains("Arter - Rødlista");
    cy.get(".kartlag_fanen").contains("Naturtyper - DN Håndbok 13");
    cy.get(".kartlag_fanen").should(
      "not.contain",
      "Arealressurs: AR5 Arealtype"
    );
    cy.get(".kartlag_fanen").should("not.contain", "Jordbruksareal");
    cy.get(".kartlag_fanen").should("not.contain", "Treslag");

    // Verify all is saved correctly
    cy.get(".help_button").click();
    cy.get("#settings-drawer").contains("Endre favorittkartlag");
    cy.get("#drawer-menuitem-edit-kartlag").click();
    cy.get(".settings-layers-wrapper").should("be.visible");
    cy.get(".settings-layers-wrapper").contains("Kartlag");
    cy.get(".settings-layers-list-item-wrapper").click();
    cy.get(layer1).click();
    cy.get(checkboxLayer1).should("not.be.checked");
    cy.get(checkboxLayer1).should("have.attr", "data-indeterminate", "false");
    cy.get(checkboxSublayer1A).should("not.be.checked");
    cy.get(checkboxSublayer1B).should("not.be.checked");
    cy.get(checkboxSublayer1C).should("not.be.checked");
    cy.get(checkboxLayer2).should("be.checked");
    cy.get(checkboxLayer3).should("be.checked");
    cy.get(checkboxLayer4).should("be.checked");
    cy.get("#settings-layers-cancel-button").click();
    cy.get(".settings-layers-wrapper", { timeout: 10000 }).should("not.exist");
  });

  it("Remove all layers from favorites", () => {
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
    cy.get(layer1).click();
    cy.get(".settings-layers-wrapper").contains("Arealressurs: AR5 Arealtype");
    cy.get(".settings-layers-wrapper").contains("Jordbruksareal");
    cy.get(".settings-layers-wrapper").contains("Treslag");

    // Deselect Arealressurs and selected Arter - fredete
    cy.get(checkboxKartlag).should("be.checked");
    cy.get(checkboxKartlag).should("have.attr", "data-indeterminate", "true");
    cy.get(checkboxKartlag).click();
    cy.get(checkboxKartlag).should("not.be.checked");
    cy.get(checkboxKartlag).should("have.attr", "data-indeterminate", "false");
    cy.get(checkboxLayer1).should("not.be.checked");
    cy.get(checkboxSublayer1A).should("not.be.checked");
    cy.get(checkboxSublayer1B).should("not.be.checked");
    cy.get(checkboxSublayer1C).should("not.be.checked");
    cy.get(checkboxLayer2).should("not.be.checked");
    cy.get(checkboxLayer3).should("not.be.checked");
    cy.get(checkboxLayer4).should("not.be.checked");

    // Save and get back to map
    cy.get("#settings-layers-save-button").click();
    cy.get(".settings-layers-wrapper", { timeout: 10000 }).should("not.exist");

    // Check favorites are being used
    cy.get(".kartlag_fanen").contains("Favorittkartlag");
    cy.get(".kartlag_fanen").should("not.contain", "Arealressurs: AR5");
    cy.get(".kartlag_fanen").should("not.contain", "Arter - fredete");
    cy.get(".kartlag_fanen").should("not.contain", "Arter - Rødlista");
    cy.get(".kartlag_fanen").should(
      "not.contain",
      "Naturtyper - DN Håndbok 13"
    );
    cy.get(".kartlag_fanen").contains("Ingen favorittkartlag");
    cy.get(".kartlag_fanen").contains(
      "Editer favoritter i hovedmenyen ved søkefeltet"
    );

    // Verify all is saved correctly
    cy.get(".help_button").click();
    cy.get("#settings-drawer").contains("Endre favorittkartlag");
    cy.get("#drawer-menuitem-edit-kartlag").click();
    cy.get(".settings-layers-wrapper").should("be.visible");
    cy.get(".settings-layers-wrapper").contains("Kartlag");
    cy.get(".settings-layers-list-item-wrapper").click();
    cy.get(layer1).click();
    cy.get(checkboxKartlag).should("not.be.checked");
    cy.get(checkboxKartlag).should("have.attr", "data-indeterminate", "false");
    cy.get(checkboxLayer1).should("not.be.checked");
    cy.get(checkboxSublayer1A).should("not.be.checked");
    cy.get(checkboxSublayer1B).should("not.be.checked");
    cy.get(checkboxSublayer1C).should("not.be.checked");
    cy.get(checkboxLayer2).should("not.be.checked");
    cy.get(checkboxLayer3).should("not.be.checked");
    cy.get(checkboxLayer4).should("not.be.checked");
    cy.get("#settings-layers-cancel-button").click();
    cy.get(".settings-layers-wrapper", { timeout: 10000 }).should("not.exist");
  });

  it("Add all layers to favorites", () => {
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
    cy.get(layer1).click();
    cy.get(".settings-layers-wrapper").contains("Arealressurs: AR5 Arealtype");
    cy.get(".settings-layers-wrapper").contains("Jordbruksareal");
    cy.get(".settings-layers-wrapper").contains("Treslag");

    // Select all layers
    cy.get(checkboxKartlag).click();
    cy.get(checkboxKartlag).should("be.checked");
    cy.get(checkboxKartlag).should("have.attr", "data-indeterminate", "false");
    cy.get(checkboxLayer1).should("be.checked");
    cy.get(checkboxLayer1).should("have.attr", "data-indeterminate", "false");
    cy.get(checkboxSublayer1A).should("be.checked");
    cy.get(checkboxSublayer1B).should("be.checked");
    cy.get(checkboxSublayer1C).should("be.checked");
    cy.get(checkboxLayer2).should("be.checked");
    cy.get(checkboxLayer3).should("be.checked");
    cy.get(checkboxLayer4).should("be.checked");

    // Save and get back to map
    cy.get("#settings-layers-save-button").click();
    cy.get(".settings-layers-wrapper", { timeout: 20000 }).should("not.exist");

    // Check favorites are being used
    cy.get(".kartlag_fanen").contains("Favorittkartlag");
    cy.get("#layers-list-wrapper")
      .find(".sorted-layers-subheaders")
      .should("have.length", 10);
    cy.get(".kartlag_fanen").contains("Arter");
    cy.get(".kartlag_fanen").contains("Arealressurs");
    cy.get(".kartlag_fanen").contains("Naturtyper");
    cy.get(".kartlag_fanen").contains("Skog");
    cy.get(".kartlag_fanen").contains("Marint");
    cy.get(".kartlag_fanen").contains("Ferskvann");
    cy.get(".kartlag_fanen").contains("Landskap");
    cy.get(".kartlag_fanen").contains("Geologi");
    cy.get(".kartlag_fanen").contains("Miljøvariabel");
    cy.get(".kartlag_fanen").contains("Administrative støttekart");
    cy.get(".kartlag_fanen").contains("Arealressurs: AR5");
    cy.get(".kartlag_fanen").contains("Arter - fredete");
    cy.get(".kartlag_fanen").contains("Arter - Rødlista");
    cy.get(".kartlag_fanen").contains("Naturtyper - DN Håndbok 13");
    cy.get(".kartlag_fanen").contains("Livsmiljøer");
    cy.get(".kartlag_fanen").contains("Flomsoner");
    cy.get(layerKartlag1).click();
    cy.get(".kartlag_fanen").contains("Arealressurs: AR5 Arealtype");
    cy.get(".kartlag_fanen").contains("Jordbruksareal");
    cy.get(".kartlag_fanen").contains("Treslag");

    // Verify all is saved correctly
    cy.get(".help_button").click();
    cy.get("#settings-drawer").contains("Endre favorittkartlag");
    cy.get("#drawer-menuitem-edit-kartlag").click();
    cy.get(".settings-layers-wrapper").should("be.visible");
    cy.get(".settings-layers-wrapper").contains("Kartlag");
    cy.get(".settings-layers-list-item-wrapper").click();
    cy.get(layer1).click();
    cy.get(checkboxKartlag).should("be.checked");
    cy.get(checkboxKartlag).should("have.attr", "data-indeterminate", "false");
    cy.get(checkboxLayer1).should("be.checked");
    cy.get(checkboxLayer1).should("have.attr", "data-indeterminate", "false");
    cy.get(checkboxSublayer1A).should("be.checked");
    cy.get(checkboxSublayer1B).should("be.checked");
    cy.get(checkboxSublayer1C).should("be.checked");
    cy.get(checkboxLayer2).should("be.checked");
    cy.get(checkboxLayer3).should("be.checked");
    cy.get(checkboxLayer4).should("be.checked");
    cy.get("#settings-layers-cancel-button").click();
    cy.get(".settings-layers-wrapper", { timeout: 10000 }).should("not.exist");
  });
});
