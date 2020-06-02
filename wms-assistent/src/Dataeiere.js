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
import { PouchDB } from "react-pouchdb/browser";
import { Switch, Route, useHistory } from "react-router-dom";

const filterByCompletedField = {
  active: { $ne: true },
  completed: true,
};

const Dataeiere = ({ match }) => (
  <PouchDB name="forvaltningsportal-dataeier">
    <Switch>
      <Route path="/dataeier/:key" component={Dataeier} />
      {false && <Route path="/dataeier" component={Dataeierliste} />}
    </Switch>
  </PouchDB>
);

export default Dataeiere;

function Dataeierliste({
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
        <ListSubheader>Alle dataeiere</ListSubheader>
        {docs.map((doc) => (
          <ListItem
            button
            dense
            key={doc._id}
            onClick={() => history.push("/dataeier/" + doc._id)}
          >
            <ListItemAvatar>
              {" "}
              <Avatar style={{ color: "red" }}>
                {doc.logourl ? (
                  <img
                    alt="logo"
                    style={{ maxWidth: 48, maxHeight: 48 }}
                    src={doc.logourl}
                  ></img>
                ) : (
                  ""
                )}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={doc.tittel} secondary={doc.url} />
          </ListItem>
        ))}
      </List>
      <Fab
        style={{ position: "fixed", right: 24, bottom: 72 }}
        color="primary"
        aria-label="add"
      >
        <AddIcon />
      </Fab>
    </>
  );
}
