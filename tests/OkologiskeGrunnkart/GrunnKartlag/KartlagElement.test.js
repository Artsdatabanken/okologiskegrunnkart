import React from "react";
import {
  cleanup,
  render,
  screen,
  fireEvent,
  waitFor
} from "@testing-library/react";
import "@testing-library/jest-dom";
import KartlagElement from "../../../src/Okologiskegrunnkart/GrunnKartlag/KartlagElement";
import kartlagMock from "../../tools/kartlagMock.json";

afterEach(cleanup);

const kartlag = kartlagMock;

function renderKartlagElement(args) {
  let defaultprops = {
    kartlag: null,
    kartlagKey: null,
    valgt: false,
    toggleSublayer: () => {},
    toggleAllSublayers: () => {},
    showSublayerDetails: false
  };

  const props = { ...defaultprops, ...args };
  return render(<KartlagElement {...props} />);
}

it("should render layer and sublayers correctly with toogles off when not visible", async () => {
  const kartlagKey = " 2";
  const layer = { ...kartlag[kartlagKey] };
  const { getByText, findByText, getAllByRole } = renderKartlagElement({
    kartlag: layer,
    kartlagKey: kartlagKey
  });
  getByText("Arealressurs: AR5");
  getByText("NIBIO");
  let all = screen.queryByText("Alle kategorier");
  expect(all).toBeNull();
  let sublayer = screen.queryByText("Arealressurs: AR5 Arealtype");
  expect(sublayer).toBeNull();
  sublayer = screen.queryByText("Jordbruksareal");
  expect(sublayer).toBeNull();
  sublayer = screen.queryByText("Treslag");
  expect(sublayer).toBeNull();

  // Expand sublayers
  fireEvent.click(screen.getByText("Arealressurs: AR5"));
  await waitFor(() => findByText("Alle kategorier"));

  getByText("Arealressurs: AR5 Arealtype");
  getByText("Jordbruksareal");
  getByText("Treslag");

  // All toggles are off
  let toggles = getAllByRole("checkbox");
  expect(toggles.length).toBe(4);
  expect(toggles[0]).not.toBeChecked();
  expect(toggles[1]).not.toBeChecked();
  expect(toggles[2]).not.toBeChecked();
  expect(toggles[3]).not.toBeChecked();
});

it("should render all categories with toogle on when visible", async () => {
  const kartlagKey = " 2";
  const layer = { ...kartlag[kartlagKey] };
  const allcategorieslayer = { ...layer.allcategorieslayer, erSynlig: true };
  const modifiedLayer = { ...layer, allcategorieslayer };
  const { getByText, findByText, getAllByRole } = renderKartlagElement({
    kartlag: modifiedLayer,
    kartlagKey: kartlagKey
  });

  // Expand sublayers
  fireEvent.click(screen.getByText("Arealressurs: AR5"));
  await waitFor(() => findByText("Alle kategorier"));

  getByText("Arealressurs: AR5 Arealtype");
  getByText("Jordbruksareal");
  getByText("Treslag");

  // All toggles are off
  let toggles = getAllByRole("checkbox");
  expect(toggles.length).toBe(4);
  expect(toggles[0]).toBeChecked();
  expect(toggles[1]).not.toBeChecked();
  expect(toggles[2]).not.toBeChecked();
  expect(toggles[3]).not.toBeChecked();
});

it("should render sublayer with toogle on when visible", async () => {
  const kartlagKey = " 2";
  const layer = { ...kartlag[kartlagKey] };
  let sublayer = {
    ...layer.underlag["ArealressursAR5_ArealressursAR5Arealtype"]
  };
  sublayer = { ...sublayer, visible: true };
  const sublayers = {
    ...layer.underlag,
    ArealressursAR5_ArealressursAR5Arealtype: sublayer
  };
  const modifiedLayer = { ...layer, underlag: sublayers };
  const { getByText, findByText, getAllByRole } = renderKartlagElement({
    kartlag: modifiedLayer,
    kartlagKey: kartlagKey
  });

  // Expand sublayers
  fireEvent.click(screen.getByText("Arealressurs: AR5"));
  await waitFor(() => findByText("Alle kategorier"));

  getByText("Arealressurs: AR5 Arealtype");
  getByText("Jordbruksareal");
  getByText("Treslag");

  // All toggles are off
  let toggles = getAllByRole("checkbox");
  expect(toggles.length).toBe(4);
  expect(toggles[0]).not.toBeChecked();
  expect(toggles[1]).toBeChecked();
  expect(toggles[2]).not.toBeChecked();
  expect(toggles[3]).not.toBeChecked();
});

it("should render number of visible sublayers in badge", async () => {
  const kartlagKey = " 2";
  const layer = { ...kartlag[kartlagKey] };
  const modifiedLayer = { ...layer, numberVisible: 3 };
  const { getByText, findByText } = renderKartlagElement({
    kartlag: modifiedLayer,
    kartlagKey: kartlagKey
  });

  // Expand sublayers
  fireEvent.click(screen.getByText("Arealressurs: AR5"));
  await waitFor(() => findByText("Alle kategorier"));

  getByText("Arealressurs: AR5 Arealtype");
  getByText("Jordbruksareal");
  getByText("Treslag");

  // Badge
  let badge = getByText("3");
  expect(badge).toHaveClass("MuiBadge-colorPrimary");
});
