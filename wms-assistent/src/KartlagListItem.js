import React from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import { useHistory } from "react-router-dom";

const TjenesteListItem = ({ layer }) => {
  const history = useHistory();
  return (
    <List>
      <ListItem
        button
        onClick={() => {
          const url = new URL(window.location);
          history.push("/kartlag" + url.search);
        }}
      >
        <ListItemText
          primary={layer.wmslayer + ": " + layer.tittel}
          secondary="Kartlag"
        />
      </ListItem>
    </List>
  );
};

export default TjenesteListItem;
