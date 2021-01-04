/// <reference types="cypress" />

describe("Save and Open Polygon Tests", () => {
  before(() => {
    // Delete indexed DB
    indexedDB.deleteDatabase("GrunnkartDB");
  });

  it("Chech ther are no polygons saved", () => {
    cy.startDesktop();

    // Open polygon tool and verify self-drawn polygon is selected
    cy.get('button[title="Polygon tool"]').click();
    cy.contains("Mitt Polygon");
    cy.contains("Definer polygon fra grenser");
    cy.get("#infobox-radio-label-none >>> input").should("be.checked");
    cy.get("#polygon-options-listitem").click();

    // Open saved polygons menu
    cy.get('span[title="Åpne lagret polygon"] > button').click();
    cy.get(".saved-polygon-modal-wrapper").should("be.visible");
    cy.contains("Åpne lagret polygon");
    cy.contains("Ingen polygon lagret");

    // Close menu
    cy.get(".polygon-modal-button").click();
    cy.get(".saved-polygon-modal-wrapper").should("not.exist");
  });

  it("Draw First Polygon Manually", () => {
    // Zoom in map
    cy.get('a[title="Zoom in"]').click();
    cy.wait(150);

    // Polygon should not be visible
    cy.get("path.leaflet-interactive").should("not.exist");
    cy.contains("Arealrapport (polygon ikke definert)");

    // Draw polygon manually
    cy.get(".leaflet-container").click(650, 650);
    cy.get(".leaflet-marker-icon.inactive_point").should("be.visible");
    cy.get(".leaflet-container").click(670, 655);
    cy.contains("10.83 km");
    cy.get(".leaflet-container").click(665, 670);
    cy.contains("19.15 km");
    cy.get(".leaflet-container").click(640, 675);
    cy.contains("32.59 km");
    cy.get('span[title="Ferdig"] > button').click();

    // Check polygon and its size are shown
    cy.get("path.leaflet-interactive").should("not.be.null");
    cy.contains("Omkrets / perimeter");
    cy.contains("46.75 km");
    cy.contains("Areal");
    cy.contains("124.54 km²");
  });

  it("Save First Polygon", () => {
    // Open save menu
    cy.get('span[title="Lagre polygon"] > button').click();
    cy.get(".polygon-modal-wrapper").should("be.visible");
    cy.contains("Lagre polygon");
    cy.contains("Navn");

    // Add name and save
    cy.get("#polygon-name-input").type("Test polygon 1");
    cy.get("button#confirm-save-polygon").click();
    cy.get(".polygon-modal-wrapper").should("not.exist");

    // Success message should be visible
    cy.get(".polygon-action-success").should("be.visible");
    cy.contains("Polygon lagret");

    // Success message should disappear after 2.5 seconds
    cy.wait(2500);
    cy.get(".polygon-action-success").should("not.exist");
  });

  it("Upload Second Polygon", () => {
    // Upload polygon
    cy.get('span[title="Last opp polygon"] > button').click();
    cy.fixture("test_02.geojson").then(fileContent => {
      cy.get('input[type="file"]').attachFile({
        fileContent: fileContent.toString(),
        fileName: "test_02.geojson",
        mimeType: "application/json"
      });
    });

    // Check polygon and its size are shown
    cy.wait(2000);
    cy.get("path.leaflet-interactive").should("not.be.null");
    cy.contains("Omkrets / perimeter");
    cy.contains("42.77 km");
    cy.contains("Areal");
    cy.contains("12.474 km²");
  });

  it("Save Second Polygon", () => {
    // Open save menu
    cy.get("button#save-polygon-button").click();
    cy.get(".polygon-modal-wrapper").should("be.visible");
    cy.contains("Lagre polygon");
    cy.contains("Navn");

    // Add name and save
    cy.get("#polygon-name-input").type("Test polygon 2");
    cy.get("button#confirm-save-polygon").click();
    cy.get(".polygon-modal-wrapper").should("not.exist");

    // Success message should be visible
    cy.get(".polygon-action-success").should("be.visible");
    cy.contains("Polygon lagret");

    // Success message should disappear after 2.5 seconds
    cy.wait(2500);
    cy.get(".polygon-action-success").should("not.exist");
  });

  it("Delete polygon from map", () => {
    // Delete polygon
    cy.get('span[title="Fjern"] > button').click();

    // Polygon should not be visible
    cy.get("path.leaflet-interactive").should("not.exist");
    cy.contains("Arealrapport (polygon ikke definert)");
  });

  it("Open Saved Polygon", () => {
    // Open saved polygons menu
    cy.get("button#open-polygon-button").click();
    cy.get(".saved-polygon-modal-wrapper").should("be.visible");
    cy.contains("Åpne lagret polygon");
    cy.contains("Test polygon 1");
    cy.contains("Test polygon 2");

    // Select Test Polygon 1
    cy.get(".saved-polygons-listitem-wrapper:last #saved-polygons-row").click();

    // Check polygon and its size are shown
    cy.wait(2000);
    cy.get("path.leaflet-interactive").should("not.be.null");
    cy.contains("Omkrets / perimeter");
    cy.contains("46.75 km");
    cy.contains("Areal");
    cy.contains("24.54 km²");
  });

  it("Edit Saved Polygon Name", () => {
    // Open saved polygons menu
    cy.get("button#open-polygon-button").click();
    cy.get(".saved-polygon-modal-wrapper").should("be.visible");
    cy.contains("Åpne lagret polygon");
    cy.contains("Test polygon 1");
    cy.contains("Test polygon 2");

    // Select Test Polygon 2 and update name
    cy.get(
      ".saved-polygons-listitem-wrapper:first #edit-polygon-button"
    ).click();
    cy.get("#polygon-edit-name-input").type(" updated");
    cy.get(
      ".saved-polygons-listitem-wrapper:first #save-edited-polygon-button"
    ).click();

    // Close menu
    cy.get(".polygon-modal-button").click();
    cy.get(".saved-polygon-modal-wrapper").should("not.exist");
  });

  it("Delete Saved Polygon", () => {
    // Open saved polygons menu
    cy.get("button#open-polygon-button").click();
    cy.get(".saved-polygon-modal-wrapper").should("be.visible");
    cy.contains("Åpne lagret polygon");
    cy.contains("Test polygon 1");
    cy.contains("Test polygon 2 updated");
    cy.get(".saved-polygons-content")
      .find(".saved-polygons-listitem-wrapper")
      .should("have.length", 2);

    // Delete Test Polygon 2 updated
    cy.get(
      ".saved-polygons-listitem-wrapper:first #delete-polygon-button"
    ).click();

    // Delete modal visible
    cy.get(".polygon-delete-modal-wrapper").should("be.visible");
    cy.contains("Slette polygon");
    cy.contains('Vil du slette "Test polygon 2 updated"?');
    cy.get("#confirm-delete-polygon").click();
    cy.get(".polygon-delete-modal-wrapper").should("not.exist");

    // Close menu
    cy.get(".polygon-modal-button").click();
    cy.get(".saved-polygon-modal-wrapper").should("not.exist");
  });

  it("Check Saved Polygon Has Been Deleted", () => {
    // Open saved polygons menu
    cy.get("button#open-polygon-button").click();
    cy.get(".saved-polygon-modal-wrapper").should("be.visible");

    // Check that polygon is not in menu
    cy.contains("Åpne lagret polygon");
    cy.contains("Test polygon 1");
    cy.get(".saved-polygons-content")
      .find(".saved-polygons-listitem-wrapper")
      .should("have.length", 1);
  });
});
