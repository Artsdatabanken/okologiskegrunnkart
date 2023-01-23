import React from "react";
import { cleanup, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import Tegnforklaring from "../../src/Tegnforklaring/Tegnforklaring";
import kartlagMock from "../tools/kartlagMock.json";

afterEach(cleanup);

const kartlag = kartlagMock;

function renderTegnforklaring(args) {
  let defaultprops = {
    layers: kartlag,
    setLegendVisible: () => {},
    legendPosition: "right"
  };

  const props = { ...defaultprops, ...args };
  return render(<Tegnforklaring {...props} />);
}

it("should render one legend when there is an aggregated layer visible", () => {
  let modifiedLayers = JSON.parse(JSON.stringify(kartlag));

  let sublayer1 =
    modifiedLayers[" 31"].underlag["ArterRdlista_Rdlistaarterallekategorier"];
  sublayer1.visible = true;
  sublayer1.erSynlig = true;

  let sublayer2 =
    modifiedLayers[" 31"].underlag["ArterRdlista_RERegionaltutddd"];
  sublayer2.visible = true;

  let sublayer3 = modifiedLayers[" 31"].underlag["ArterRdlista_CRKritisktruet"];
  sublayer3.visible = true;

  let sublayer4 = modifiedLayers[" 31"].underlag["ArterRdlista_ENSterkttruet"];
  sublayer4.visible = true;

  let sublayer5 = modifiedLayers[" 31"].underlag["ArterRdlista_VUSrbar"];
  sublayer5.visible = true;

  let sublayer6 = modifiedLayers[" 31"].underlag["ArterRdlista_NTNrtruet"];
  sublayer6.visible = true;

  let sublayer7 = modifiedLayers[" 31"].underlag["ArterRdlista_DDDatamangel"];
  sublayer7.visible = true;

  let allcategories = modifiedLayers[" 31"].allcategorieslayer;
  allcategories.erSynlig = true;
  allcategories.visible = true;

  const { getAllByRole, getByText } = renderTegnforklaring({
    layers: modifiedLayers
  });
  getByText("Tegnforklaring");
  getByText("Arter - Rødlista");
  getByText("Rødlista arter - alle kategorier");

  // Button is enabled
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(1);
  //expect(buttons[0]).toHaveAttribute("aria-disabled", "false"); // Mui List Item
  expect(buttons[0].ariaDisabled).toBe(undefined);
});

it("should render several legends when there are several sublayers visible", () => {
  let modifiedLayers = JSON.parse(JSON.stringify(kartlag));

  let sublayer1 =
    modifiedLayers[" 31"].underlag["ArterRdlista_RERegionaltutddd"];
  sublayer1.visible = true;
  sublayer1.erSynlig = true;

  let sublayer2 = modifiedLayers[" 31"].underlag["ArterRdlista_CRKritisktruet"];
  sublayer2.visible = true;
  sublayer2.erSynlig = true;

  let sublayer3 = modifiedLayers[" 31"].underlag["ArterRdlista_ENSterkttruet"];
  sublayer3.visible = true;
  sublayer3.erSynlig = true;

  let sublayer4 = modifiedLayers[" 31"].underlag["ArterRdlista_VUSrbar"];
  sublayer4.visible = true;
  sublayer4.erSynlig = true;

  let sublayer5 = modifiedLayers[" 31"].underlag["ArterRdlista_NTNrtruet"];
  sublayer5.visible = true;
  sublayer5.erSynlig = true;

  const { getAllByRole, getByText } = renderTegnforklaring({
    layers: modifiedLayers
  });
  getByText("Tegnforklaring");
  getByText("Arter - Rødlista");
  getByText("RE - Regionalt utdødd");
  getByText("CR - Kritisk truet");
  getByText("EN - Sterkt truet");
  getByText("VU - Sårbar");
  getByText("NT - Nær truet");

  // Button is enabled
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(1);
  //expect(buttons[0]).toHaveAttribute("aria-disabled", "false"); // Mui List Item
  expect(buttons[0].ariaDisabled).toBe(undefined);
});

it("should render legend on the right", () => {
  let modifiedLayers = JSON.parse(JSON.stringify(kartlag));

  let sublayer =
    modifiedLayers[" 31"].underlag["ArterRdlista_RERegionaltutddd"];
  sublayer.visible = true;
  sublayer.erSynlig = true;

  const { container, getByText } = renderTegnforklaring({
    layers: modifiedLayers
  });
  getByText("Tegnforklaring");
  getByText("Arter - Rødlista");
  getByText("RE - Regionalt utdødd");

  // Wrapper is placed on the left
  let wrapper = container.querySelector(".legend-wrapper-right");
  expect(wrapper).not.toBeNull();
  wrapper = container.querySelector(".legend-wrapper-left");
  expect(wrapper).toBeNull();
});

it("should render legend on the left", () => {
  let modifiedLayers = JSON.parse(JSON.stringify(kartlag));

  let sublayer =
    modifiedLayers[" 31"].underlag["ArterRdlista_RERegionaltutddd"];
  sublayer.visible = true;
  sublayer.erSynlig = true;

  const { container, getByText } = renderTegnforklaring({
    layers: modifiedLayers,
    legendPosition: "left"
  });
  getByText("Tegnforklaring");
  getByText("Arter - Rødlista");
  getByText("RE - Regionalt utdødd");

  // Wrapper is placed on the left
  let wrapper = container.querySelector(".legend-wrapper-left");
  expect(wrapper).not.toBeNull();
  wrapper = container.querySelector(".legend-wrapper-right");
  expect(wrapper).toBeNull();
});
