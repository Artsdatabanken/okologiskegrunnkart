import React from "react";
import { Close, Fullscreen } from "@material-ui/icons";
import "../../style/infobox.css";

const InfoBoxSmall = ({
  coordinates_area,
  sted,
  handleSmallInfobox,
  handleInfobox,
  showSideBar
}) => {
  const coords = `${Math.round(coordinates_area.lat * 10000) /
    10000}° N  ${Math.round(coordinates_area.lng * 10000) / 10000}° Ø`;

  return (
    <div className={`small-infobox-container${showSideBar ? " tiny-box" : ""}`}>
      <div
        className={`small-infobox-title-wrapper${
          showSideBar ? " tiny-box" : ""
        }`}
      >
        <div
          className="small-infobox-title-content"
          onClick={() => handleInfobox(true)}
          onKeyPress={() => handleInfobox(true)}
          role="button"
          tabIndex="-1"
        >
          <div className="small-infobox-title-text">
            {`${sted ? sted.komplettskrivemåte[0] : "-"}`}
          </div>
        </div>
        <div
          className="fullscreen-small-infobox-button"
          onClick={() => handleInfobox(true)}
          onKeyPress={() => handleInfobox(true)}
          role="button"
          tabIndex="-1"
        >
          <Fullscreen />
        </div>
        <button
          tabIndex="0"
          className="close-small-infobox-button-wrapper"
          onClick={() => {
            handleSmallInfobox(false);
            handleInfobox(false);
          }}
        >
          <Close />
        </button>
      </div>
      <div
        className={`small-infobox-body${showSideBar ? " tiny-box" : ""}`}
        onClick={() => handleInfobox(true)}
        onKeyPress={() => handleInfobox(true)}
        role="button"
        tabIndex="-1"
      >
        <div className="small-infobox-content">
          {sted && (
            <div className="small-infobox-text-wrapper">
              <div className="small-infobox-text-multiple">
                <div className="small-infobox-text-primary">
                  {sted.kommunenavn[0]}
                </div>
                <div className="small-infobox-text-secondary">
                  {sted.kommunenummer[0]}
                </div>
              </div>
            </div>
          )}
          <div className="small-infobox-text-wrapper">
            <div className="small-infobox-text-primary">
              {coordinates_area ? coords : "--° N --° Ø"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoBoxSmall;
