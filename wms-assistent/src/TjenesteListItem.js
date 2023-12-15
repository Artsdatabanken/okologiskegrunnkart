import React from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from 'react-router-dom';

const TjenesteListItem = ({ doc }) => {
  const navigate = useNavigate();
  return (
    <List>
      <ListItem
        button
        onClick={() => {
          const url = new URL(window.location);
          navigate("/tjeneste" + url.search);
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
