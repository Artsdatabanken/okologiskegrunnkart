import React from "react";
import CloudIcon from "@material-ui/icons/Cloud";
import CreateIcon from "@material-ui/icons/Create";
import PublishIcon from "@material-ui/icons/Publish";
import { ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const NyttKartLagType = () => {
  const history = useHistory();
  return (
    <>
      <LagType
        history={history}
        url={"/tegn/kartlag"}
        primaryText="Tegn i kartet..."
      />
      <LagType
        history={history}
        url={"/lastopp/kartlag"}
        primaryText="Last opp fil... (TODO)"
      />
      <LagType
        history={history}
        url={"/kartlag/fra/wms"}
        primaryText="Bruk en WMS server... (TODO)"
      />
    </>
  );
};

const Components = {
  "/lastopp/kartlag": PublishIcon,
  "/kartlag/fra/wms": CloudIcon,
  "/tegn/kartlag": CreateIcon
};

const LagType = ({ history, url, primaryText }) => {
  const Icon = Components[url];
  return (
    <ListItem button onClick={() => history.push(url)}>
      <ListItemAvatar>
        <Icon style={{ fill: "rgba(0, 0, 0, 0.54)" }} />
      </ListItemAvatar>
      <ListItemText primary={primaryText} secondary="" />
    </ListItem>
  );
};

export default NyttKartLagType;
