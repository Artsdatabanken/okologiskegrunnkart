import React from "react";
import {
  VisibilityOutlined,
  VisibilityOffOutlined,
  Delete,
  Gesture,
  Create,
  Done
} from "@material-ui/icons";
import {
  IconButton,
  ListItemIcon,
  ListItem,
  ListItemText
} from "@material-ui/core";

const PolygonElement = ({
  polygon,
  polyline,
  showPolygon,
  hideAndShowPolygon,
  handleEditable,
  addPolygon,
  addPolyline
}) => {
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
