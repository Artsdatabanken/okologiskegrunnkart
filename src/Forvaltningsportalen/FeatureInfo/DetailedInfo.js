import React from "react";
import { withRouter } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress
} from "@material-ui/core";
import GeneriskElement from "./GeneriskElement";
import "../../style/infobox.css";
import CustomIcon from "../../Common/CustomIcon";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    width: "100%"
    // marginTop: "5px"
  }
}));

const DetailedInfo = ({
  showExtensiveInfo,
  kartlag,
  coordinates_area,
  layersResult,
  loadingFeatures
}) => {
  const classes = useStyles();
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
            <CustomIcon icon="layers" size={32} color="#777" padding={0} />
          </ListItemIcon>
          <ListItemText primary={title} />
        </ListItem>

        <div className="layer-results-scrollable-side">
          {loadingFeatures && (
            <div className={classes.root}>
              <LinearProgress color="primary" />
            </div>
          )}
          <List id="layers-results-list" dense={true}>
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
