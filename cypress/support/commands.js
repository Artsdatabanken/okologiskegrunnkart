// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// General import
import "cypress-file-upload";

// Start APP in desktop
Cypress.Commands.add("startDesktop", () => {
  // cy.visit("http://localhost:3000/");
  // cy.visit("https://okologiskegrunnkart.test.artsdatabanken.no");
  // cy.visit("https://okologiskegrunnkart.artsdatabanken.no");
  cy.visit(Cypress.env("baseurl"));
  cy.contains("Økologiske grunnkart");
  cy.contains("Mer info");
  cy.contains("Søk");
  cy.url({ timeout: 10000 }).should("include", "favorites");
});
