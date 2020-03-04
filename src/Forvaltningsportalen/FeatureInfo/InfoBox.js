import React from "react";
import LocationSearching from "@material-ui/icons/LocationSearching";
import GeneriskElement from "./GeneriskElement";
import "style/infobox.css";

const InfoBox = ({
  coordinates_area,
  layerevent,
  getBackendData,
  layersresultat,
  valgteLag,
  sted
}) => {
  const coords = `${Math.round(coordinates_area.lat * 10000) /
    10000}° N ${Math.round(coordinates_area.lng * 10000) / 10000}° Ø`;

  // Kommune kommer når ting er slått sammen, bruker ikke tid på det før da.

  return (
    <div className="infobox_container">
      <div className="infobox">
        {sted && (
          <span className="infotitle">
            <LocationSearching />
            {sted && sted.navn}
          </span>
        )}
        <br />
        {coordinates_area && (
          <span className="coordinates">
            {coords}
            <br />
          </span>
        )}

        {layersresultat !== undefined &&
          Object.keys(layersresultat).map(key => {
            return (
              <GeneriskElement
                key={key}
                kartlag={valgteLag}
                resultat={layersresultat[key]}
                element={key}
              />
            );
          })}

        <button
          className="search_layers"
          title="Marker tool"
          alt="Marker tool"
          onClick={e => {
            getBackendData(
              coordinates_area.lng,
              coordinates_area.lat,
              layerevent
            );
          }}
        >
          Søk informasjon for alle lag i dette punktet
        </button>
      </div>
    </div>
  );
};

export default InfoBox;
