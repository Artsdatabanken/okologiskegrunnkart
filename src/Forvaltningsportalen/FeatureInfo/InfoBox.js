import React from "react";

import GeneriskElement from "./GeneriskElement";

const InfoBox = ({
  coordinates_area,
  layerevent,
  getBackendData,
  layersresultat,
  valgteLag
}) => {
  console.log(layersresultat);

  return (
    <div className="infobox">
      Infoboks
      <br />
      {coordinates_area && (
        <span className="coordinates">
          lng: {coordinates_area.lng} lat: {coordinates_area.lat}
          <br />
        </span>
      )}
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
    </div>
  );
};

export default InfoBox;
