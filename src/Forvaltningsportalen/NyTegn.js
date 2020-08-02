import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  TextField,
  ListSubheader,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography
} from "@material-ui/core";
import { Done, Delete } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import PolygonElement from "./PolygonElement";

const NyTegn = ({ polyline, onUpdatePolyline }) => {
  const [markerType, setMarkerType] = useState();
  const setShapeType = shapeType => {
    polyline.shapeType = shapeType;
    onUpdatePolyline(polyline);
  };
  const history = useHistory();
  return (
    <>
      <div style={{ margin: 24 }}>
        <Typography variant="body2">
          TODO: Vise stedsnavn, lengde på linje, areal, operasjoner som kan
          gjøres (høydeprofil osv). La brukeren slette punkter.
        </Typography>
      </div>
      <ListSubheader disableSticky>Type geometri</ListSubheader>
      <ListItem>
        <ButtonGroup
          fullWidth={true}
          variant="contained"
          aria-label="primary button group"
        >
          <Button
            color={polyline.shapeType === "punkt" && "primary"}
            onClick={() => setShapeType("punkt")}
          >
            Punkt
          </Button>
          <Button
            color={polyline.shapeType === "linje" && "primary"}
            onClick={() => setShapeType("linje")}
          >
            Linje
          </Button>
          <Button
            color={polyline.shapeType === "polygon" && "primary"}
            onClick={() => setShapeType("polygon")}
          >
            Polygon
          </Button>
        </ButtonGroup>
      </ListItem>
      <ListItem>
        <TextField
          style={{ width: "100%" }}
          required
          label="Navn på kartlaget"
          defaultValue={"Mitt kartlag " + new Date().toLocaleTimeString()}
        />
      </ListItem>
      <ListItem>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            history.push("/");
          }}
        >
          OK
        </Button>

        <ListItemSecondaryAction>
          <Button
            color="primary"
            onClick={() => {
              polyline.coords = [];
              onUpdatePolyline(polyline);
            }}
          >
            <Delete style={{ color: "rgba(0,0,0,0.54)" }} />
          </Button>
        </ListItemSecondaryAction>
      </ListItem>
      <ListSubheader disableSticky>Punkter</ListSubheader>
      {polyline.coords.map((pt, index) => {
        const utmCoords = `${Math.round(pt.utm.x)} N ${Math.round(pt.utm.y)} Ø`;
        const dist = `(${prettifyDistance(pt.dist)} ∠ ${Math.round(
          (360 + pt.angle) % 360
        )}°)`;
        const primary =
          polyline.shapeType !== "punkt" &&
          (index > 0 || polyline.shapeType === "polygon")
            ? `${utmCoords} ${dist}`
            : utmCoords;
        return (
          <ListItem
            key={index}
            button
            selected={polyline.selectedIndex === index}
            onClick={() => {
              polyline.selectedIndex = index;
              onUpdatePolyline(polyline);
            }}
          >
            <ListItemAvatar>{index}</ListItemAvatar>
            <ListItemText primary={primary} secondary={pt.sted} />
          </ListItem>
        );
      })}
    </>
  );
};

const prettifyDistance = dist => {
  if (dist < 100) return Math.round(dist * 10) / 10 + "m";
  if (dist < 10000) return Math.round(dist) + "m";
  if (dist < 100000) return Math.round(dist / 100) / 10 + "km";
  return Math.round(dist / 1000) + "km";
};
export default NyTegn;
