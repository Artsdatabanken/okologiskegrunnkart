import { Star, ExpandLess, ExpandMore } from "@material-ui/icons";
import {
  Collapse,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";
import React, { useState } from "react";
import ExpandedHeader from "./ExpandedHeader";
import lookup from "./lookup";
import fancy_liste from "../Data/fancy_liste";

const AdbElement = props => {
  const [open, setOpen] = useState(false);
  if (!props.barn) return null;
  const subelement = lookup(props.barn);
  if (!subelement) return null;
  const url = fancy_liste[props.type]["url"];
  return (
    <div style={{ backgroundColor: open ? "#fff" : "#eeeeee" }}>
      <ListItem
        button
        onClick={() => {
          setOpen(!open);
        }}
      >
        <ListItemIcon>
          <Star />
        </ListItemIcon>
        <ListItemText
          primary={subelement && subelement.tittel && subelement.tittel.nb}
          secondary={props.tittel}
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

export default AdbElement;
