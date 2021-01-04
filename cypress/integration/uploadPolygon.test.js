/// <reference types="cypress" />

describe("Upload Polygon Tests", () => {
  it("Upload First Polygon", () => {
    cy.startDesktop();

    // Open polygon tool and verify self-drawn polygon is selected
    cy.get('button[title="Polygon tool"]').click();
    cy.contains("Mitt Polygon");
    cy.contains("Definer polygon fra grenser");
    cy.get("#infobox-radio-label-none >>> input").should("be.checked");
    cy.get("#polygon-options-listitem").click();

    // Polygon should not be visible
    cy.get("path.leaflet-interactive").should("not.exist");
    cy.contains("Arealrapport (polygon ikke definert)");

    // Upload polygon
    cy.get('span[title="Last opp polygon"] > button').click();
    cy.fixture("test_01.geojson").then(fileContent => {
      cy.get('input[type="file"]').attachFile({
        fileContent: fileContent.toString(),
        fileName: "test_01.geojson",
        mimeType: "application/json"
      });
    });

    // Check polygon and its size are shown
    cy.get("path.leaflet-interactive").should("not.be.null");
    cy.contains("Omkrets / perimeter");
    cy.contains("21.8 km");
    cy.contains("Areal");
    cy.contains("15.852 km²");

    // Check edit polygon button is disabled
    cy.get('span[title="Rediger"] > button').should("be.disabled");
  });

  it("Run Area Report", () => {
    // Select all area reports, run and intercept request
    cy.contains("Arealrapport");
    cy.get("#polygon-layer-expander").click();
    cy.contains("Verneplan for Vassdrag");
    cy.get(".polygon-layers-item >>> input").click({ multiple: true });
    cy.wait(100);
    cy.intercept(
      "https://okologiskegrunnkartapi.test.artsdatabanken.no/rpc/arealstatistikk"
    ).as("getAreaReport");
    cy.get("#polygon-run-button").click();
    cy.contains("Valgte arealrapporter");

    // Check progress bar is visible and wait until request has finished
    cy.get("#polygon-area-report-progress").should("be.visible");
    cy.get("#polygon-layer-expander").click();
    cy.wait("@getAreaReport");
    cy.get("#polygon-area-report-progress").should("not.exist");
  });

  it("Check list with area report results. If it fails, area report layers may have changed", () => {
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

  it("Check area report results and details. If it fails, API response may have changed", () => {
    // Fylker
    cy.get(".generic_element:nth-child(1)").contains("1");
    // Kommuner
    cy.get(".generic_element:nth-child(2)").contains("2");
    // Eiendommer
    cy.get(".generic_element:nth-child(3)").contains("99+");
    // Arter nasjonal forvaltningsinteresse
    cy.get(".generic_element:nth-child(4)").contains("21");
    // Breer
    cy.get(".generic_element:nth-child(5) >>>>> .MuiBadge-badge").should(
      "not.exist"
    );
    // Naturtyper - DN Håndbook 13
    cy.get(".generic_element:nth-child(6)").contains("19");
    // Naturtyper - DN Håndbook 19
    cy.get(".generic_element:nth-child(7)").contains("11");
    // Naturtyper - NiN Mdir
    cy.get(".generic_element:nth-child(8) >>>>> .MuiBadge-badge").should(
      "not.exist"
    );
    // Naturvernområder
    cy.get(".generic_element:nth-child(9)").contains("18");
    // Innsjødatabase
    cy.get(".generic_element:nth-child(10)").contains("1");
    // Vannkraft - Magasin
    cy.get(".generic_element:nth-child(11) >>>>> .MuiBadge-badge").should(
      "not.exist"
    );
    // Verneplan for Vassdrag
    cy.get(".generic_element:nth-child(12)").contains("1");
  });

  it("Delete polygon. Area report results should disappear", () => {
    // No area report results visible
    cy.get("#layers-results-list")
      .find(".generic_element")
      .should("have.length", 12);

    // Delete polygon
    cy.get('span[title="Fjern"] > button').click();

    // Polygon should not be visible
    cy.get("path.leaflet-interactive").should("not.exist");
    cy.contains("Arealrapport (polygon ikke definert)");

    // No area report results visible
    cy.get("#layers-results-list").should("not.exist");
  });

  it("Give warning when wrong file is uploaded", () => {
    // Upload wrong polygon file
    cy.get('span[title="Last opp polygon"] > button').click();
    cy.fixture("not_geojson.geojson").then(fileContent => {
      cy.get('input[type="file"]').attachFile({
        fileContent: fileContent.toString(),
        fileName: "not_geojson.geojson",
        mimeType: "application/json"
      });
    });

    // Warning should be visible
    cy.get(".polygon-action-error").should("be.visible");
    cy.contains("Kunne ikke laste opp filen");

    // Warning should disappear after 2.5 seconds
    cy.wait(2500);
    cy.get(".polygon-action-error").should("not.exist");
  });
});
