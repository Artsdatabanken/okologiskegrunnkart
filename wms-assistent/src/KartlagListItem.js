import React from "react";
import { List, ListItem, ListItemText } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const KartlagListItem = ({ doc }) => {
  const history = useHistory();
  return (
    <List>
      <ListItem
        button
        onClick={() => {
          history.push("/kartlag");
        }}
      >
        <ListItemText
          primary={"#" + doc._id + ": " + doc.tittel}
          secondary="Kartlag"
        />
      </ListItem>
    </List>
  );
};

export default KartlagListItem;
