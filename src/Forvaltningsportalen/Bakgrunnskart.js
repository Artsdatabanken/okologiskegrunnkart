import React from "react";
import AddIcon from "@material-ui/icons/Add";
import { ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const Bakgrunnskart = ({ bakgrunnskart }) => {
  const aktiv = bakgrunnskart.kart.format[bakgrunnskart.kart.aktivtFormat];
  console.log({ bakgrunnskart, aktiv, af: bakgrunnskart.kart.aktivtFormat });
  const history = useHistory();
  return (
    <ListItem
      button
      onClick={() => {
        const loc = history.location;
        loc.pathname = "/bakgrunnskart";
        history.push(loc);
      }}
    >
      <ListItemAvatar>
        <AddIcon style={{ fill: "rgba(0, 0, 0, 0.54)" }} />
      </ListItemAvatar>
      <ListItemText primary="Bakgrunnskart" secondary={aktiv.tittel} />
    </ListItem>
  );
};

export default Bakgrunnskart;
