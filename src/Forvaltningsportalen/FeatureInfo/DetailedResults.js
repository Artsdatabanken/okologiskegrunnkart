import React from "react";
import { ListItem, ListItemIcon, ListItemText, Badge } from "@material-ui/core";
import { KeyboardBackspace } from "@material-ui/icons";
import "../../style/infobox.css";
import CustomIcon from "../../Common/CustomIcon";

const DetailedResults = ({
  resultLayer,
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

  const sublayers = resultLayer.underlag;

  return (
    <div className="infobox-results-content">
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
      <div>
        {sublayers &&
          primaryText &&
          Object.keys(sublayers).map(key => {
            return (
              <div>
                <div>{sublayers[key].tittel}</div>
                <div>{primaryText[key].elementer}</div>
                <div>{secondaryText[key].elementer}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default DetailedResults;
