import React from "react";
import { cleanup, render, fireEvent, screen } from "@testing-library/react";
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
  const { getByText } = renderAppName();
  getByText("Økologiske grunnkart");
  getByText("Mer info");
});

it("should open modal when clicking button", async () => {
  const { queryByText, getByText } = renderAppName({
    aboutPage: "This is a test"
  });
  let submitButton = queryByText("Mer info");
  expect(submitButton).not.toBeNull();
  fireEvent.click(screen.getByText("Mer info"));

  setTimeout(() => {
    getByText('Om "Okologiske Grunnkart"');
    getByText("This is a test");
    submitButton = screen.queryByText("Mer info");
    expect(submitButton).toBeNull();
  }, 1000);
});
