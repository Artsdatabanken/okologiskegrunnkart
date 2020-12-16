import React from "react";
import "@testing-library/jest-dom";
import { cleanup, render, fireEvent, waitFor } from "@testing-library/react";
import KartVelger from "../../src/Kart/KartVelger";

afterEach(cleanup);

function renderKartVelger(args) {
  let defaultprops = {
    handleSetBakgrunnskart: () => {},
    aktivtFormat: "topo4",
    showSideBar: false,
    showInfobox: false,
    isMobile: false
  };
  const props = { ...defaultprops, ...args };
  return render(<KartVelger {...props} />);
}

it("should render map selection buttons", async () => {
  const { getByTitle, findByTitle, getAllByRole } = renderKartVelger();
  getByTitle("Endre bakgrunnskart");

  // Get buttons (only one visible)
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(1);

  // Open options
  fireEvent.click(getByTitle("Endre bakgrunnskart"));
  await waitFor(() => findByTitle("GEBCO"));

  // Get buttons (several visible)
  buttons = getAllByRole("button");
  expect(buttons.length).toBeGreaterThanOrEqual(4);
  getByTitle("Endre bakgrunnskart");
  getByTitle("Topografisk norgeskart 4");
  getByTitle("Topografisk norgeskart 4 Gråtone");
  getByTitle("Norge i bilder");

  // Close options
  fireEvent.click(getByTitle("Endre bakgrunnskart"));
  buttons = getAllByRole("button");
  expect(buttons.length).toBe(1);
  getByTitle("Endre bakgrunnskart");
});
