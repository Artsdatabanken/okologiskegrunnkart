/// <reference types="cypress" />

// NOTE: due to the search APIs not being very stable, this test may fails randomly.
// It may require running it again without changes to double check.

describe("URL Update Tests", () => {
  before(() => {
    // Delete indexed DB
    indexedDB.deleteDatabase("GrunnkartDB");
  });

  it("Define favourites in URL", () => {
    cy.startDesktop();

    // Write search
    cy.visit(Cypress.env("baseurl") + "?favorites=false");

    // // Check search results
    // cy.get(".treffliste")
    //   .find(".searchbar_item")
    //   .should("have.length", 18);
    // cy.get(".treffliste").contains("Arter - fredete");
    // cy.get(".treffliste").contains("Arter - Rødlista");
    // cy.get(".treffliste .searchbar_item:first").contains("Kartlag");
    // cy.get(".treffliste .searchbar_item:first").contains("Arter");

    // // Delete search
    // cy.get(".searchbar .x").click();

    // // Write search
    // cy.get(".searchbar input").type("fredete arter");

    // // Check search results
    // cy.get(".treffliste")
    //   .find(".searchbar_item")
    //   .should("have.length", 3);
    // cy.get(".treffliste").contains("Arter - fredete");
    // cy.get(".treffliste").contains("Fredete arter - områder");
    // cy.get(".treffliste").contains("Fredete arter - punkt");
    // cy.get(".treffliste .searchbar_item:last").contains("Underlag");
    // cy.get(".treffliste .searchbar_item:last").contains("Arter");

    // // Delete search
    // cy.get(".searchbar .x").click();
  });
});
