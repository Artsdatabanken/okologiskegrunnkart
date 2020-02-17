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
  let primary_text = "";
  let secondary_text = "";
  if (!fancy_liste[props.type]) return null;
  let url = fancy_liste[props.type]["url"];
  if (fancy_liste[props.type]["subelement"]) {
    if (!props.barn) return null;
    const subelement = lookup(props.barn);
    if (!subelement) return null;
    if (subelement && subelement.tittel && subelement.tittel.nb) {
      primary_text = subelement.tittel.nb;
    }
    secondary_text = props.tittel;
  } else if (props.type === "naturtype") {
    const { NiNID, Naturtype, NiNKartleggingsenheter } = props;
    if (!Naturtype) return null;
    const kode = "FP-MDN";
    let kartlag = props.barn.find(k => k.kode === kode);
    if (!kartlag) kartlag = {};
    url = url + "?id=" + NiNID; //NINFP1810030453";
    primary_text = Naturtype;
    secondary_text = "Naturtype (" + NiNKartleggingsenheter + ")";
  } else if (props.type === "vassdrag") {
    const { VERNEPLANURL, OBJEKTNAVN, AREAL, OBJEKTID } = props;
    if (!props.OBJEKTID) return null;
    url = url + VERNEPLANURL;
    primary_text = OBJEKTNAVN + " (" + AREAL + " km²)";
    secondary_text = fancy_liste[props.type]["object_text"] + OBJEKTID;
  } else {
    const layer = props[fancy_liste[props.type]["layer"]];
    if (!layer) return null;
    const feature = layer[fancy_liste[props.type]["feature"]];
    if (!feature) return null;

    if (props.type === "arealtype") {
      const { areal, artype, artype_beskrivelse } = feature;
      if (!artype_beskrivelse) return null;
      let kartlag = props.barn.find(k => k.kode === props.kode);
      if (!kartlag) kartlag = {};
      url = url + artype_beskrivelse.toLowerCase();
      primary_text =
        artype_beskrivelse + " (" + round(parseInt(areal) / 1e6) + " km²)";
      secondary_text = "AR5 Arealtype " + artype;
    } else if (props.type === "laksefjord") {
      const { fjord, fylke } = feature;
      url = url + fjord;
      primary_text = fjord;
      secondary_text = fancy_liste[props.type]["object_text"] + fylke;
    } else {
      url = props.url;
      primary_text = feature[fancy_liste[props.type]["feature_text"]];
      secondary_text =
        fancy_liste[props.type]["object_text"] + feature["objectid"];
    }

    url = url.replace(
      fancy_liste[props.type]["url_replace"][0],
      fancy_liste[props.type]["url_replace"][1]
    );
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
          //erSynlig={kartlag.erSynlig}
          //opacity={kartlag.opacity}
          geonorge={props.geonorge}
          kode={props.kode}
          url={url}
        ></ExpandedHeader>
        {props.type === "naturtype" ? (
          <ul>
            <li style={{ padding: 16 }}>
              <a href={url} target="_top">
                Faktaark i eget vindu
              </a>
            </li>
          </ul>
        ) : (
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
        )}
      </Collapse>
    </div>
  );
};

function round(v) {
  return Math.round(v * 100) / 100;
}

export default AdbElement;
