import gebco from "./gebco.jpg";
import topo4 from "./topo4.jpg";
import topo4graatone from "./topo4graatone.jpg";
import React, { useState } from "react";
import { Map } from "@material-ui/icons";

const tilgjengelige = ["gebco", "topo4", "topo4graatone"];
const imgs = [gebco, topo4, topo4graatone];

const KartVelger = props => {
  const [open, setOpen] = useState(false);
  var current = tilgjengelige.indexOf(props.aktivtFormat);
  return (
    <div
      className="change_map_buttons"
      style={{
        background: open ? "white" : "transparent",
        borderColor: open ? "#9f9f9f" : "transparent"
      }}
    >
      <button
        className="change_map_icon"
        onMouseEnter={() => {
          props.onUpdateLayerProp("kart.aktivtFormat", tilgjengelige[current]);
        }}
        onClick={() => {
          setOpen(!open);
        }}
        style={{
          backgroundImage: "url('" + imgs[current] + "')",
          backgroundSize: "cover"
        }}
      >
        <Map />
      </button>
      {open && (
        <div>
          {tilgjengelige.map((element, index) => (
            <button
              key={element}
              style={{
                backgroundImage: "url('" + imgs[index] + "')",
                backgroundSize: "cover",
                borderColor: index === current ? "black" : "#9f9f9f"
              }}
              className="change_map_button"
              onClick={() => {
                props.onUpdateLayerProp("kart.aktivtFormat", element);
              }}
            >
              <span>{element}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default KartVelger;
