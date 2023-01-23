import React from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import { useHistory } from "react-router-dom";

const TjenesteListItem = ({ doc }) => {
  const history = useHistory();
  return (
    <List>
      <ListItem
        button
        onClick={() => {
          const url = new URL(window.location);
          history.push("/tjeneste" + url.search);
        }}
      >
        <ListItemText
          primary={"#" + doc._id + ": " + doc.tittel}
          secondary="Tjeneste"
        />
      </ListItem>
    </List>
  );
};

export default TjenesteListItem;
