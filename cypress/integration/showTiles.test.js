/// <reference types="cypress" />

describe("Show Tiles Tests", () => {
  before(() => {
    // Delete indexed DB
    indexedDB.deleteDatabase("GrunnkartDB");
  });

  it("Show cached tiles", () => {
    cy.startDesktop();

    // Open polygon tool and verify self-drawn polygon is selected
    cy.get('button[title="Polygon tool"]').click();
    cy.contains("Kartlag");
    cy.contains("Gruppert på tema");
    cy.contains("Arter - fredete");
    cy.contains("Miljødirektoratet");
    cy.get("#list-element-sublayer").should("not.exist");

    // Expand
    cy.get("#layer-list-item").click();
    cy.contains("Fredete arter - områder");
    cy.contains("Fredete arter - punkt");
  });
});
