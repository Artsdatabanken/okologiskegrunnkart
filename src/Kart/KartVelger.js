import gebco from "./images/gebco.jpg";
import topo4 from "./images/topo4.jpg";
import topo4graatone from "./images/topo4graatone.jpg";
import flyfoto from "./images/flyfoto.jpg";
import React, { useState } from "react";
import { Map } from "@material-ui/icons";

const tilgjengelige = ["gebco", "topo4", "topo4graatone", "flybilder"];
const tilgjengelige_data = {
  gebco: {
    navn: "GEBCO",
    dataeier: "GEBCO/Kartverket",
    url: "https://www.gebco.net"
  },
  topo4: {
    navn: "Topografisk norgeskart 4",
    dataeier: "Kartverket",
    url: "https://www.kartverket.no"
  },
  topo4graatone: {
    navn: "Topografisk norgeskart 4 Gråtone",
    dataeier: "Kartverket",
    url: "https://www.kartverket.no"
  },
  flybilder: {
    navn: "Norge i bilder",
    dataeier: "Kartverket",
    url: "https://www.kartverket.no"
  }
};
const imgs = [gebco, topo4, topo4graatone, flyfoto];

const KartVelger = ({
  handleSetBakgrunnskart,
  aktivtFormat,
  showSideBar,
  showInfobox,
  isMobile
}) => {
  const [open, setOpen] = useState(false);
  var current = tilgjengelige.indexOf(aktivtFormat);

  const mapButtonClass = () => {
    let name = "change_map_buttons";
    if (showSideBar || (isMobile && showInfobox)) {
      name = name + " side-bar-open";
    }
    if (showInfobox) name = name + " infobox-open";
    if (!isMobile) name = name + " margin-animation";
    return name;
  };

  const mapRefClass = () => {
    let name = "map_ref";
    if (showSideBar || (isMobile && showInfobox)) {
      name = name + " side-bar-open";
    }
    if (showInfobox) name = name + " infobox-open";
    if (!isMobile) name = name + " margin-animation";
    return name;
  };

  return (
    <>
      <div
        className={mapButtonClass()}
        style={{
          background: open ? "white" : "transparent",
          borderColor: open ? "#9f9f9f" : "transparent"
        }}
      >
        <button
          className="change_map_icon"
          onMouseEnter={() => {
            handleSetBakgrunnskart("kart.aktivtFormat", tilgjengelige[current]);
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
                  handleSetBakgrunnskart("kart.aktivtFormat", element);
                }}
              >
                <span>{element}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className={mapRefClass()}>
        <div className="map-active-format-text">
          {`${tilgjengelige_data[aktivtFormat].navn} |`}
        </div>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={tilgjengelige_data[aktivtFormat].url}
        >
          {tilgjengelige_data[aktivtFormat].dataeier}
        </a>
      </div>
    </>
  );
};

export default KartVelger;
