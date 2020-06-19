import React from "react";
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const TegnforklaringToggle = () => {
  const history = useHistory();
  return (
    <ListItem
      button
      onClick={() => {
        const loc = history.location;
        const search = new URLSearchParams(history.location.search);
        search.set("tegnforklaring", "");
        loc.search = search.toString();
        console.log(search.toString());
        history.push(loc);
      }}
    >
      <ListItemAvatar>
        {true ? (
          <Visibility style={{ color: "#555" }} />
        ) : (
          <VisibilityOff style={{ color: "#ccc" }} />
        )}
      </ListItemAvatar>
      <ListItemText primary="Tegnforklaring" secondary="" />
    </ListItem>
  );
};

export default TegnforklaringToggle;
