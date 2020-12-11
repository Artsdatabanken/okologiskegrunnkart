import React from "react";
import { cleanup, render } from "@testing-library/react";
import AppName from "../../src/Okologiskegrunnkart/AppName";

afterEach(cleanup);

function renderAppName(args) {
  let defaultprops = {
    showAppName: true,
    closeAppName: () => {},
    showAboutModal: false,
    handleAboutModal: () => {},
    aboutPage: null,
    showInfobox: true,
    isMobile: false
  };

  const props = { ...defaultprops, ...args };
  return render(<AppName {...props} />);
}

it("should render app name and button at start for desktop", () => {
  const { queryByText, getByText } = renderAppName();
  getByText("Økologiske grunnkart");
  getByText("Mer info");

  let submitButton = queryByText('Om "Økologiske Grunnkart"');
  expect(submitButton).toBeNull();
});

it("should render about modal", async () => {
  const { queryByText, getByText } = renderAppName({
    showAppName: false,
    showAboutModal: true,
    aboutPage: "This is a test"
  });
  let submitButton = queryByText("Mer info");
  expect(submitButton).toBeNull();
  submitButton = queryByText("Økologiske Grunnkart");
  expect(submitButton).toBeNull();

  getByText('Om "Økologiske Grunnkart"');
  getByText("This is a test");
});

it("should render app name and about modal", async () => {
  const { getByText } = renderAppName({
    showAppName: true,
    showAboutModal: true,
    aboutPage: "This is a test"
  });
  getByText("Økologiske grunnkart");
  getByText("Mer info");
  getByText('Om "Økologiske Grunnkart"');
  getByText("This is a test");
});
