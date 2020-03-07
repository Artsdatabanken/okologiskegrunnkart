import baseMapSelectorImage from "./BaseMapSelectorImage.png";
import React from "react";

const tilgjengelige = ["gebco", "topo4", "topo4graatone", "fjellskygge"];

const KartVelger = props => {
  return (
    <button
      className="change_map_button"
      onClick={() => {
        const current = tilgjengelige.indexOf(props.aktivtFormat);
        const next = (current + 1) % tilgjengelige.length;
        props.onUpdateLayerProp(
          "bakgrunnskart",
          "kart.aktivtFormat",
          tilgjengelige[next]
        );
      }}
    >
      <div className="change_map_text">
        <b>Kart</b>
      </div>
      <img alt="basemap preview" src={baseMapSelectorImage} />
    </button>
  );
};

export default KartVelger;
