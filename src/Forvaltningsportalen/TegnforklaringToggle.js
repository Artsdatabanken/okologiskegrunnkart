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

const TegnforklaringToggle = () => {
  const history = useHistory();
  const search = new URLSearchParams(history.location.search);
  const visible = search.get("tegnforklaring") !== null;
  return (
    <ListItem
      style={{ backgroundColor: "#eee" }}
      button
      onClick={() => {
        const loc = history.location;
        loc.pathname = "tegnforklaring";
        history.push(loc);
      }}
    >
      <ListItemAvatar>
        <Switch checked={visible}></Switch>
        {false &&
          (visible ? (
            <Visibility style={{ color: "#555" }} />
          ) : (
            <VisibilityOff style={{ color: "#ccc" }} />
          ))}
      </ListItemAvatar>
      <ListItemText primary="Tegnforklaring" secondary="" />
    </ListItem>
  );
};

export default TegnforklaringToggle;
