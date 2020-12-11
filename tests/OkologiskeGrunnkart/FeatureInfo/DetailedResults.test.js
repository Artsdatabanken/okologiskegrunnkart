import React from "react";
import { cleanup, render } from "@testing-library/react";
import DetailedResults from "../../../src/Okologiskegrunnkart/FeatureInfo/DetailedResults";
import kartlagMock from "../../tools/kartlagMock.json";
import { pointCoordinates } from "../../tools/pointDataMock.js";

afterEach(cleanup);

const kartlag = kartlagMock;
const resultLayer = kartlag[" 2"];
const listResults = [
  "ArealressursAR5_ArealressursAR5Arealtype",
  "ArealressursAR5_Jordbruksareal",
  "ArealressursAR5_Treslag"
];
const primaryText = {
  ArealressursAR5_ArealressursAR5Arealtype: {
    elementer: [{ enkel_beskrivelse: "Produktiv skog" }],
    harData: true
  },
  ArealressursAR5_Jordbruksareal: {
    elementer: [{ enkel_beskrivelse: "Produktiv skog" }],
    harData: true
  },
  ArealressursAR5_Treslag: {
    elementer: [{ artreslag_beskrivelse: "Barskog" }],
    harData: true
  }
};
const secondaryText = {
  ArealressursAR5_ArealressursAR5Arealtype: {
    elementer: [{ vanlig_beskrivelse: "Skog av lav bonitet" }],
    harData: true
  },
  ArealressursAR5_Jordbruksareal: {
    elementer: [{ vanlig_beskrivelse: "Skog av lav bonitet" }],
    harData: true
  },
  ArealressursAR5_Treslag: {
    elementer: [{ vanlig_beskrivelse: "Skog av lav bonitet" }],
    harData: true
  }
};
const faktaark = {
  ArealressursAR5_ArealressursAR5Arealtype: {
    faktaark: "Produktiv skog"
  },
  ArealressursAR5_Jordbruksareal: {
    faktaark: "Produktiv skog"
  },
  ArealressursAR5_Treslag: {
    faktaark: "Barskog"
  }
};

function renderDetailedResults(args) {
  let defaultprops = {
    resultLayer: null,
    listResults: null,
    primaryText: null,
    secondaryText: null,
    numberResults: 0,
    hideDetailedResults: () => {},
    coordinates_area: null,
    faktaark: null
  };

  const props = { ...defaultprops, ...args };
  return render(<DetailedResults {...props} />);
}

it("should render details with one faktaark correctly", () => {
  const { getByText, getAllByText } = renderDetailedResults({
    resultLayer: resultLayer,
    listResults: listResults,
    primaryText: primaryText,
    secondaryText: secondaryText,
    numberResults: 3,
    coordinates_area: pointCoordinates(),
    faktaark:
      "breadcrumbs.js:64 https://wms.nibio.no/cgi-bin/ar5?version=1.1.0&srs=EPSG:4326&feature_count=1&info_format=text/html&layers=Hovedgrupper&query_layers=Hovedgrupper&x=128&y=128&height=255&width=255&request=GetFeatureInfo&service=WMS&bbox={bbox}"
  });

  // Layer result details
  getByText("Detaljerte resultater");
  getByText("Arealressurs: AR5");
  getByText("NIBIO");
  getByText("Faktaark");
  getByText("Arealressurs: AR5 Arealtype");
  getByText("Jordbruksareal");
  getByText("Treslag");
  getByText("Barskog");
  getByText("Artreslag beskrivelse:");
  getByText("3");
  let type = getAllByText("Enkel beskrivelse:");
  expect(type.length).toBe(2);
  type = getAllByText("Vanlig beskrivelse:");
  expect(type.length).toBe(3);
  type = getAllByText("Produktiv skog");
  expect(type.length).toBe(2);
  type = getAllByText("Skog av lav bonitet");
  expect(type.length).toBe(3);
});

it("should render details with one faktaark per result correctly", () => {
  const { getByText, getAllByText } = renderDetailedResults({
    resultLayer: resultLayer,
    listResults: listResults,
    primaryText: primaryText,
    secondaryText: secondaryText,
    numberResults: 3,
    coordinates_area: pointCoordinates(),
    faktaark: faktaark
  });

  // Layer result details
  getByText("Detaljerte resultater");
  getByText("Arealressurs: AR5");
  getByText("NIBIO");
  getByText("Arealressurs: AR5 Arealtype");
  getByText("Jordbruksareal");
  getByText("Treslag");
  getByText("Barskog");
  getByText("Artreslag beskrivelse:");
  getByText("3");
  let type = getAllByText("Enkel beskrivelse:");
  expect(type.length).toBe(2);
  type = getAllByText("Vanlig beskrivelse:");
  expect(type.length).toBe(3);
  type = getAllByText("Produktiv skog");
  expect(type.length).toBe(2);
  type = getAllByText("Skog av lav bonitet");
  expect(type.length).toBe(3);
  type = getAllByText("Faktaark");
  expect(type.length).toBe(3);
});
