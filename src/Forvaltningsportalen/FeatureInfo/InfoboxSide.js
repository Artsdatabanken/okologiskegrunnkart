import React from "react";
import {
  Close,
  MyLocation,
  Place,
  Home,
  Flag,
  Terrain
} from "@material-ui/icons";
import TooltipRight from "../../Common/TooltipRight";
import CustomSwitch from "../../Common/CustomSwitch";
import "../../style/infobox.css";
import DetailedInfo from "./DetailedInfo";

const InfoBox = ({
  coordinates_area,
  layerevent,
  getBackendData,
  handleInfobox,
  onUpdateLayerProp,
  layersResult,
  allLayersResult,
  valgteLag,
  sted,
  adresse,
  resultat,
  kartlag,
  showExtensiveInfo,
  handleExtensiveInfo
}) => {
  const coords = `${Math.round(coordinates_area.lat * 10000) /
    10000}° N  ${Math.round(coordinates_area.lng * 10000) / 10000}° Ø`;

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

  const toggleAllLayers = () => {
    const fetchData = !showExtensiveInfo;
    handleExtensiveInfo(!showExtensiveInfo);
    if (fetchData) {
      getBackendData(coordinates_area.lng, coordinates_area.lat, layerevent);
    }
  };

  return (
    <div className="infobox-container-side">
      <div className="infobox-side">
        <div className="infobox-title-wrapper">
          <div className="infobox-title-content">
            <TooltipRight placement="right" title="Sted / Områdetype">
              <MyLocation />
            </TooltipRight>
            <div className="infobox-title-text">
              <div className="infobox-title-text-primary">
                {`${sted ? sted.komplettskrivemåte[0] : "-"}`}
              </div>
              <div className="infobox-title-text-secondary">
                {`${sted ? sted.navneobjekttype : "-"}`}
              </div>
            </div>
          </div>
          <button
            tabIndex="0"
            className="close-infobox-button"
            onClick={e => {
              handleInfobox(false);
            }}
          >
            <Close />
          </button>
        </div>

        {sted && (
          <div className="infobox-content">
            <div className="infobox-text-wrapper">
              <TooltipRight placement="right" title="Fylke / Fylkesnr.">
                <Terrain />
              </TooltipRight>
              <div className="infobox-text-multiple">
                <div className="infobox-text-primary">{sted.fylkesnavn[0]}</div>
                <div className="infobox-text-secondary">
                  {sted.fylkesnummer[0]}
                </div>
              </div>
            </div>
            <div className="infobox-text-wrapper">
              <TooltipRight placement="right" title="Kommune / Kommunenr.">
                <Flag />
              </TooltipRight>
              <div className="infobox-text-multiple">
                <div className="infobox-text-primary">
                  {sted.kommunenavn[0]}
                </div>
                <div className="infobox-text-secondary">
                  {sted.kommunenummer[0]}
                </div>
              </div>
            </div>
            <div className="infobox-text-wrapper">
              <TooltipRight
                placement="right"
                title="Adresse / Gårdsnr. / Bruksnr."
              >
                <Home />
              </TooltipRight>
              <div className="infobox-text-multiple">
                <div className="infobox-text-primary">
                  {hentAdresse(adresse)}
                </div>
                <div className="infobox-text-secondary">
                  {`${hentGardsnummer(adresse)}/${hentBruksnummer(adresse)}`}
                </div>
              </div>
            </div>
            <div className="infobox-text-wrapper">
              <TooltipRight placement="right" title="Koordinater">
                <Place />
              </TooltipRight>
              <div className="infobox-text-primary">
                {coordinates_area ? coords : "--° N --° Ø"}
              </div>
            </div>
          </div>
        )}
        <div className="search-layers-button-wrapper">
          <span className="infobox-switch-text">Valgte kartlag</span>
          <CustomSwitch
            tabIndex="0"
            id="search-layers-toggle"
            checked={showExtensiveInfo}
            onChange={toggleAllLayers}
            onKeyDown={e => {
              if (e.keyCode === 13) {
                toggleAllLayers();
              }
            }}
          />
          <span className="infobox-switch-text">Alle kartlag</span>
        </div>
        <DetailedInfo
          showExtensiveInfo={showExtensiveInfo}
          kartlag={showExtensiveInfo ? kartlag : valgteLag}
          coordinates_area={coordinates_area}
          onUpdateLayerProp={onUpdateLayerProp}
          layersResult={showExtensiveInfo ? allLayersResult : layersResult}
          resultat={resultat}
        />
      </div>
    </div>
  );
};

export default InfoBox;
