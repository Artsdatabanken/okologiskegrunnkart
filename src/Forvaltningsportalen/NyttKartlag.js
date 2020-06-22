import React from "react";
import AddIcon from "@material-ui/icons/Add";
import { ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const NyttKartLag = () => {
  const history = useHistory();
  return (
    <ListItem
      button
      onClick={() => {
        const loc = history.location;
        loc.pathname = "/nytt/kartlag";
        history.push(loc);
      }}
    >
      <ListItemAvatar>
        <AddIcon style={{ fill: "rgba(0, 0, 0, 0.54)" }} />
      </ListItemAvatar>
      <ListItemText
        primary="Nytt kartlag..."
        secondary="Bedre som knapp kanskje"
      />
    </ListItem>
  );
};

export default NyttKartLag;
