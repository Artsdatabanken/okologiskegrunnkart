import baseMapSelectorImage from "./BaseMapSelectorImage.png";
import BaseMapSelectorImageGoogle from "./BaseMapSelectorImageGoogle.png";
import React from "react";

const KartVelger = props => {
  const sat = props.aktivtFormat === "google_satellite";
  return (
    <button
      className="change_map_button"
      onClick={() => {
        props.onUpdateLayerProp(
          "bakgrunnskart",
          "kart.aktivtFormat",
          props.aktivtFormat === "google_satellite"
            ? "topo4"
            : "google_satellite"
        );
      }}
    >
      <div className="change_map_text">
        <b>Kart</b>
      </div>
      <img
        alt="basemap preview  "
        src={sat ? baseMapSelectorImage : BaseMapSelectorImageGoogle}
      />
    </button>
  );
};

export default KartVelger;
