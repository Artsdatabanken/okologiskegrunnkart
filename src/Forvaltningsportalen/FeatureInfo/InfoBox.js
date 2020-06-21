import React from "react";
import {
  Close as CloseIcon,
  MyLocation,
  Terrain,
  Place,
  Home
} from "@material-ui/icons";
import GeneriskElement from "./GeneriskElement";
import "../../style/infobox.css";

const InfoBox = ({
  coordinates_area,
  layerevent,
  getBackendData,
  handleInfobox,
  onUpdateLayerProp,
  layersResult,
  valgteLag,
  sted,
  adresse
}) => {
  const coords = `${Math.round(coordinates_area.lat * 10000) /
    10000}° N ${Math.round(coordinates_area.lng * 10000) / 10000}° Ø`;

  // Kommune kommer når ting er slått sammen, bruker ikke tid på det før da.

  const hentAdresse = adresse => {
    if (adresse && adresse.adressetekst) {
      return adresse.adressetekst;
    }
    return "-";
  };

  const hentGardsnummer = adresse => {
    if (adresse && adresse.gardsnummer) {
      return adresse.gardsnummer;
    }
    return "-";
  };

  const hentBruksnummer = adresse => {
    if (adresse && adresse.bruksnummer) {
      return adresse.bruksnummer;
    }
    return "-";
  };

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
          <CloseIcon />
        </button>

        {sted && (
          <span className="infotitle">
            {sted && (
              <span>
                <span className="text_type">
                  <MyLocation />
                  {`Sted: `}
                  <b>{`${sted.komplettskrivemåte[0]}`}</b>
                </span>
                <span className="text_type">
                  <Terrain />
                  {`Områdetype: `}
                  <b>{`${sted.navneobjekttype}`}</b>
                </span>
                <span className="text_type">
                  <Place />
                  {`Fylke: `}
                  <b>{sted.fylkesnavn[0]}</b>
                </span>
                <span className="text_type">
                  <Place />
                  {`Kommune: `}
                  <b>{sted.kommunenavn[0]}</b>
                </span>
                <span className="text_type">
                  <Home />
                  {`Matrikkel: `}
                  <b>
                    {`${sted.kommunenummer}/${hentGardsnummer(
                      adresse
                    )}/${hentBruksnummer(adresse)}`}
                  </b>
                </span>
                <span className="text_type">
                  <Home />
                  {`Adresse: `}
                  <b>{hentAdresse(adresse)}</b>
                </span>
              </span>
            )}
          </span>
        )}
        {coordinates_area && <div className="coordinates">{coords}</div>}
        <div className="window_scrollable">
          {layersResult !== undefined &&
            Object.keys(layersResult).map(key => {
              return (
                <GeneriskElement
                  onUpdateLayerProp={onUpdateLayerProp}
                  coordinates_area={coordinates_area}
                  key={key}
                  kartlag={valgteLag}
                  resultat={layersResult[key]}
                  element={key}
                />
              );
            })}
        </div>
        <div className="search-layers-button-wrapper">
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
    </div>
  );
};

export default InfoBox;
