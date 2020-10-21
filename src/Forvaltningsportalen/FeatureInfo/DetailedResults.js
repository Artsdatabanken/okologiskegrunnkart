import React, { useState, useEffect } from "react";
import { Info } from "@material-ui/icons";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  IconButton
} from "@material-ui/core";
import { KeyboardBackspace } from "@material-ui/icons";
import "../../style/infobox.css";
import CustomIcon from "../../Common/CustomIcon";
import { translateInfobox } from "../../Funksjoner/translate";
import url_formatter from "../../Funksjoner/url_formatter";
import CustomTooltip from "../../Common/CustomTooltip";

const DetailedResults = ({
  resultLayer,
  listResults,
  primaryText,
  secondaryText,
  numberResults,
  hideDetailedResults,
  coordinates_area
}) => {
  const isLargeIcon = tema => {
    return ["Arealressurs", "Arter", "Klima", "Skog", "Landskap"].includes(
      tema
    );
  };

  const [faktaark_url, setFaktaark_url] = useState(null);
  const listResultsJSON = JSON.stringify(listResults);

  const openInNewTabWithoutOpener = url => {
    // Done this way for security reasons
    var newTab = window.open();
    newTab.opener = null;
    newTab.location = url;
  };

  useEffect(() => {
    if (!resultLayer || !resultLayer.faktaark) {
      setFaktaark_url(null);
      return;
    }
    const faktUrl = url_formatter(resultLayer.faktaark, {
      ...coordinates_area
    });
    setFaktaark_url(faktUrl);
  }, [resultLayer, listResults, listResultsJSON, coordinates_area]);

  if (!resultLayer) return null;
  const sublayers = resultLayer.underlag;

  return (
    <>
      <ListItem
        // Kartlag
        id="infobox-details-title-wrapper"
        button
        onClick={() => {
          hideDetailedResults();
        }}
      >
        <ListItemIcon>
          <KeyboardBackspace />
        </ListItemIcon>
        <ListItemText>
          <span className="infobox-details-title-text">
            Detaljerte resultater
          </span>
        </ListItemText>
      </ListItem>
      <div className="infobox-details-container">
        <ListItem id="infobox-details-layer" divider>
          <ListItemIcon className="infobox-list-icon-wrapper">
            <Badge
              className={"badge-enabled"}
              badgeContent={numberResults || 0}
              color="primary"
            >
              <CustomIcon
                id="infobox-list-icon"
                icon={resultLayer.tema}
                size={isLargeIcon(resultLayer.tema) ? 30 : 26}
                padding={isLargeIcon(resultLayer.tema) ? 0 : 2}
                color="#666"
              />
            </Badge>
          </ListItemIcon>
          <ListItemText
            primary={resultLayer.tittel}
            secondary={resultLayer.dataeier}
          />
          {faktaark_url && (
            <CustomTooltip placement="right" title="Åpne faktaark i egen fane">
              <IconButton
                id="show-faktaark-button"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  openInNewTabWithoutOpener(faktaark_url);
                }}
              >
                <Info id="open-facts-icon" color="primary" />
              </IconButton>
            </CustomTooltip>
          )}
        </ListItem>
        <div className="infobox-details-wrapper">
          {sublayers &&
            primaryText &&
            listResults &&
            listResults.map((key, index) => {
              return (
                <div key={index} className="infobox-details-content-wrapper">
                  <div className="infobox-details-title">
                    {sublayers[key] ? sublayers[key].tittel : ""}
                  </div>
                  {primaryText &&
                    primaryText[key] &&
                    primaryText[key].elementer && (
                      <>
                        {primaryText[key].elementer.map((element, index) => {
                          const allkeys = Object.keys(element);
                          const elemkey =
                            allkeys && allkeys.length > 0 ? allkeys[0] : "";
                          const elem =
                            allkeys && allkeys.length > 0
                              ? Object.values(element)[0]
                              : "";
                          return (
                            <div
                              className="infobox-details-content"
                              key={index}
                            >
                              <div className="infobox-details-primary-title">
                                {elemkey
                                  ? translateInfobox(
                                      elemkey,
                                      resultLayer.tittel,
                                      elemkey
                                    )
                                  : ""}
                                :
                              </div>
                              <div className="infobox-details-primary-text">
                                {elem ? elem : ""}
                              </div>
                            </div>
                          );
                        })}
                      </>
                    )}
                  {secondaryText &&
                    secondaryText[key] &&
                    secondaryText[key].elementer && (
                      <>
                        {secondaryText[key].elementer.map((element, index) => {
                          const allkeys = Object.keys(element);
                          const elemkey =
                            allkeys && allkeys.length > 0 ? allkeys[0] : "";
                          const elem =
                            allkeys && allkeys.length > 0
                              ? Object.values(element)[0]
                              : "";
                          return (
                            <div
                              className="infobox-details-content"
                              key={index}
                            >
                              <div className="infobox-details-secondary-title">
                                {elemkey
                                  ? translateInfobox(
                                      elemkey,
                                      resultLayer.tittel,
                                      elemkey
                                    )
                                  : ""}
                                :
                              </div>
                              <div className="infobox-details-secondary-text">
                                {elem ? elem : ""}
                              </div>
                            </div>
                          );
                        })}
                      </>
                    )}
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default DetailedResults;
