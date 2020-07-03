import React from "react";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import CustomIcon from "../Common/CustomIcon";

const TegnforklaringLink = () => {
  const history = useHistory();
  return (
    <ListItem
      button
      onClick={() => {
        const loc = history.location;
        loc.pathname = "/tegnforklaring";
        history.push(loc);
      }}
    >
      <ListItemIcon>
        <CustomIcon
          id="legend-icon"
          icon="map-legend"
          size={26}
          padding={2}
          color="#555"
        />
      </ListItemIcon>
      <ListItemText>
        <span className="legend-text">Tegnforklaring</span>
      </ListItemText>
    </ListItem>
  );
};

export default TegnforklaringLink;
