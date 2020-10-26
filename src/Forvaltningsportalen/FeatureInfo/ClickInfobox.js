import React, { useState, useCallback } from "react";
import {
  Place,
  Home,
  Flag,
  Terrain,
  ExpandLess,
  ExpandMore
} from "@material-ui/icons";
import { ListItem, ListItemText, Collapse } from "@material-ui/core";
import CustomTooltip from "../../Common/CustomTooltip";
import SmallSwitch from "../../Common/SmallSwitch";
import "../../style/infobox.css";
import ResultsList from "./ResultsList";
import DetailedResults from "./DetailedResults";

const ClickInfobox = ({
  coordinates_area,
  getBackendData,
  layersResult,
  allLayersResult,
  valgteLag,
  sted,
  adresse,
  matrikkel,
  elevation,
  resultat,
  kartlag,
  showExtensiveInfo,
  loadingFeatures,
  infoboxDetailsVisible,
  setInfoboxDetailsVisible,
  setLayerInfoboxDetails,
  sortKey,
  tagFilter,
  matchAllFilters,
  showPropertyGeom,
  handlePropertyGeom,
  showFylkeGeom,
  handleFylkeGeom,
  showKommuneGeom,
  handleKommuneGeom,
  showMarkerOptions,
  setShowMarkerOptions
}) => {
  const [resultLayer, setResultLayer] = useState(null);
  const [primaryText, setPrimaryText] = useState(null);
  const [secondaryText, setSecondaryText] = useState(null);
  const [listResults, setListResults] = useState(null);
  const [numberResults, setNumberResults] = useState(null);
  const [infoboxScroll, setInfoboxScroll] = useState(0);
  const [faktaark, setFaktaark] = useState(null);

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

  const hentMatrikkel = matrikkel => {
    if (!matrikkel) return "- / -";
    return matrikkel;
  };

  const showDetailedResults = useCallback(
    (
      layer,
      listResults,
      primaryText,
      secondaryText,
      numberResults,
      faktaarkURL
    ) => {
      // Remember scroll position of infobox
      if (!infoboxDetailsVisible) {
        const wrapper = document.querySelector(".infobox-side");
        setInfoboxScroll(wrapper.scrollTop);
      }

      setInfoboxDetailsVisible(true);
      setResultLayer(kartlag[layer.id]);
      setListResults(listResults);
      setPrimaryText(primaryText);
      setSecondaryText(secondaryText);
      setNumberResults(numberResults);
      setLayerInfoboxDetails(kartlag[layer.id]);
      setFaktaark(faktaarkURL);
    },
    [
      infoboxDetailsVisible,
      setInfoboxDetailsVisible,
      setLayerInfoboxDetails,
      kartlag
    ]
  );

  const hideDetailedResults = () => {
    setResultLayer(null);
    setListResults(null);
    setPrimaryText(null);
    setSecondaryText(null);
    setNumberResults(null);
    setLayerInfoboxDetails(null);
    setFaktaark(null);

    // Set scroll position to original value
    let wrapper = document.querySelector(".infobox-side");
    setTimeout(() => {
      setInfoboxDetailsVisible(false);
      wrapper.scrollTop = infoboxScroll;
    }, 5);
  };

  return (
    <div
      className={`infobox-side${infoboxDetailsVisible ? " show-details" : ""}`}
    >
      {infoboxDetailsVisible && (
        <DetailedResults
          resultLayer={resultLayer}
          listResults={listResults}
          primaryText={primaryText}
          secondaryText={secondaryText}
          numberResults={numberResults}
          hideDetailedResults={hideDetailedResults}
          coordinates_area={coordinates_area}
          faktaark={faktaark}
        />
      )}
      <div className={infoboxDetailsVisible ? "infobox-content-hidden" : ""}>
        <ListItem
          id="infobox-main-content-button"
          button
          onClick={e => {
            setShowMarkerOptions(!showMarkerOptions);
          }}
        >
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
                <div className="infobox-text-primary">
                  {hentAdresse(adresse)}
                </div>
                <div className="infobox-text-secondary">
                  {hentMatrikkel(matrikkel)}
                </div>
              </div>
            </div>
            <div className="infobox-text-wrapper">
              <CustomTooltip placement="right" title="Koordinater / Høyde">
                <Place />
              </CustomTooltip>
              <div className="infobox-text-multiple">
                <div className="infobox-text-primary">
                  {coordinates_area ? coords : "--° N --° Ø"}
                </div>
                <div className="infobox-text-tertyary">
                  {elevation ? elevation + " moh" : "-"}
                </div>
              </div>
            </div>
          </div>
        </ListItem>
        <div className="infobox-options-listitem-wrapper">
          <ListItem
            id="infobox-options-listitem"
            button
            onClick={e => {
              setShowMarkerOptions(!showMarkerOptions);
            }}
          >
            <ListItemText primary="Marker grenser" />
            {showMarkerOptions ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
        </div>

        <Collapse
          in={showMarkerOptions}
          timeout="auto"
          unmountOnExit
          // Underelementet
        >
          <div className="infobox-options-container">
            <div className="infobox-switch-container">
              <SmallSwitch
                tabIndex="0"
                id="show-property-toggle"
                checked={showFylkeGeom}
                onChange={handleFylkeGeom}
                onKeyDown={e => {
                  if (e.keyCode === 13) {
                    handleFylkeGeom();
                  }
                }}
              />
              <span className="infobox-switch-text">Fylke</span>
            </div>
            <div className="infobox-switch-container">
              <SmallSwitch
                tabIndex="0"
                id="show-property-toggle"
                checked={showKommuneGeom}
                onChange={handleKommuneGeom}
                onKeyDown={e => {
                  if (e.keyCode === 13) {
                    handleKommuneGeom();
                  }
                }}
              />
              <span className="infobox-switch-text">Kommune</span>
            </div>
            <div className="infobox-switch-container">
              <SmallSwitch
                tabIndex="0"
                id="show-property-toggle"
                checked={showPropertyGeom}
                onChange={handlePropertyGeom}
                onKeyDown={e => {
                  if (e.keyCode === 13) {
                    handlePropertyGeom();
                  }
                }}
              />
              <span className="infobox-switch-text">Eiendom</span>
            </div>
          </div>
        </Collapse>

        <ResultsList
          showExtensiveInfo={showExtensiveInfo}
          kartlag={showExtensiveInfo ? kartlag : valgteLag}
          coordinates_area={coordinates_area}
          layersResult={showExtensiveInfo ? allLayersResult : layersResult}
          resultat={resultat}
          loadingFeatures={loadingFeatures}
          infoboxDetailsVisible={infoboxDetailsVisible}
          resultLayer={resultLayer}
          showDetailedResults={showDetailedResults}
          sortKey={sortKey}
          tagFilter={tagFilter}
          matchAllFilters={matchAllFilters}
          getBackendData={getBackendData}
        />
      </div>
    </div>
  );
};

export default ClickInfobox;
