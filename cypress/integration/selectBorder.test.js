/// <reference types="cypress" />

describe("Select Polygon from Fylke, Kommune and Eiendom Tests", () => {
  it("Select polygon for eiendom", () => {
    cy.wait(1000);
    cy.startDesktop();

    // Zoom in map
    cy.get('a[title="Zoom in"]').click();
    cy.wait(350);
    cy.get('a[title="Zoom in"]').click();
    cy.wait(350);
    cy.get('a[title="Zoom in"]').click();
    cy.wait(350);

    // Pan window and zoom again
    cy.get(".leaflet-container").dragMapFromCenter({
      xMoveFactor: 0.6,
      yMoveFactor: -1
    });
    cy.wait(350);
    cy.get('a[title="Zoom in"]').click();
    cy.wait(1000);

    // Intercept requests
    cy.intercept(
      Cypress.env("baseapi") +
        "/rpc/stedsnavn?lng=12.623291015625&lat=64.22250669960073&zoom=10"
    ).as("getPlaceData");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?kommunenummer=5041&gardsnummer=37&bruksnummer=1&treffPerSide=100"
    ).as("getAddressData");
    cy.intercept(
      Cypress.env("baseapi") +
        "/rpc/punkt?lat=64.22250669960073&lng=12.623291015625"
    ).as("getPolygon");

    // Click on map
    cy.get(".leaflet-container").click(950, 550);
    cy.get(".infobox-container-side.infobox-open").should("be.visible");
    cy.wait("@getPlaceData");
    cy.wait("@getAddressData");
    cy.wait("@getPolygon");

    // Check infobox contains correct data
    cy.get("img.leaflet-marker-icon").should("not.be.null");
    cy.get(".infobox-container-side.infobox-open").contains("Tortbakktjønna");
    cy.get(".infobox-container-side.infobox-open").contains("vann");
    cy.get(".infobox-container-side").contains("Trøndelag - Trööndelage");
    cy.get(".infobox-container-side.infobox-open").contains("50");
    cy.get(".infobox-container-side.infobox-open").contains("Snåase - Snåsa");
    cy.get(".infobox-container-side.infobox-open").contains("5041");
    cy.get(".infobox-container-side.infobox-open").contains("Kovatnet 10");
    cy.get(".infobox-container-side.infobox-open").contains("37 / 1");
    cy.get(".infobox-container-side").contains("64.2225° N 12.6233° Ø");
    cy.get(".infobox-container-side.infobox-open").contains("423 moh");
    cy.get(".infobox-container-side.infobox-open").contains("Marker grense");
    cy.get(".infobox-container-side.infobox-open").contains("Fylke");
    cy.get(".infobox-container-side.infobox-open").contains("Kommune");
    cy.get(".infobox-container-side.infobox-open").contains("Eiendom");
    cy.get(".infobox-container-side.infobox-open").contains("Valgte kartlag");
    cy.get(".infobox-container-side.infobox-open").contains("Alle kartlag");
  });

  it("Activate border polygons", () => {
    // Activate fylke
    cy.get("path.leaflet-interactive").should("not.exist");
    cy.get("#show-fylke-toggle").should("have.attr", "value", "off");
    cy.get("#show-fylke-toggle").click();
    cy.get("path.leaflet-interactive").should("be.visible");
    cy.get(".leaflet-container")
      .find("path.leaflet-interactive")
      .should("have.length", 1);
    cy.get("#show-fylke-toggle").should("have.attr", "value", "on");

    // Activate kommune
    cy.get("#show-kommune-toggle").should("have.attr", "value", "off");
    cy.get("#show-kommune-toggle").click();
    cy.get(".leaflet-container")
      .find("path.leaflet-interactive")
      .should("have.length", 2);
    cy.get("#show-kommune-toggle").should("have.attr", "value", "on");

    // Activate eiendom
    cy.get("#show-eiendom-toggle").should("have.attr", "value", "off");
    cy.get("#show-eiendom-toggle").click();
    cy.get(".leaflet-container")
      .find("path.leaflet-interactive")
      .should("have.length", 3);
    cy.get("#show-eiendom-toggle").should("have.attr", "value", "on");
  });

  it("Move to polygon tool. Polygons and marker should not be visible", () => {
    // Open polygon tool and select eiendom
    cy.get('button[title="Polygon tool"]').click();
    cy.contains("Mitt Polygon");
    cy.contains("Definer polygon fra grenser");
    cy.get("img.leaflet-marker-icon").should("not.exist");
    cy.get("path.leaflet-interactive").should("not.exist");

    // Activate eiendom
    cy.get("#infobox-radio-label-none >>> input").should("be.checked");
    cy.get("#infobox-radio-label-eiendom >>> input").should("not.be.checked");
    cy.get("#infobox-radio-label-eiendom >>> input").click();
    cy.get("#infobox-radio-label-none >>> input").should("not.be.checked");
    cy.get("#infobox-radio-label-eiendom >>> input").should("be.checked");

    // Intercept request
    cy.intercept(
      Cypress.env("baseapi") +
        "/rpc/punkt?lat=64.22250669960073&lng=12.623291015625"
    ).as("getPolygon");

    // Polygon should be visible after clicking on map
    cy.get("path.leaflet-interactive").should("not.exist");
    cy.contains("Arealrapport (polygon ikke definert)");
    cy.get(".leaflet-container").click(950, 550);
    cy.wait("@getPolygon");
    cy.get(".leaflet-container")
      .find("path.leaflet-interactive")
      .should("have.length", 1);
  });

  it("Move to marker tool. Deactivate border polygons", () => {
    // Move to marker tool. It should show all polygons (4)
    cy.get('button[title="Marker tool"]').click();
    cy.get("img.leaflet-marker-icon").should("be.visible");
    cy.get(".infobox-container-side.infobox-open").contains("Tortbakktjønna");
    cy.get(".leaflet-container")
      .find("path.leaflet-interactive")
      .should("have.length", 4);

    // Deactivate fylke
    cy.get("#show-fylke-toggle").click();
    cy.get("#show-fylke-toggle").should("have.attr", "value", "off");
    cy.get(".leaflet-container")
      .find("path.leaflet-interactive")
      .should("have.length", 3);

    // Deactivate kommune
    cy.get("#show-kommune-toggle").click();
    cy.get("#show-kommune-toggle").should("have.attr", "value", "off");
    cy.get(".leaflet-container")
      .find("path.leaflet-interactive")
      .should("have.length", 2);

    // Deactivate eiendom
    cy.get("#show-eiendom-toggle").click();
    cy.get("#show-eiendom-toggle").should("have.attr", "value", "off");
    cy.get(".leaflet-container")
      .find("path.leaflet-interactive")
      .should("have.length", 1);
  });

  it("Move again to polygon tool and hide polygon", () => {
    // Move to polygon tool
    cy.get('button[title="Polygon tool"]').click();
    cy.get("img.leaflet-marker-icon").should("not.exist");
    cy.contains("Mitt Polygon");
    cy.contains("Definer polygon fra grenser");
    cy.get(".leaflet-container")
      .find("path.leaflet-interactive")
      .should("have.length", 1);

    // Hide polygon
    cy.get("#hide-polygon-button").click();
    cy.get("path.leaflet-interactive").should("not.exist");

    // Move to marker tool and verify that polygon is not shown
    cy.get('button[title="Marker tool"]').click();
    cy.get("img.leaflet-marker-icon").should("be.visible");
    cy.get("path.leaflet-interactive").should("not.exist");

    // Move again to polygon tool and show polygon
    cy.get('button[title="Polygon tool"]').click();
    cy.get("img.leaflet-marker-icon").should("not.exist");
    cy.get("path.leaflet-interactive").should("not.exist");
    cy.contains("Mitt Polygon");
    cy.contains("Definer polygon fra grenser");
    cy.get("#hide-polygon-button").click();
    cy.get(".leaflet-container")
      .find("path.leaflet-interactive")
      .should("have.length", 1);
  });
});
