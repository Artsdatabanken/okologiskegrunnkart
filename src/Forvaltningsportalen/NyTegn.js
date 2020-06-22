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

const NyTegn = props => {
  const [markerType, setMarkerType] = useState();
  const [shapeType, setShapeType] = useState("polygon");
  const history = useHistory();
  return (
    <>
      <div style={{ margin: 24 }}>
        <Typography variant="body2">
          TODO: Vise stedsnavn, lengde på linje, areal, operasjoner som kan
          gjøres (høydeprofil osv). La brukeren slette punkter.
        </Typography>
      </div>
      <ListSubheader>Type geometri</ListSubheader>
      <ListItem>
        <ButtonGroup
          fullWidth={true}
          variant="contained"
          aria-label="primary button group"
        >
          <Button
            color={shapeType === "punkt" && "primary"}
            onClick={() => setShapeType("punkt")}
          >
            Punkt
          </Button>
          <Button
            color={shapeType === "linje" && "primary"}
            onClick={() => setShapeType("linje")}
          >
            Linje
          </Button>
          <Button
            color={shapeType === "polygon" && "primary"}
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
            props.addPolygon(props.polyline);
            props.addPolyline([]);
            history.push("/");
          }}
        >
          {" "}
          <Done /> Ferdig
        </Button>

        <ListItemSecondaryAction>
          <Button
            variant="outline"
            color="primary"
            onClick={() => {
              props.addPolygon(null);
              props.addPolyline([]);
              props.hideAndShowPolygon(true);
              props.handleEditable(true);
            }}
          >
            <Delete style={{ color: "rgba(0,0,0,0.54)" }} />
          </Button>
        </ListItemSecondaryAction>
      </ListItem>
      <ListSubheader>Punktliste</ListSubheader>
      {props.polyline.map(pt => (
        <ListItem>
          <ListItemText primary={pt.join(",")} />
        </ListItem>
      ))}
    </>
  );
};

export default NyTegn;
