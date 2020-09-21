import React from "react";
import { ListItem, ListItemIcon, ListItemText, Badge } from "@material-ui/core";
import { KeyboardBackspace } from "@material-ui/icons";
import "../../style/infobox.css";
import CustomIcon from "../../Common/CustomIcon";

const DetailedResults = ({
  resultLayer,
  listResults,
  primaryText,
  secondaryText,
  numberResults,
  hideDetailedResults
}) => {
  const isLargeIcon = tema => {
    return ["Arealressurs", "Arter", "Klima", "Skog", "Landskap"].includes(
      tema
    );
  };

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
                          const key =
                            allkeys && allkeys.length > 0 ? allkeys[0] : "";
                          const elem =
                            allkeys && allkeys.length > 0
                              ? Object.values(element)[0]
                              : "";
                          return (
                            <div key={index}>
                              <div className="infobox-details-primary-text">
                                {key ? key : ""}:
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
                          const key =
                            allkeys && allkeys.length > 0 ? allkeys[0] : "";
                          const elem =
                            allkeys && allkeys.length > 0
                              ? Object.values(element)[0]
                              : "";
                          return (
                            <div key={index}>
                              <div className="infobox-details-secondary-text">
                                {key ? key : ""}:
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
