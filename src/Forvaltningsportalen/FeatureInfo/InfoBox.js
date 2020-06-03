import React from "react";
import { Close, MyLocation, Terrain, Place } from "@material-ui/icons";
import GeneriskElement from "./GeneriskElement";
import "../../style/infobox.css";

const InfoBox = ({
  coordinates_area,
  layerevent,
  getBackendData,
  handleInfobox,
  onUpdateLayerProp,
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
        <button
          tabIndex="0"
          className="close_button"
          onClick={e => {
            handleInfobox(false);
          }}
        >
          <Close />
        </button>

        {sted && (
          <span className="infotitle">
            {sted && (
              <span>
                <span className="text_type">
                  <MyLocation />
                  Sted: <b>{sted.komplettskrivemåte[0]}</b>
                </span>
                <span className="text_type">
                  <Terrain />
                  Områdetype: <b>{sted.navneobjekttype}</b>
                </span>
                <span className="text_type">
                  <Place />
                  Kommune: <b>{sted.kommunenavn[0]}</b>{" "}
                </span>
                <span className="text_type">
                  <Place />
                  Fylke: <b>{sted.fylkesnavn[0]}</b>{" "}
                </span>
              </span>
            )}
          </span>
        )}
        <br />
        {coordinates_area && (
          <span className="coordinates">
            {coords}
            <br />
          </span>
        )}
        <div className="window_scrollable">
          {layersresultat !== undefined &&
            Object.keys(layersresultat).map(key => {
              return (
                <GeneriskElement
                  onUpdateLayerProp={onUpdateLayerProp}
                  coordinates_area={coordinates_area}
                  key={key}
                  kartlag={valgteLag}
                  resultat={layersresultat[key]}
                  element={key}
                />
              );
            })}
        </div>
        <button
          tabIndex="0"
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
