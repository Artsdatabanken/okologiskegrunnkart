import React from "react";
import {
  VisibilityOutlined,
  VisibilityOffOutlined,
  Delete,
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
          <IconButton
            className="visibility_button"
            onClick={e => {
              hideAndShowPolygon(!showPolygon);
            }}
          >
            {showPolygon ? (
              <VisibilityOutlined style={{ color: "#333" }} />
            ) : (
              <VisibilityOffOutlined style={{ color: "#aaa" }} />
            )}
          </IconButton>
        </ListItemIcon>
        <ListItemText primary="Mitt Polygon" />
        {polygon ? (
          <button
            className="polygonbutton edit"
            onClick={e => {
              addPolygon(null);
              addPolyline(polygon);
            }}
          >
            <Create /> Rediger
          </button>
        ) : (
          <button
            className="polygonbutton done"
            onClick={e => {
              addPolygon(polyline);
              addPolyline([]);
            }}
          >
            <Done /> Ferdig
          </button>
        )}

        <button
          className="polygonbutton remove"
          onClick={e => {
            addPolygon(null);
            addPolyline([]);
            hideAndShowPolygon(true);
            handleEditable(true);
          }}
        >
          <Delete /> Fjern
        </button>
      </ListItem>
      <h3 className="container_header">Kartlag</h3>
    </>
  );
};

export default PolygonElement;
