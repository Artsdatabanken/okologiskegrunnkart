import React, { useState, useEffect } from "react";
import { ListItem, ListItemIcon, ListItemText, Badge } from "@material-ui/core";
import { KeyboardBackspace, OpenInNew } from "@material-ui/icons";
import "../../style/infobox.css";
import CustomIcon from "../../Common/CustomIcon";
import { translateInfobox } from "../../Funksjoner/translate";
import url_formatter from "../../Funksjoner/url_formatter";

const DetailedResults = ({
  resultLayer,
  listResults,
  primaryText,
  secondaryText,
  numberResults,
  hideDetailedResults,
  coordinates_area,
  faktaark
}) => {
  const isLargeIcon = tema => {
    return ["Arealressurs", "Arter", "Klima", "Skog", "Landskap"].includes(
      tema
    );
  };

  const [faktaark_url, setFaktaark_url] = useState(null);
  const [faktaarkObject, setfaktaarkObject] = useState(null);
  // const listResultsJSON = JSON.stringify(listResults);

  const openInNewTabWithoutOpener = url => {
    // Done this way for security reasons
    var newTab = window.open();
    newTab.opener = null;
    newTab.location = url;
  };

  useEffect(() => {
    if (!faktaark) {
      setFaktaark_url(null);
      return;
    }
    if (typeof faktaark === "string") {
      const faktUrl = url_formatter(faktaark, {
        ...coordinates_area
      });
      setFaktaark_url(faktUrl);
      setfaktaarkObject(null);
    } else if (
      faktaark.constructor === Object &&
      Object.keys(faktaark).length > 0
    ) {
      // If all URLs are the same, use only one link at the header
      const url = faktaark[Object.keys(faktaark)[0]].faktaark;
      let sameURL = true;
      for (const key in faktaark) {
        const newURL = faktaark[key].faktaark;
        if (newURL !== url) {
          sameURL = false;
          break;
        }
      }
      if (sameURL) {
        setFaktaark_url(url);
        setfaktaarkObject(null);
      } else {
        setFaktaark_url(null);
        setfaktaarkObject(faktaark);
      }
    } else {
      setFaktaark_url(null);
      setfaktaarkObject(null);
    }
  }, [faktaark, coordinates_area]);

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
        </ListItem>
        {faktaark_url && (
          <ListItem
            id="faktaark-kartlag-layer-item"
            button
            onClick={() => {
              openInNewTabWithoutOpener(faktaark_url);
            }}
          >
            <ListItemText primary="Faktaark" />
            <OpenInNew id="open-facts-icon-layer" color="primary" />
          </ListItem>
        )}
        <div className="infobox-details-wrapper">
          {sublayers &&
            primaryText &&
            listResults &&
            listResults.map((key, index) => {
              return (
                <div key={index} className="infobox-details-content-wrapper">
                  <div
                    key={index}
                    className={
                      faktaarkObject && faktaarkObject[key]
                        ? "infobox-details-content-faktaark"
                        : "infobox-details-content-text"
                    }
                  >
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
                          {secondaryText[key].elementer.map(
                            (element, index) => {
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
                            }
                          )}
                        </>
                      )}
                  </div>
                  {faktaarkObject && faktaarkObject[key] && (
                    <ListItem
                      id="faktaark-kartlag-sublayer-item"
                      button
                      onClick={() => {
                        openInNewTabWithoutOpener(faktaarkObject[key].faktaark);
                      }}
                    >
                      <ListItemText primary="Faktaark" />
                      <OpenInNew
                        id="open-facts-icon-sublayer"
                        color="primary"
                        fontSize="small"
                      />
                    </ListItem>
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
