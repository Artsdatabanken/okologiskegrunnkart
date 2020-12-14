import React from "react";
import { cleanup, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import KartlagUnderElement from "../../../src/Okologiskegrunnkart/GrunnKartlag/KartlagUnderElement";
import kartlagMock from "../../tools/kartlagMock.json";

afterEach(cleanup);

const kartlag = kartlagMock;

function renderKartlagUnderElement(args) {
  let defaultprops = {
    underlag: null,
    kartlagKey: null,
    underlagKey: null,
    toggleSublayer: () => {},
    showSublayerDetails: false
  };

  const props = { ...defaultprops, ...args };
  return render(<KartlagUnderElement {...props} />);
}

it("should render sublayer correctly and toogle be off when not visible", () => {
  const kartlagKey = " 2";
  const underlagKey = "ArealressursAR5_ArealressursAR5Arealtype";
  const sublayer = { ...kartlag[kartlagKey].underlag[underlagKey] };
  const { getByText, getByRole } = renderKartlagUnderElement({
    underlag: sublayer,
    kartlagKey: kartlagKey,
    underlagKey: underlagKey
  });
  getByText("Arealressurs: AR5 Arealtype");
  let toogle = getByRole("checkbox");
  expect(toogle).not.toBeChecked();
});

it("should render sublayer correctly and toogle be on when visible ", () => {
  const kartlagKey = " 2";
  const underlagKey = "ArealressursAR5_ArealressursAR5Arealtype";
  const sublayer = { ...kartlag[kartlagKey].underlag[underlagKey] };
  const modifiedSublayer = { ...sublayer, visible: true };
  const { getByText, getByRole } = renderKartlagUnderElement({
    underlag: modifiedSublayer,
    kartlagKey: kartlagKey,
    underlagKey: underlagKey
  });
  getByText("Arealressurs: AR5 Arealtype");
  let toogle = getByRole("checkbox");
  expect(toogle).toBeChecked();
});
