import React from "react";
import { Close } from "@material-ui/icons";
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
    <div
      className={`small-infobox-container${showSideBar ? " tiny-box" : ""}`}
      onClick={e => {
        e.preventDefault();
        handleInfobox(true);
      }}
      onKeyPress={() => console.log("Here")}
      role="button"
      tabIndex="-1"
    >
      <div
        className={`small-infobox-title-wrapper${
          showSideBar ? " tiny-box" : ""
        }`}
      >
        <div className="small-infobox-title-content">
          <div className="small-infobox-title-text">
            {`${sted ? sted.komplettskrivemåte[0] : "-"}`}
          </div>
        </div>
        <button
          tabIndex="0"
          className="close-small-infobox-button-wrapper"
          onClick={e => {
            e.preventDefault();
            handleSmallInfobox(false);
            handleInfobox(false);
          }}
        >
          <div className="close-small-infobox-button">
            <Close />
          </div>
        </button>
      </div>
      {!showSideBar && (
        <div className="small-infobox-body">
          {sted && (
            <div className="small-infobox-content">
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
              <div className="small-infobox-text-wrapper">
                <div className="small-infobox-text-primary">
                  {coordinates_area ? coords : "--° N --° Ø"}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InfoBoxSmall;
