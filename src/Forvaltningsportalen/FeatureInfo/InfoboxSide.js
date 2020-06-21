import React from "react";
import {
  Close,
  MyLocation,
  Place,
  Home,
  Flag,
  Terrain,
  Layers
} from "@material-ui/icons";
import {
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  Switch,
  ListItemText
} from "@material-ui/core";
import CustomTooltip from "../../Common/CustomTooltip";
import CustomSwitch from "../../Common/CustomSwitch";
import "../../style/infobox.css";
import DetailedInfo from "./DetailedInfo";
import LoadingPlaceholder from "./LoadingPlaceholder";

const InfoBox = ({
  coordinates_area,
  layerevent,
  getBackendData,
  handleInfobox,
  onUpdateLayerProp,
  layersResult,
  valgteLag,
  sted,
  adresse,
  resultat,
  kartlag,
  showExtensiveInfo: showAllLayers,
  handleExtensiveInfo
}) => {
  const coords = `${Math.round(coordinates_area.lat * 10000) /
    10000}° N  ${Math.round(coordinates_area.lng * 10000) / 10000}° Ø`;

  const hentAdresse = adresse => {
    if (adresse.loading) return <LoadingPlaceholder />;

    if (!adresse || !adresse.adressetekst) return "Ingen gateadresse";
    return adresse.adressetekst;
  };

  const hentGardsnummer = adresse => {
    if (adresse.loading) return <LoadingPlaceholder />;

    if (!adresse.gardsnummer) return "?";
    return adresse.gardsnummer + "/" + adresse.bruksnummer;
  };

  const toggleAllLayers = () => {
    const fetchData = !showAllLayers;
    handleExtensiveInfo(!showAllLayers);
    if (fetchData) {
      getBackendData(coordinates_area.lng, coordinates_area.lat, layerevent);
    }
  };

  let title = "Ingen kartlag valgt";
  const emptyKartlag =
    Object.keys(kartlag).length === 0 && kartlag.constructor === Object;
  if (showAllLayers && !emptyKartlag) {
    title = "Resultat fra alle kartlag";
  } else if (!showAllLayers && !emptyKartlag) {
    title = "Resultat fra valgte kartlag";
  }

  return (
    <div className="infobox-container-side">
      <div className="infobox-side">
        <div className="layer-results-scrollable-side">
          <div className="infobox-title-wrapper">
            <div className="infobox-title-content">
              <CustomTooltip placement="right" title="Sted / Områdetype">
                {false ? (
                  <MyLocation />
                ) : (
                  <img
                    width={32}
                    height={48}
                    style={{ transform: "rotate(-15deg)" }}
                    src="/marker/Location-marker.png"
                  />
                )}
              </CustomTooltip>
              <div className="infobox-title-text">
                <div className="infobox-title-text-primary">
                  {`${sted ? sted.komplettskrivemåte[0] : "-"}`}
                </div>
                <div className="infobox-title-text-secondary">
                  {`${sted ? sted.navneobjekttype : "-"}`}
                </div>
              </div>
            </div>
            <IconButton
              tabIndex="0"
              className="close-infobox-button"
              onClick={e => {
                handleInfobox(false);
              }}
            >
              <Close style={{ color: "rgba(255,255,255,0.9)" }} />
            </IconButton>
          </div>

          {sted && (
            <div className="infobox-content">
              <div className="infobox-text-wrapper">
                <CustomTooltip placement="right" title="Fylke / Fylkesnr.">
                  <Terrain />
                </CustomTooltip>
                <div className="infobox-text-multiple">
                  <div className="infobox-text-primary">
                    {sted.fylkesnavn[0]}
                  </div>
                  <div className="infobox-text-secondary">
                    {sted.fylkesnummer[0]}
                  </div>
                </div>
              </div>
              <div className="infobox-text-wrapper">
                <CustomTooltip placement="right" title="Kommune / Kommunenr.">
                  <Flag />
                </CustomTooltip>
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
                    {hentGardsnummer(adresse)}
                  </div>
                </div>
              </div>
              <div className="infobox-text-wrapper">
                <CustomTooltip placement="right" title="Koordinater">
                  <Place />
                </CustomTooltip>
                <div className="infobox-text-primary">{coords}</div>
              </div>
            </div>
          )}
          <List>
            <ListItem>
              <ListItemIcon>
                <Layers />
              </ListItemIcon>
              <ListItemText primary={title}></ListItemText>
              <ListItemSecondaryAction>
                <Switch
                  checked={showAllLayers}
                  onChange={toggleAllLayers}
                ></Switch>
                {false && (
                  <CustomSwitch
                    tabIndex="0"
                    id="search-layers-toggle"
                    checked={showAllLayers}
                    onChange={toggleAllLayers}
                    onKeyDown={e => {
                      if (e.keyCode === 13) {
                        toggleAllLayers();
                      }
                    }}
                  />
                )}
              </ListItemSecondaryAction>
            </ListItem>
            <DetailedInfo
              showExtensiveInfo={showAllLayers}
              kartlag={showAllLayers ? kartlag : valgteLag}
              coordinates_area={coordinates_area}
              onUpdateLayerProp={onUpdateLayerProp}
              layersResult={layersResult}
              resultat={resultat}
            />
          </List>
        </div>
      </div>
    </div>
  );
};

export default InfoBox;
