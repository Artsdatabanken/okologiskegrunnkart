/// <reference types="cypress" />

describe("Select Polygon from Fylke, Kommune and Eiendom Tests", () => {
  it("Select polygon for eiendom", () => {
    cy.wait(1000);
    cy.startDesktop();

    // Open polygon tool and select eiendom
    cy.get('button[title="Polygon tool"]').click();
    cy.contains("Mitt Polygon");
    cy.contains("Definer polygon fra grenser");
    cy.get("#infobox-radio-label-none >>> input").should("be.checked");
    cy.get("#infobox-radio-label-eiendom >>> input").should("not.be.checked");
    cy.get("#infobox-radio-label-eiendom >>> input").click();
    cy.get("#infobox-radio-label-none >>> input").should("not.be.checked");
    cy.get("#infobox-radio-label-eiendom >>> input").should("be.checked");

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
    cy.get("path.leaflet-interactive").should("be.visible");

    // Check polygon data is correct
    cy.get(".infobox-container-side").contains("Omkrets / perimeter");
    cy.get(".infobox-container-side").contains("12.2 km");
    cy.get(".infobox-container-side").contains("Areal");
    cy.get(".infobox-container-side").contains("2.881 km²");
    cy.get(".infobox-container-side").contains("Matrikkel");
    cy.get(".infobox-container-side").contains("5041 / 37 / 1");
  });

  it("Run area report for eiendom", () => {
    // Select all area reports, run and intercept request
    cy.contains("Arealrapport");
    cy.get("#polygon-layer-expander").click();
    cy.contains("Verneplan for Vassdrag");
    cy.get(".polygon-layers-item >>> input").click({ multiple: true });
    cy.wait(100);
    cy.intercept(Cypress.env("baseapi") + "/rpc/arealstatistikk").as(
      "getAreaReport"
    );
    cy.get("#polygon-run-button").click();
    cy.contains("Valgte arealrapporter");

    // Check progress bar is visible and wait until request has finished
    cy.get("#polygon-layer-expander").click();
    cy.wait("@getAreaReport");
  });

  it("Check list with area report results for eiendom. If it fails, area report layers may have changed", () => {
    // Fylker
    cy.get(".generic_element:nth-child(1)").contains("Fylker");
    cy.get(".generic_element:nth-child(1)").contains("Kartverket");
    // Kommuner
    cy.get(".generic_element:nth-child(2)").contains("Kommuner");
    cy.get(".generic_element:nth-child(2)").contains("Kartverket");
    // Eiendommer
    cy.get(".generic_element:nth-child(3)").contains("Eiendommer");
    cy.get(".generic_element:nth-child(3)").contains("Kartverket");
    // Arter nasjonal forvaltningsinteresse
    cy.get(".generic_element:nth-child(4)").contains(
      "Arter nasjonal forvaltningsinteresse"
    );
    cy.get(".generic_element:nth-child(4)").contains("Miljødirektoratet");
    // Breer
    cy.get(".generic_element:nth-child(5)").contains("Breer i Norge");
    cy.get(".generic_element:nth-child(5)").contains(
      "Norges vassdrags- og energidirektorat"
    );
    // Naturtyper - DN Håndbook 13
    cy.get(".generic_element:nth-child(6)").contains(
      "Naturtyper - DN Håndbook 13"
    );
    cy.get(".generic_element:nth-child(6)").contains("Miljødirektoratet");
    // Naturtyper - DN Håndbook 19
    cy.get(".generic_element:nth-child(7)").contains(
      "Naturtyper - DN Håndbook 19"
    );
    cy.get(".generic_element:nth-child(7)").contains("Miljødirektoratet");
    // Naturtyper - NiN Mdir
    cy.get(".generic_element:nth-child(8)").contains("Naturtyper - NiN Mdir");
    cy.get(".generic_element:nth-child(8)").contains("Miljødirektoratet");
    // Naturvernområder
    cy.get(".generic_element:nth-child(9)").contains("Naturvernområder");
    cy.get(".generic_element:nth-child(9)").contains("Miljødirektoratet");
    // Innsjødatabase
    cy.get(".generic_element:nth-child(10)").contains("Innsjødatabase");
    cy.get(".generic_element:nth-child(10)").contains(
      "Norges vassdrags- og energidirektorat"
    );
    // Vannkraft - Magasin
    cy.get(".generic_element:nth-child(11)").contains("Vannkraft - Magasin");
    cy.get(".generic_element:nth-child(11)").contains("Miljødirektoratet");
    // Verneplan for Vassdrag
    cy.get(".generic_element:nth-child(12)").contains("Verneplan for Vassdrag");
    cy.get(".generic_element:nth-child(12)").contains(
      "Norges vassdrags- og energidirektorat"
    );
  });

  it("Check area report results for eiendom. If it fails, API response may have changed", () => {
    // Fylker
    cy.get(".generic_element:nth-child(1)").contains("1");
    // Kommuner
    cy.get(".generic_element:nth-child(2)").contains("1");
    // Eiendommer
    cy.get(".generic_element:nth-child(3)").contains("1");
    // Arter nasjonal forvaltningsinteresse
    cy.get(".generic_element:nth-child(4) >>>>> .MuiBadge-badge").should(
      "not.exist"
    );
    // Breer
    cy.get(".generic_element:nth-child(5) >>>>> .MuiBadge-badge").should(
      "not.exist"
    );
    // Naturtyper - DN Håndbook 13
    cy.get(".generic_element:nth-child(6)").contains("1");
    // Naturtyper - DN Håndbook 19
    cy.get(".generic_element:nth-child(7) >>>>> .MuiBadge-badge").should(
      "not.exist"
    );
    // Naturtyper - NiN Mdir
    cy.get(".generic_element:nth-child(8) >>>>> .MuiBadge-badge").should(
      "not.exist"
    );
    // Naturvernområder
    cy.get(".generic_element:nth-child(9) >>>>> .MuiBadge-badge").should(
      "not.exist"
    );
    // Innsjødatabase
    cy.get(".generic_element:nth-child(10)").contains("9");
    // Vannkraft - Magasin
    cy.get(".generic_element:nth-child(11)").contains("1");
    // Verneplan for Vassdrag
    cy.get(".generic_element:nth-child(12) >>>>> .MuiBadge-badge").should(
      "not.exist"
    );
  });

  it("Delete eiendom polygon from map", () => {
    // Delete polygon
    cy.get('span[title="Fjern"] > button').click();

    // Polygon should not be visible
    cy.get("path.leaflet-interactive").should("not.exist");
    cy.contains("Arealrapport (polygon ikke definert)");
  });

  it("Select polygon for kommune", () => {
    // Open polygon tool and select eiendom
    cy.get("#infobox-radio-label-kommune >>> input").should("not.be.checked");
    cy.get("#infobox-radio-label-kommune >>> input").click();
    cy.get("#infobox-radio-label-kommune >>> input").should("be.checked");
    cy.get("#infobox-radio-label-eiendom >>> input").should("not.be.checked");

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
    cy.get("path.leaflet-interactive").should("be.visible");

    // Check polygon data is correct
    cy.get(".infobox-container-side").contains("Omkrets / perimeter");
    cy.get(".infobox-container-side").contains("200 km");
    cy.get(".infobox-container-side").contains("Areal");
    cy.get(".infobox-container-side").contains("2341.6 km²");
    cy.get(".infobox-container-side").contains("Kommune");
    cy.get(".infobox-container-side").contains("Snåase - Snåsa (5041)");
  });

  it("Run area report for kommune", () => {
    // Select all area reports, run and intercept request
    cy.contains("Arealrapport");
    cy.get("#polygon-layer-expander").click();
    cy.contains("Verneplan for Vassdrag");

    // Unselect all reports and run only Naturtyper
    cy.get(".polygon-layers-item >>> input").click({ multiple: true });
    cy.wait(100);
    cy.get(
      ".polygon-checkbox-content .polygon-layers-item:nth-child(6) input"
    ).click();
    cy.get(
      ".polygon-checkbox-content .polygon-layers-item:nth-child(7) input"
    ).click();

    // Run area report
    cy.intercept(Cypress.env("baseapi") + "/rpc/arealstatistikk").as(
      "getAreaReport"
    );
    cy.get("#polygon-run-button").click();
    cy.contains("Valgte arealrapporter");

    // Check progress bar is visible and wait until request has finished
    cy.get("#polygon-layer-expander").click();
    cy.wait("@getAreaReport");
  });

  it("Check list with area report results for kommune. If it fails, area report layers may have changed", () => {
    // Naturtyper - DN Håndbook 13
    cy.get(".generic_element:nth-child(1)").contains(
      "Naturtyper - DN Håndbook 13"
    );
    cy.get(".generic_element:nth-child(1)").contains("Miljødirektoratet");
    // Naturtyper - DN Håndbook 19
    cy.get(".generic_element:nth-child(2)").contains(
      "Naturtyper - DN Håndbook 19"
    );
    cy.get(".generic_element:nth-child(2)").contains("Miljødirektoratet");
  });

  it("Check area report results for kommune. If it fails, API response may have changed", () => {
    // Fylker
    cy.get(".generic_element:nth-child(1)").contains("28");
    // Kommuner
    cy.get(".generic_element:nth-child(2) >>>>> .MuiBadge-badge").should(
      "not.exist"
    );
  });

  it("Delete kommune polygon from map", () => {
    // Delete polygon
    cy.get('span[title="Fjern"] > button').click();

    // Polygon should not be visible
    cy.get("path.leaflet-interactive").should("not.exist");
    cy.contains("Arealrapport (polygon ikke definert)");
  });

  it("Select polygon for fylke", () => {
    // Open polygon tool and select eiendom
    cy.get("#infobox-radio-label-fylke >>> input").should("not.be.checked");
    cy.get("#infobox-radio-label-fylke >>> input").click();
    cy.get("#infobox-radio-label-fylke >>> input").should("be.checked");
    cy.get("#infobox-radio-label-kommune >>> input").should("not.be.checked");

    // Zoom out map
    cy.get('a[title="Zoom out"]').click();
    cy.wait(350);

    // Intercept request
    cy.intercept(
      Cypress.env("baseapi") +
        "/rpc/punkt?lat=64.18366059975261&lng=12.609558105468752"
    ).as("getPolygon");

    // Polygon should be visible after clicking on map
    cy.get("path.leaflet-interactive").should("not.exist");
    cy.contains("Arealrapport (polygon ikke definert)");
    cy.get(".leaflet-container").click(950, 550);
    cy.wait("@getPolygon");
    cy.get("path.leaflet-interactive").should("be.visible");

    // Check polygon data is correct
    cy.get(".infobox-container-side").contains("Omkrets / perimeter");
    cy.get(".infobox-container-side").contains("1543.8 km");
    cy.get(".infobox-container-side").contains("Areal");
    cy.get(".infobox-container-side").contains("59687.1 km²");
    cy.get(".infobox-container-side").contains("Fylke");
    cy.get(".infobox-container-side").contains("Trøndelag - Trööndelage (50)");
  });

  it("Run area report for fylke", () => {
    // Select all area reports, run and intercept request
    cy.contains("Arealrapport");
    cy.get("#polygon-layer-expander").click();
    cy.contains("Verneplan for Vassdrag");

    // Unselect all reports and run only Fylke and Kommune
    cy.get(
      ".polygon-checkbox-content .polygon-layers-item:nth-child(1) input"
    ).click();
    cy.get(
      ".polygon-checkbox-content .polygon-layers-item:nth-child(2) input"
    ).click();
    cy.get(
      ".polygon-checkbox-content .polygon-layers-item:nth-child(6) input"
    ).click();
    cy.get(
      ".polygon-checkbox-content .polygon-layers-item:nth-child(7) input"
    ).click();

    // Run area report
    cy.intercept(Cypress.env("baseapi") + "/rpc/arealstatistikk").as(
      "getAreaReport"
    );
    cy.get("#polygon-run-button").click();
    cy.contains("Valgte arealrapporter");

    // Check progress bar is visible and wait until request has finished
    cy.get("#polygon-layer-expander").click();
    cy.wait("@getAreaReport");
  });

  it("Check list with area report results for fylke. If it fails, area report layers may have changed", () => {
    // Fylker
    cy.get(".generic_element:nth-child(1)").contains("Fylker");
    cy.get(".generic_element:nth-child(1)").contains("Kartverket");
    // Kommuner
    cy.get(".generic_element:nth-child(2)").contains("Kommuner");
    cy.get(".generic_element:nth-child(2)").contains("Kartverket");
  });

  it("Check area report results for fylke. If it fails, API response may have changed", () => {
    // Fylker
    cy.get(".generic_element:nth-child(1)").contains("1");
    // Kommuner
    cy.get(".generic_element:nth-child(2)").contains("38");
  });

  it("Delete fylke polygon from map", () => {
    // Delete polygon
    cy.get('span[title="Fjern"] > button').click();

    // Polygon should not be visible
    cy.get("path.leaflet-interactive").should("not.exist");
    cy.contains("Arealrapport (polygon ikke definert)");
  });
});
