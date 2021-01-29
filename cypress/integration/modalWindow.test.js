/// <reference types="cypress" />

describe("Modal Window Tests", () => {
  before(() => {
    cy.wait(1000);
    cy.startDesktop();
  });

  it("Open about window", () => {
    // Intercept requests
    cy.intercept(Cypress.env("baseurl") + "/omOkologiskeGrunnkart.txt").as(
      "getAbout"
    );

    // Click button
    cy.get(".help_button").click();

    cy.get("#settings-drawer").contains('Om "Økologiske Grunnkart"');
    cy.get("#drawer-menuitem-about-info").click();

    cy.wait("@getAbout");

    // Find modal window
    cy.get(".help-modal-body")
      .find(".help-modal-content")
      .should("have.length", 1);
    cy.get(".help-modal-body")
      .find(".help-text-line")
      .should("have.length", 29);
    cy.get(".help-modal-body")
      .find(".help-text-line-header")
      .should("have.length", 4);
    cy.get(".help-modal-body")
      .find(".help-text-line")
      .first()
      .contains("Denne kartportalen ");
    cy.get(".help-modal-body")
      .find(".help-text-line")
      .last()
      .contains("Data i ");

    // Close window
    cy.get(".close-modal-button").click();
    cy.get(".close-modal-button").should("not.exist");
  });

  it("Open user manual", () => {
    // Intercept requests
    cy.intercept(Cypress.env("baseurl") + "/brukermanual.txt").as(
      "getUserManual"
    );

    // Click button
    cy.get(".help_button").click();

    cy.get("#settings-drawer").contains("Brukermanual");
    cy.get("#drawer-menuitem-user-manual").click();

    cy.wait("@getUserManual");

    // Find modal window
    cy.get(".help-modal-body")
      .find(".help-modal-content")
      .should("have.length", 1);
    cy.get(".help-modal-body")
      .find(".help-text-line")
      .should("have.length", 24);
    cy.get(".help-modal-body")
      .find(".help-text-line-header")
      .should("have.length", 12);
    cy.get(".help-modal-body")
      .find(".help-text-line")
      .first()
      .contains("- Du kan panorere ");
    cy.get(".help-modal-body")
      .find(".help-text-line")
      .last()
      .contains("Lenka fra portalen ");

    // Close window
    cy.get(".close-modal-button").click();
    cy.get(".close-modal-button").should("not.exist");
  });
});
