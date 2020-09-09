import React, { useState } from "react";
import { Place, Home, Flag, Terrain } from "@material-ui/icons";
import CustomTooltip from "../../Common/CustomTooltip";
import CustomSwitch from "../../Common/CustomSwitch";
import "../../style/infobox.css";
import ResultsList from "./ResultsList";
import DetailedResults from "./DetailedResults";

const ClickInfobox = ({
  coordinates_area,
  layerevent,
  getBackendData,
  layersResult,
  allLayersResult,
  valgteLag,
  sted,
  adresse,
  resultat,
  kartlag,
  showExtensiveInfo,
  loadingFeatures
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [resultLayer, setResultLayer] = useState(null);
  const [primaryText, setPrimaryText] = useState(null);
  const [secondaryText, setSecondaryText] = useState(null);
  const [numberResults, setNumberResults] = useState(null);

  const latitude = coordinates_area ? coordinates_area.lat : 0;
  const longitude = coordinates_area ? coordinates_area.lng : 0;
  const coords = `${Math.round(latitude * 10000) / 10000}° N  ${Math.round(
    longitude * 10000
  ) / 10000}° Ø`;

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
    if (coordinates_area && coordinates_area.lng && coordinates_area.lat) {
      getBackendData(coordinates_area.lng, coordinates_area.lat, layerevent);
    }
  };

  const showDetailedResults = (
    layer,
    primaryText,
    secondaryText,
    numberResults
  ) => {
    setShowDetails(true);
    // setResultLayer(layer);
    setResultLayer(kartlag[layer.id]);
    setPrimaryText(primaryText);
    setSecondaryText(secondaryText);
    setNumberResults(numberResults);
    console.log("primaryText", primaryText);
    console.log("secondaryText", secondaryText);
  };

  const hideDetailedResults = () => {
    setShowDetails(false);
    setResultLayer(null);
    setPrimaryText(null);
    setSecondaryText(null);
    setNumberResults(null);
  };

  return (
    <div className={`infobox-side${showDetails ? " show-details" : ""}`}>
      {showDetails && (
        <DetailedResults
          resultLayer={resultLayer}
          primaryText={primaryText}
          secondaryText={secondaryText}
          numberResults={numberResults}
          hideDetailedResults={hideDetailedResults}
        />
      )}
      <div className={showDetails ? "infobox-content-hidden" : ""}>
        <div className="infobox-content">
          <div className="infobox-text-wrapper">
            <CustomTooltip placement="right" title="Fylke / Fylkesnr.">
              <Terrain />
            </CustomTooltip>
            <div className="infobox-text-multiple">
              <div className="infobox-text-primary">
                {sted ? sted.fylkesnavn[0] : "-"}
              </div>
              <div className="infobox-text-secondary">
                {sted ? sted.fylkesnummer[0] : "-"}
              </div>
            </div>
          </div>
          <div className="infobox-text-wrapper">
            <CustomTooltip placement="right" title="Kommune / Kommunenr.">
              <Flag />
            </CustomTooltip>
            <div className="infobox-text-multiple">
              <div className="infobox-text-primary">
                {sted ? sted.kommunenavn[0] : "-"}
              </div>
              <div className="infobox-text-secondary">
                {sted ? sted.kommunenummer[0] : "-"}
              </div>
            </div>
          </div>
          <div className="infobox-text-wrapper">
            <CustomTooltip
              placement="right"
              title="Adresse / Gårdsnr. / Bruksnr."
            >
              <Home />
            </CustomTooltip>
            <div className="infobox-text-multiple">
              <div className="infobox-text-primary">{hentAdresse(adresse)}</div>
              <div className="infobox-text-secondary">
                {`${hentGardsnummer(adresse)}/${hentBruksnummer(adresse)}`}
              </div>
            </div>
          </div>
          <div className="infobox-text-wrapper">
            <CustomTooltip placement="right" title="Koordinater">
              <Place />
            </CustomTooltip>
            <div className="infobox-text-primary">
              {coordinates_area ? coords : "--° N --° Ø"}
            </div>
          </div>
        </div>
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
        <ResultsList
          showExtensiveInfo={showExtensiveInfo}
          kartlag={showExtensiveInfo ? kartlag : valgteLag}
          coordinates_area={coordinates_area}
          layersResult={showExtensiveInfo ? allLayersResult : layersResult}
          resultat={resultat}
          loadingFeatures={loadingFeatures}
          showDetails={showDetails}
          resultLayer={resultLayer}
          showDetailedResults={showDetailedResults}
        />
      </div>
    </div>
  );
};

export default ClickInfobox;
