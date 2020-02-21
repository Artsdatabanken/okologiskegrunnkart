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
import finnGrunntype from "./finnGrunntype";
import fancy_liste from "../../Data/fancy_liste";

const ListeTreffElement = props => {
  const [open, setOpen] = useState(false);
  if (!props) return null;
  if (!fancy_liste[props.type]) return null;
  let primary_text = "";
  let secondary_text = "";
  let url = fancy_liste[props.type]["url"];
  let tittel = fancy_liste[props.type]["tittel"];
  secondary_text = tittel;

  if (fancy_liste[props.type]["subelement"]) {
    if (!props.barn) return null;
    const subelement = lookup(props.barn);
    if (!subelement) return null;
    if (subelement && subelement.tittel && subelement.tittel.nb) {
      primary_text = subelement.tittel.nb;
    }
  } else if (props.type === "naturtype") {
    const { NiNID, Naturtype, NiNKartleggingsenheter } = props;
    if (!Naturtype) return null;
    const kode = "FP-MDN";
    let kartlag = props.barn.find(k => k.kode === kode);
    if (!kartlag) kartlag = {};
    url = url + "?id=" + NiNID; //NINFP1810030453";
    primary_text = Naturtype;
    secondary_text = secondary_text + " (" + NiNKartleggingsenheter + ")";
  } else if (props.type === "landskap") {
    const grunntype = finnGrunntype(props);
    if (!grunntype) return null;
    const { area, code, index, name } = grunntype;
    if (!name) return null;
    url = url + code.replace("LA-", "LA-TI-").replace(/-/g, "/");
    primary_text = name + " (" + parseInt(area) / 1e6 + " km²)";
    secondary_text = tittel + " " + index;
  } else if (props.type === "vassdrag") {
    const { VERNEPLANURL, OBJEKTNAVN, AREAL, OBJEKTID } = props;
    if (!props.OBJEKTID) return null;
    url = url + VERNEPLANURL;
    primary_text = OBJEKTNAVN + " (" + AREAL + " km²)";
    secondary_text = tittel + " " + OBJEKTID;
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
      secondary_text = tittel + " " + artype;
    } else if (props.type === "laksefjord") {
      const { fjord, fylke } = feature;
      url = url + fjord;
      primary_text = fjord;
      secondary_text = tittel + " i " + fylke;
    } else {
      url = props.url;
      primary_text = feature[fancy_liste[props.type]["feature_text"]];
      secondary_text = tittel + " " + feature["objectid"];
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
          //opacity={props.opacity}
          //onUpdateLayerProp={props.onUpdateLayerProp}
          //erSynlig={kartlag.erSynlig}
          //opacity={kartlag.opacity}
          geonorge={props.geonorge}
          kode={props.kode}
          url={url}
          type={props.type}
        />
        {props.type !== "naturtype" && (
          <iframe
            allowtransparency="true"
            style={{
              frameBorder: 0,
              width: "100%",
              minHeight: "500px",
              maxHeight: "100%",
              position: "relative",
              overflow: "none"
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

export default ListeTreffElement;
