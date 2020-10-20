import React, { useState, useCallback } from "react";
import {
  Place,
  Home,
  Flag,
  Terrain,
  ExpandLess,
  ExpandMore
} from "@material-ui/icons";
import {
  ListItem,
  Collapse,
  RadioGroup,
  FormControlLabel
} from "@material-ui/core";
import CustomTooltip from "../../Common/CustomTooltip";
import CustomSwitch from "../../Common/CustomSwitch";
import CustomRadio from "../../Common/CustomRadio";
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
  handleKommuneGeom
}) => {
  const [resultLayer, setResultLayer] = useState(null);
  const [primaryText, setPrimaryText] = useState(null);
  const [secondaryText, setSecondaryText] = useState(null);
  const [listResults, setListResults] = useState(null);
  const [numberResults, setNumberResults] = useState(null);
  const [infoboxScroll, setInfoboxScroll] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [radioValue, setRadioValue] = useState("none");

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

  const handleRadioChange = event => {
    setRadioValue(event.target.value);
  };

  // const handleRadioKey = event => {
  //   if (event.keyCode === 27) {
  //     // Enter
  //     setRadioValue(event.target.value);
  //   }
  //   if (event.keyCode === 40) {
  //     // Arrow down
  //     console.log("Arrow down")
  //   }
  //   // Arrow up
  //   if (event.keyCode === 38) {
  //     console.log("Arrow up")
  //   }
  // };

  const showDetailedResults = useCallback(
    (layer, listResults, primaryText, secondaryText, numberResults) => {
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
        />
      )}
      <div className={infoboxDetailsVisible ? "infobox-content-hidden" : ""}>
        <ListItem
          id="infobox-main-content-button"
          button
          onClick={e => {
            setShowOptions(!showOptions);
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
            <div className="infobox-text-wrapper infobox-text-last">
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
            <div className="infobox-expand-icon">
              {showOptions ? (
                <ExpandLess color="primary" />
              ) : (
                <ExpandMore color="primary" />
              )}
            </div>
          </div>
        </ListItem>

        <Collapse
          in={showOptions}
          timeout="auto"
          unmountOnExit
          // Underelementet
        >
          <div className="infobox-options-container">
            <div className="infobox-switch-container">
              <CustomSwitch
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
              <span className="infobox-switch-text">Marker fylke</span>
            </div>
            <div className="infobox-switch-container">
              <CustomSwitch
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
              <span className="infobox-switch-text">Marker kommune</span>
            </div>
            <div className="infobox-switch-container">
              <CustomSwitch
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
              <span className="infobox-switch-text">Marker eiendom</span>
            </div>
            <div className="infobox-radio-buttons-title">
              Bruk automatisk som polygon
            </div>
            <div className="infobox-radio-buttons-container">
              <RadioGroup
                aria-label="export"
                name="export1"
                value={radioValue}
                onChange={handleRadioChange}
              >
                <FormControlLabel
                  id="infobox-radio-label"
                  value="none"
                  control={<CustomRadio />}
                  label="Ingen"
                />
                <FormControlLabel
                  id="infobox-radio-label"
                  value="fylke"
                  control={<CustomRadio />}
                  label="Fylke"
                />
                <FormControlLabel
                  id="infobox-radio-label"
                  value="kommune"
                  control={<CustomRadio />}
                  label="Kommune"
                />
                <FormControlLabel
                  id="infobox-radio-label"
                  value="eiendom"
                  control={<CustomRadio />}
                  label="Eiendom"
                />
              </RadioGroup>
            </div>
          </div>
        </Collapse>
        {/* <div className="show-property-button-wrapper">
          <span className="infobox-switch-text">Gjem eiendom</span>
          <CustomSwitch
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
          <span className="infobox-switch-text">Vis eiendom</span>
        </div> */}
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
