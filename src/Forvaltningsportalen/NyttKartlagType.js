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
      <LagType history={history} url={"tegn"} primaryText="Tegn i kartet..." />
      <LagType
        history={history}
        url={"lastopp"}
        primaryText="Last opp fil..."
      />
      <LagType
        history={history}
        url={"wms"}
        primaryText="Bruk en WMS server..."
      />
    </>
  );
};

const Components = {
  lastopp: PublishIcon,
  wms: CloudIcon,
  tegn: CreateIcon
};

const LagType = ({ history, url, primaryText }) => {
  const Icon = Components[url];
  return (
    <ListItem
      button
      onClick={() => {
        const loc = history.location;
        loc.pathname = "/ny/" + url;
        history.push(loc);
      }}
    >
      <ListItemAvatar>
        <Icon style={{ fill: "rgba(0, 0, 0, 0.54)" }} />
      </ListItemAvatar>
      <ListItemText primary={primaryText} secondary="" />
    </ListItem>
  );
};

export default NyttKartLagType;
