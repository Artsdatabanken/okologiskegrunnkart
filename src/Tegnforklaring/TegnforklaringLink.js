import React from "react";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import MapLegend from "./MapLegend";

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
        <MapLegend />
      </ListItemIcon>
      <ListItemText primary="Tegnforklaring" secondary="" />
    </ListItem>
  );
};

export default TegnforklaringLink;
