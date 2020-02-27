import React from "react";
import { Star } from "@material-ui/icons";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress
} from "@material-ui/core";

// Viser en lasteindikator
const LoadingItem = ({ title }) => (
  <ListItem>
    <ListItemIcon>
      <Star />
    </ListItemIcon>
    <ListItemText primary={title} secondary="..." />
    <CircularProgress />
  </ListItem>
);

export default LoadingItem;
