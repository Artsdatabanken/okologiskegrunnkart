import React from "react";
import AddIcon from "@material-ui/icons/Add";
import { ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const Bakgrunnskartvelger = ({ bakgrunnskart, onChangeBakgrunnskart }) => {
  const aktivtFormat = bakgrunnskart.kart.aktivtFormat;
  const aktiv = bakgrunnskart.kart.format[aktivtFormat];
  console.log({ bakgrunnskart, aktiv, aktivtFormat });
  const history = useHistory();
  return Object.keys(bakgrunnskart.kart.format).map(key => {
    const kart = bakgrunnskart.kart.format[key];
    return (
      <ListItem
        button
        selected={key === aktivtFormat}
        onClick={() => {
          onChangeBakgrunnskart("kart.aktivtFormat", key);
          const loc = history.location;
          loc.pathname = "/";
          history.push(loc);
        }}
      >
        <ListItemAvatar>
          <AddIcon style={{ fill: "rgba(0, 0, 0, 0.54)" }} />
        </ListItemAvatar>
        <ListItemText primary={kart.tittel} />
      </ListItem>
    );
  });
};

export default Bakgrunnskartvelger;
