import {
  Avatar,
  Fab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListSubheader
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Switch, Route, useHistory } from "react-router-dom";
import TjenesteContainer from "./Tjeneste";

const Tjenester = () => (
  <div>
    <Switch>
      <Route path="/">
        <TjenesteContainer />
      </Route>
      <Route path="/tjeneste">
        <Tjenesteliste />
      </Route>
    </Switch>
  </div>
);

export default Tjenester;

function Tjenesteliste({}) {
  const history = useHistory();
  const docs = [];
  return (
    <>
      <List>
        <ListSubheader>Alle tjenester</ListSubheader>
        {docs.map(doc => (
          <ListItem
            button
            dense
            key={doc._id}
            onClick={() => history.push("?id=" + doc._id)}
          >
            <ListItemAvatar>
              <Avatar style={{ color: "#3399ff" }}>
                <img alt="wms" src="/wms.jpg" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={doc.tittel} secondary={doc.dataeier} />
          </ListItem>
        ))}
      </List>
      <Fab
        onClick={() => history.push("?id=" + 42)}
        style={{ position: "fixed", left: 424, bottom: 72 }}
        color="primary"
        aria-label="add"
      >
        <AddIcon />
      </Fab>
    </>
  );
}
