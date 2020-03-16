import baseMapSelectorImage from "./BaseMapSelectorImage.png";
//import BaseMapSelectorImageGoogle from "./BaseMapSelectorImageGoogle.png";
import React from "react";
import bakgrunnskart from "../AppSettings/bakgrunnskarttema";

const tilgjengelige = ["gebco", "topo4", "topo4graatone", "fjellskygge"];

const KartVelger = props => {
  var current = tilgjengelige.indexOf(props.aktivtFormat);
  return (
    <button
      className="change_map_button"
      onMouseEnter={() => {
        props.onUpdateLayerProp(
          "bakgrunnskart",
          "kart.aktivtFormat",
          tilgjengelige[current]
        );
      }}
      onClick={() => {
        current = (current + 1) % tilgjengelige.length;
        props.onUpdateLayerProp(
          "bakgrunnskart",
          "kart.aktivtFormat",
          tilgjengelige[current]
        );
      }}
    >
      <div className="change_map_text">
        {true ? (
          bakgrunnskart.kart.format[tilgjengelige[current]].tittel // TODO: Temp, Bare for å vise at noe skjer
        ) : (
          <b>Kart</b>
        )}
      </div>
      <div style={{ fontSize: 8, position: "absolute" }}></div>
      <img alt="basemap preview" src={baseMapSelectorImage} />
    </button>
  );
};

export default KartVelger;
