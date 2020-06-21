import React from "react";
import { useHistory } from "react-router-dom";
import { PriorityHigh } from "@material-ui/icons";
import { ListItemIcon, ListItem, ListItemText } from "@material-ui/core";

const ForvaltningsElement = ({ kartlag }) => {
  const history = useHistory();
  let tittel = kartlag.tittel;
  if (!tittel) return null;

  return (
    <>
      <ListItem
        // Elementet som inneholder tittel, visningsøye og droppned-knapp
        button
        onClick={() => {
          const loc = history.location;
          loc.pathname = "/kartlag/" + kartlag.id;
          history.push(loc);
        }}
      >
        <ListItemIcon onClick={e => e.stopPropagation()}>
          <PriorityHigh style={{ fill: "rgba(0, 0, 0, 0.54)" }} />
        </ListItemIcon>
        <ListItemText primary={tittel.nb || tittel} />
      </ListItem>
    </>
  );
};

export default ForvaltningsElement;
