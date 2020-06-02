import { useFind } from "react-pouchdb/browser";
import {
  Avatar,
  Fab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { useHistory } from "react-router-dom";

const filterByCompletedField = {
  active: { $ne: true },
  completed: true,
};

export default function Docs({
  match: {
    params: { filter },
  },
}) {
  const history = useHistory();
  const docs = useFind({
    selector: {
      timestamp: { $gte: null },
      completed: filterByCompletedField[filter],
    },
    sort: ["timestamp"],
  });
  return (
    <>
      <List>
        <ListSubheader>Kategorier</ListSubheader>
        {docs.map((doc) => (
          <ListItem
            button
            dense
            key={doc._id}
            onClick={() => history.push("?id=" + doc._id)}
          >
            <ListItemAvatar>
              <Avatar style={{ color: "red" }}>N</Avatar>
            </ListItemAvatar>
            <ListItemText primary={doc.tittel} secondary={doc.dataeier} />
          </ListItem>
        ))}
      </List>
      <Fab color="primary" aria-label="add">
        <AddIcon />
      </Fab>
    </>
  );
}
