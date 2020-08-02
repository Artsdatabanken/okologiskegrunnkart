import React from "react";
import {
  Button,
  ButtonGroup,
  TextField,
  IconButton,
  ListSubheader,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography
} from "@material-ui/core";
import { Delete, Room as Marker } from "@material-ui/icons";
import LineIcon from "./LineIcon";
import PolygonIcon from "./PolygonIcon";

const Tegn = ({ polyline, onUpdatePolyline }) => {
  const setShapeType = shapeType => {
    polyline.shapeType = shapeType;
    onUpdatePolyline(polyline);
  };
  return (
    <>
      <div style={{ margin: 24 }}>
        <Typography variant="body2">
          TODO: Vise stedsnavn, lengde på linje, areal, operasjoner som kan
          gjøres (høydeprofil osv). La brukeren slette punkter.
        </Typography>
      </div>
      <ListItem>
        <TextField
          style={{ width: "100%" }}
          required
          label="Navn på kartlaget"
          defaultValue={"Mitt kartlag " + new Date().toLocaleTimeString()}
        />
      </ListItem>
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
            <Marker></Marker> Punkt
          </Button>
          <Button
            color={polyline.shapeType === "linje" && "primary"}
            onClick={() => setShapeType("linje")}
          >
            <LineIcon></LineIcon> Linje
          </Button>
          <Button
            color={polyline.shapeType === "polygon" && "primary"}
            onClick={() => setShapeType("polygon")}
          >
            <PolygonIcon></PolygonIcon> Polygon
          </Button>
        </ButtonGroup>
      </ListItem>
      <ListSubheader disableSticky>
        {overskrift({
          shapeType: polyline.shapeType,
          area: polyline.area,
          distance: polyline.distance,
          coords: polyline.coords
        })}
        <Button
          color="primary"
          style={{ float: "right" }}
          onClick={() => {
            polyline.coords = [];
            onUpdatePolyline(polyline);
          }}
        >
          <Delete style={{ color: "rgba(0,0,0,0.54)" }} />
        </Button>
      </ListSubheader>
      {polyline.coords.map((pt, index) => {
        const utmCoords = `${Math.round(pt.x)} N ${Math.round(pt.y)} Ø`;
        const dist = `(${prettifyDistance(pt.distance)} ∠ ${Math.round(
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
            <ListItemText
              secondary={primary}
              primary={index + 1 + ". " + (pt.sted || "")}
            />
            <ListItemSecondaryAction>
              <IconButton
                onClick={() => {
                  polyline.coords.splice(index, 1);
                  onUpdatePolyline(polyline);
                }}
              >
                <Delete style={{ color: "rgba(0,0,0,0.54)" }} />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </>
  );
};

const overskrift = ({ shapeType, area, distance, coords }) => {
  if (coords.length <= 0) return "Klikk i kartet for å legge til punkter...";
  var tekst = coords.length + " punkter";
  if (shapeType === "punkt") return tekst;
  if (shapeType === "linje")
    return (tekst += ", total distanse " + prettifyDistance(distance));

  return (
    tekst +
    ", areal " +
    prettifyArea(area) +
    ", omkrets " +
    prettifyDistance(distance)
  );
};

const prettifyDistance = distance => {
  if (distance < 100) return Math.round(distance * 10) / 10 + "m";
  if (distance < 10000) return Math.round(distance) + "m";
  if (distance < 10000000) return Math.round(distance / 100) / 10 + "km";
  return Math.round(distance / 1000) + "km";
};

const prettifyArea = area => {
  if (area < 100) return Math.round(area * 10) / 10 + "m²";
  if (area < 100000) return Math.round(area) + "m²";
  if (area < 100000000) return Math.round(area / 10000) / 100 + "km²";
  if (area < 1000000000) return Math.round(area / 100000) / 10 + "km²";
  return Math.round(area / 1000000) + "km²";
};
export default Tegn;
