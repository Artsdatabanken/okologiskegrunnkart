import React from "react";
import { useHistory } from "react-router-dom";
import { PriorityHigh } from "@material-ui/icons";
import {
  Badge,
  ListItemSecondaryAction,
  ListItemIcon,
  ListItem,
  ListItemText
} from "@material-ui/core";

const ForvaltningsElement = ({ kartlag }) => {
  const history = useHistory();
  let tittel = kartlag.tittel;

  return (
    <>
      <ListItem
        // Elementet som inneholder tittel, visningsøye og droppned-knapp
        button
        onClick={() => {
          const loc = history.location;
          loc.pathname = "/kartlag/" + kartlag.tittel;
          history.push(loc);
        }}
      >
        <ListItemIcon onClick={e => e.stopPropagation()}>
          <PriorityHigh style={{ fill: "rgba(0, 0, 0, 0.54)" }} />
        </ListItemIcon>
        <ListItemText primary={tittel.nb || tittel} />
        <ListItemSecondaryAction>
          <Badge badgeContent={kartlag.numberVisible} color="primary"></Badge>
        </ListItemSecondaryAction>
      </ListItem>
    </>
  );
};

export default ForvaltningsElement;
