import { Waves, ExpandLess, ExpandMore } from "@material-ui/icons";
import {
  Collapse,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";
import React, { useState } from "react";
import ExpandedHeader from "./ExpandedHeader";
const Vassdrag = props => {
  const [open, setOpen] = useState(false);
  if (!props) return null;
  const { VERNEPLANURL, OBJEKTNAVN, AREAL, OBJEKTID } = props;
  if (!props.OBJEKTID) return null;
  const url =
    "https://www.nve.no/vann-vassdrag-og-miljo/verneplan-for-vassdrag/" +
    VERNEPLANURL;
  return (
    <div style={{ backgroundColor: open ? "#fff" : "#eeeeee" }}>
      <ListItem
        button
        onClick={() => {
          setOpen(!open);
          //          window.open(url, "", "width=500,height=500")
        }}
      >
        <ListItemIcon>
          <Waves />
        </ListItemIcon>
        <ListItemText
          primary={OBJEKTNAVN + " (" + AREAL + " km²)"}
          secondary={"Verneplan for vassdrag " + OBJEKTID}
        />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <ExpandedHeader
          visible={props.visible}
          opacity={props.opacity}
          onUpdateLayerProp={props.onUpdateLayerProp}
          geonorge={props.geonorge}
          kode={props.kode}
          url={url}
        ></ExpandedHeader>
        <iframe
          allowtransparency="true"
          style={{
            frameBorder: 0,
            width: "100%",
            height: "100vh"
          }}
          title="Faktaark"
          src={url}
        />
      </Collapse>
    </div>
  );
};

export default Vassdrag;
