import {
  Star, ExpandLess,
  ExpandMore
} from "@material-ui/icons";
import {
  Collapse,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";
import React, { useState } from "react";
import ExpandedHeader from "./ExpandedHeader";
import finnGrunntype from "./finnGrunntype";

const ListeTreffElement = props => {
  const [open, setOpen] = useState(false);
  const kartlag = props.kartlag;
  if (!kartlag) {
    console.log("Fant ikke kartlag for " + kartlag.type)
    return null;
  }
  const fancy = kartlag.fancy;
  if (!fancy) return null;
  let primary_text = kartlag.tittel && kartlag.tittel.nb;
  let secondary_text = "";
  let url = fancy.url;
  let tittel = fancy.tittel;

  if (kartlag.type === "naturtype") {
    const { NiNID, Naturtype, NiNKartleggingsenheter } = props;
    if (Naturtype) {
      const kode = props.kode;
      let kartlag = props.kartlag[kode];
      if (!kartlag) kartlag = {};
      url = url + "?id=" + NiNID; //NINFP1810030453";
      primary_text = Naturtype;
      secondary_text = tittel + " (" + NiNKartleggingsenheter + ")";
    }
  } else if (kartlag.type === "landskap") {
    const grunntype = finnGrunntype(props);
    if (grunntype) {
      const { area, code, index, name } = grunntype;
      if (!name) return null;
      url = url + code.replace("LA-", "LA-TI-").replace(/-/g, "/");
      primary_text = name + " (" + parseInt(area) / 1e6 + " km²)";
      secondary_text = tittel + " " + index;
    }
  } else if (kartlag.type === "vassdrag") {
    const { VERNEPLANURL, OBJEKTNAVN, AREAL, OBJEKTID } = props;
    if (props.OBJEKTID) {
      url = url + VERNEPLANURL;
      primary_text = OBJEKTNAVN + " (" + AREAL + " km²)";
      secondary_text = tittel + " " + OBJEKTID;
    }
  } else if (kartlag.type === "bioklimatisk") {
    const { v } = props;
    secondary_text = "PCA " + v;
  } else {
    const layer = props[fancy.layer] || {};
    const feature = layer[fancy.feature] || {};
    primary_text = fancy.tittel;

    if (kartlag.type === "arealtype") {
      const { areal, artype, artype_beskrivelse } = feature;
      if (artype_beskrivelse) {
        let kartlag = props.kartlag[props.kode];
        if (!kartlag) kartlag = {};
        url = url + artype_beskrivelse.toLowerCase();
        primary_text =
          artype_beskrivelse + " (" + round(parseInt(areal) / 1e6) + " km²)";
        secondary_text = tittel + " " + artype;
      }
    } else if (kartlag.type === "laksefjord") {
      const { fjord, fylke } = feature;
      if (fjord) {
        url = url + fjord;
        primary_text = fjord;
        secondary_text = tittel + " i " + fylke;
      }
    } else {
      url = props.url;
      const title = feature[fancy.feature_text];
      if (title) primary_text = title;
      const objectid = feature["objectid"];
      if (objectid) secondary_text = tittel + " " + objectid;
    }
    if (url && fancy.url_replace) url = url.replace(fancy.url_replace[0], fancy.url_replace[1]);
  }

  //  if (!secondary_text) console.log(props, fancy)

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
          primary={primary_text}
          secondary={secondary_text || "Ingen markerte i området"}
        />
        {url && <>{open ? <ExpandLess /> : <ExpandMore />}</>}
      </ListItem>
      {url && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <ExpandedHeader
            visible={props.visible}
            geonorge={props.geonorge}
            kode={props.kode}
            url={url}
            type={kartlag.type}
          />
          {kartlag.type !== "naturtype" && (
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
      )}
    </div>
  );
};

function round(v) {
  return Math.round(v * 100) / 100;
}

export default ListeTreffElement;
