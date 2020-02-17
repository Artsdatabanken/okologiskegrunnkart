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

const Arealtype = props => {
  //  console.log("grunntype", props);
  const [open, setOpen] = useState(false);
  if (!props) return null;
  const layer = props.Arealtyper_layer;
  if (!layer) return null;
  const feature = layer.Arealtyper_feature;
  if (!feature) return null;
  const { areal, artype, artype_beskrivelse } = feature;
  if (!artype_beskrivelse) return null;
  let kartlag = props.barn.find(k => k.kode === props.kode);
  if (!kartlag) kartlag = {};

  let url =
    "https://www.nibio.no/tema/jord/arealressurser/arealressurskart-ar5/" +
    artype_beskrivelse.toLowerCase();
  url = props.url.replace(
    "info_format=application/vnd.ogc.gml",
    "info_format=text/html"
  );
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
          <Star />
        </ListItemIcon>
        <ListItemText
          primary={
            artype_beskrivelse + " (" + round(parseInt(areal) / 1e6) + " km²)"
          }
          secondary={"AR5 Arealtype " + artype}
        />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <ExpandedHeader
          visible={props.visible}
          onUpdateLayerProp={props.onUpdateLayerProp}
          geonorge={props.geonorge}
          kode={props.kode}
          erSynlig={kartlag.erSynlig}
          opacity={kartlag.opacity}
          url={url}
        ></ExpandedHeader>
        <iframe
          style={{
            width: "100%",
            height: "100vh",
            transform: "scale(1.5)",
            transformOrigin: "0 0"
          }}
          title="Faktaark"
          src={url}
        />
      </Collapse>
    </div>
  );
};

function round(v) {
  return Math.round(v * 100) / 100;
}

export default Arealtype;
