import React from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from 'react-router-dom';

const TjenesteListItem = ({ layer }) => {
  const navigate = useNavigate();
  return (
    <List>
      <ListItem
        button
        onClick={() => {
          const url = new URL(window.location);
          navigate("/kartlag" + url.search);
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
