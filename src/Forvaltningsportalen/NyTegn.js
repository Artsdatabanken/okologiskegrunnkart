import React, { useState } from "react";
import { LocationSearching, WhereToVote, Gesture } from "@material-ui/icons";
import {
  Button,
  ButtonGroup,
  TextField,
  Input,
  ListItem,
  ListItemAvatar,
  ListItemText
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import PolygonElement from "./PolygonElement";

const NyTegn = props => {
  const [markerType, setMarkerType] = useState();
  const [shapeType, setShapeType] = useState("polygon");
  const history = useHistory();
  return (
    <>
      <ListItem>
        <TextField
          style={{ width: "100%" }}
          required
          label="Navn på kartlaget"
          defaultValue={"Mitt kartlag " + new Date().toLocaleTimeString()}
        />
      </ListItem>
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
      {props.polyline.map(pt => (
        <ListItem>
          <ListItemText primary={pt.join(",")} />
        </ListItem>
      ))}
      <span>{JSON.stringify(props.polyline)}</span>

      <PolygonElement
        polygon={props.polygon}
        polyline={props.polyline}
        showPolygon={props.showPolygon}
        hideAndShowPolygon={props.hideAndShowPolygon}
        handleEditable={props.handleEditable}
        addPolygon={props.addPolygon}
        addPolyline={props.addPolyline}
      />
    </>
  );
};

export default NyTegn;
