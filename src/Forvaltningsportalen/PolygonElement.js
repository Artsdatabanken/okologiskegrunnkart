import React from "react";
import { Gesture } from "@material-ui/icons";
import { ListItemIcon, ListItem, ListItemText } from "@material-ui/core";

const PolygonElement = ({ polyline, onUpdatePolyline }) => {
  return (
    <>
      <ListItem>
        <ListItemIcon onClick={e => e.stopPropagation()}>
          <Gesture style={{ color: "rgba(0,0,0,0.54)" }} />
        </ListItemIcon>
        <ListItemText primary="Mitt Polygon" />
      </ListItem>
    </>
  );
};

export default PolygonElement;
