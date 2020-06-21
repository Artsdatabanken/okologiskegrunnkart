import React from "react";
import {
  ListItem,
  Switch,
  ListItemAvatar,
  ListItemText
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
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
        //const search = new URLSearchParams(history.location.search);
        loc.pathname = "/tegnforklaring";
        //        if (visible) search.delete("tegnforklaring");
        //        else search.set("tegnforklaring", "");
        //loc.search = search.toString();
        history.push(loc);
      }}
    >
      <ListItemAvatar>
        {false && <Switch checked={visible}></Switch>}
        <LegendToggle style={{ fill: "rgba(0, 0, 0, 0.54)" }} />
      </ListItemAvatar>
      <ListItemText primary="Tegnforklaring" secondary="" />
    </ListItem>
  );
};

export default TegnforklaringToggle;
