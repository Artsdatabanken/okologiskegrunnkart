import React from "react";
import { cleanup, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import TegnforklaringLink from "../../src/Tegnforklaring/TegnforklaringLink";
import kartlagMock from "../tools/kartlagMock.json";

afterEach(cleanup);

const kartlag = kartlagMock;

function renderTegnforklaringLink(args) {
  let defaultprops = {
    layers: kartlag,
    setLegendVisible: () => {},
    handleLegendPosition: () => {},
    isMobile: false
  };

  const props = { ...defaultprops, ...args };
  return render(<TegnforklaringLink {...props} />);
}

it("should render disabled legend link when there are no active sublayers", () => {
  const { getAllByRole, getByText } = renderTegnforklaringLink();
  getByText("Tegnforklaring");

  // Button is disabled
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(2);
  expect(buttons[0]).toHaveAttribute("aria-disabled", "true"); // Mui List Item
  expect(buttons[1]).toBeDisabled(); // Mui Icon Button
});

it("should render enabled legend link when there is one active sublayers", () => {
  let modifiedLayers = JSON.parse(JSON.stringify(kartlag));
  let sublayer =
    modifiedLayers[" 2"].underlag["ArealressursAR5_ArealressursAR5Arealtype"];
  sublayer.visible = true;

  const { getAllByRole, getByText } = renderTegnforklaringLink({
    layers: modifiedLayers
  });
  getByText("Tegnforklaring");

  // Button is disabled
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(2);
  expect(buttons[0]).toHaveAttribute("aria-disabled", "false"); // Mui List Item
  expect(buttons[1]).not.toBeDisabled(); // Mui Icon Button

  // Badge
  let badge = getByText("1");
  expect(badge).toHaveClass("MuiBadge-colorPrimary");
});

it("should render enabled legend link when all categories are active", () => {
  let modifiedLayers = JSON.parse(JSON.stringify(kartlag));

  let sublayer1 =
    modifiedLayers[" 2"].underlag["ArealressursAR5_ArealressursAR5Arealtype"];
  sublayer1.visible = true;
  sublayer1.erSynlig = true;

  let sublayer2 = modifiedLayers[" 2"].underlag["ArealressursAR5_Treslag"];
  sublayer2.visible = true;
  sublayer2.erSynlig = true;

  let sublayer3 =
    modifiedLayers[" 2"].underlag["ArealressursAR5_Jordbruksareal"];
  sublayer3.visible = true;
  sublayer3.erSynlig = true;

  let allcategories = modifiedLayers[" 2"].allcategorieslayer;
  allcategories.erSynlig = true;

  const { getAllByRole, getByText } = renderTegnforklaringLink({
    layers: modifiedLayers
  });
  getByText("Tegnforklaring");

  // Button is disabled
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(2);
  expect(buttons[0]).toHaveAttribute("aria-disabled", "false"); // Mui List Item
  expect(buttons[1]).not.toBeDisabled(); // Mui Icon Button

  // Badge
  let badge = getByText("3");
  expect(badge).toHaveClass("MuiBadge-colorPrimary");
});

it("should render enabled legend link when all categories are active, including aggregated layer", () => {
  let modifiedLayers = JSON.parse(JSON.stringify(kartlag));

  let sublayer1 =
    modifiedLayers[" 31"].underlag["ArterRdlista_Rdlistaarterallekategorier"];
  sublayer1.visible = true;
  sublayer1.erSynlig = true;

  let sublayer2 =
    modifiedLayers[" 31"].underlag["ArterRdlista_RERegionaltutddd"];
  sublayer2.visible = true;
  sublayer2.erSynlig = true;

  let sublayer3 = modifiedLayers[" 31"].underlag["ArterRdlista_CRKritisktruet"];
  sublayer3.visible = true;
  sublayer3.erSynlig = true;

  let sublayer4 = modifiedLayers[" 31"].underlag["ArterRdlista_ENSterkttruet"];
  sublayer4.visible = true;
  sublayer4.erSynlig = true;

  let sublayer5 = modifiedLayers[" 31"].underlag["ArterRdlista_VUSrbar"];
  sublayer5.visible = true;
  sublayer5.erSynlig = true;

  let sublayer6 = modifiedLayers[" 31"].underlag["ArterRdlista_NTNrtruet"];
  sublayer6.visible = true;
  sublayer6.erSynlig = true;

  let sublayer7 = modifiedLayers[" 31"].underlag["ArterRdlista_DDDatamangel"];
  sublayer7.visible = true;
  sublayer7.erSynlig = true;

  let allcategories = modifiedLayers[" 31"].allcategorieslayer;
  allcategories.erSynlig = true;
  allcategories.visible = true;

  const { getAllByRole, getByText } = renderTegnforklaringLink({
    layers: modifiedLayers
  });
  getByText("Tegnforklaring");

  // Button is disabled
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(2);
  expect(buttons[0]).toHaveAttribute("aria-disabled", "false"); // Mui List Item
  expect(buttons[1]).not.toBeDisabled(); // Mui Icon Button

  // Badge
  let badge = getByText("6");
  expect(badge).toHaveClass("MuiBadge-colorPrimary");
});
