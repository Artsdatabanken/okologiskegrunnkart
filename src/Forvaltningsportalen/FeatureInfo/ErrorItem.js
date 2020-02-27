import React from "react";
import { Error, Star } from "@material-ui/icons";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";

// Viser feilmelding
const ErrorItem = ({ title, message }) => (
  <ListItem>
    <ListItemIcon>
      <Star />
    </ListItemIcon>
    <ListItemText primary={title} secondary={message} />
    <Error />
  </ListItem>
);

export default ErrorItem;
