import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  TextField,
  ListSubheader,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography
} from "@material-ui/core";
import { Done, Delete } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import PolygonElement from "./PolygonElement";

const NyTegn = ({ polyline, addPolyline }) => {
  const [markerType, setMarkerType] = useState();
  const setShapeType = shapeType => {
    polyline.shapeType = shapeType;
    addPolyline(polyline);
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
          <Done /> Ferdig
        </Button>

        <ListItemSecondaryAction>
          <Button
            color="primary"
            onClick={() => {
              addPolyline({ coords: [], erSynlig: true, redigeres: true });
            }}
          >
            <Delete style={{ color: "rgba(0,0,0,0.54)" }} />
          </Button>
        </ListItemSecondaryAction>
      </ListItem>
      <ListSubheader>Punktliste</ListSubheader>
      {polyline.coords.map((pt, index) => (
        <ListItem
          key={index}
          button
          selected={polyline.selectedIndex === index}
          onClick={() => {
            polyline.selectedIndex = index;
            addPolyline(polyline);
          }}
        >
          <ListItemText
            primary={pt.coords[0] + "," + pt.coords[1]}
            secondary={pt.sted}
          />
        </ListItem>
      ))}
    </>
  );
};

export default NyTegn;
