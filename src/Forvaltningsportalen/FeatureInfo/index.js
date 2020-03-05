import React from "react";
import { withRouter } from "react-router-dom";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { Close, Layers } from "@material-ui/icons";
import GeneriskElement from "./GeneriskElement";
import "style/infobox.css";

const FeatureInfo = ({
  showExtensiveInfo,
  kartlag,
  onUpdateLayerProp,
  handleExtensiveInfo,
  lat,
  lng,
  layersresultat,
  sted,
  kommune
}) => {
  if (!showExtensiveInfo) return null;
  if (!lat) return null;
  return (
    <div className="infobox_container">
      <div className="all_layer_results">
        <button
          className="close_button"
          onClick={e => {
            handleExtensiveInfo(false);
          }}
        >
          <Close />
        </button>

        <ListItem>
          <ListItemIcon>
            <Layers />
          </ListItemIcon>
          <ListItemText primary={"Resultat fra alle kartlag"} />
        </ListItem>

        <div className="all_layer_results_scrollable">
          <List>
            {layersresultat !== undefined &&
              Object.keys(layersresultat).map(key => {
                return (
                  <GeneriskElement
                    key={key}
                    kartlag={kartlag}
                    resultat={layersresultat[key]}
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

export default withRouter(FeatureInfo);
