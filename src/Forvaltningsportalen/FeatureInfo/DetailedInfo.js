import React from "react";
import { withRouter } from "react-router-dom";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { Layers } from "@material-ui/icons";
import GeneriskElement from "./GeneriskElement";
import "../../style/infobox.css";

const DetailedInfo = ({
  showExtensiveInfo,
  kartlag,
  coordinates_area,
  layersResult
}) => {
  let title = "Ingen kartlag valgt";
  const emptyKartlag =
    Object.keys(kartlag).length === 0 && kartlag.constructor === Object;
  if (showExtensiveInfo && !emptyKartlag) {
    title = "Resultat fra alle kartlag";
  } else if (!showExtensiveInfo && !emptyKartlag) {
    title = "Resultat fra valgte kartlag";
  }
  if (!coordinates_area.lat) return null;
  return (
    <div className="detailed-info-container-side">
      <div className="layer-results-side">
        <ListItem id="layer-results-header">
          <ListItemIcon>
            <Layers />
          </ListItemIcon>
          <ListItemText primary={title} />
        </ListItem>

        <div className="layer-results-scrollable-side">
          <List dense={true}>
            {layersResult !== undefined &&
              Object.keys(layersResult).map(key => {
                return (
                  <GeneriskElement
                    coordinates_area={coordinates_area}
                    key={key}
                    kartlag={kartlag}
                    resultat={layersResult[key]}
                    element={key}
                  />
                );
              })}
          </List>
        </div>
      </div>
    </div>
  );
};

export default withRouter(DetailedInfo);
