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
  if (!props) return null;
  if (!props.barn) return null;
  let primary_text = "";
  let secondary_text = "";
  let url = fancy_liste[props.type]["url"];
  if (fancy_liste[props.type]["subelement"]) {
    const subelement = lookup(props.barn);
    if (!subelement) return null;
    if (subelement && subelement.tittel && subelement.tittel.nb) {
      primary_text = subelement.tittel.nb;
    }
    secondary_text = props.tittel;
  } else {
    const layer = props[fancy_liste[props.type]["layer"]];
    if (!layer) return null;
    const feature = layer[fancy_liste[props.type]["feature"]];
    if (!feature) return null;
    url = props.url.replace(
      fancy_liste[props.type]["url_replace"][0],
      fancy_liste[props.type]["url_replace"][1]
    );
    primary_text = feature[fancy_liste[props.type]["feature_text"]];
    secondary_text =
      fancy_liste[props.type]["object_text"] + feature["objectid"];
  }

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
        <ListItemText primary={primary_text} secondary={secondary_text} />
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
