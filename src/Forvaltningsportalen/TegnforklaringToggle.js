import React from "react";
import {
  ListItem,
  Switch,
  ListItemAvatar,
  ListItemText
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { ReactComponent as LegendToggle } from "./LegendToggle.svg";

const TegnforklaringToggle = () => {
  const history = useHistory();
  const search = new URLSearchParams(history.location.search);
  const visible = search.get("tegnforklaring") !== null;
  return (
    <ListItem
      button
      onClick={() => {
        const loc = history.location;
        loc.pathname = "/tegnforklaring";
        history.push(loc);
      }}
    >
      <ListItemAvatar>
        {false && <Switch checked={visible}></Switch>}
        <LegendToggle style={{ fill: "rgba(0, 0, 0, 0.54)" }} />
      </ListItemAvatar>
      <ListItemText
        primary="Tegnforklaring"
        secondary="Bedre som knapp kanskje"
      />
    </ListItem>
  );
};

export default TegnforklaringToggle;
