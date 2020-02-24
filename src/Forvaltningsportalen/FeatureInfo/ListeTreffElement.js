import {
  Star,
  NotListedLocation,
  ExpandLess,
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
import lookup from "./lookup";
import finnGrunntype from "./finnGrunntype";

const ListeTreffElement = props => {
  const [open, setOpen] = useState(false);
  if (!props) return null;
  if (!props.kartlag) return null;
  const kartlag = props.kartlag[props.type];
  if (!kartlag) {
    return (
      <div style={{ backgroundColor: open ? "#fff" : "#eeeeee" }}>
        <ListItem
          button
          onClick={() => {
            setOpen(!open);
          }}
        >
          <ListItemIcon>
            <NotListedLocation />
          </ListItemIcon>
          <ListItemText primary={props.type} secondary={"fant ikke data"} />
        </ListItem>
      </div>
    );
  }
  const fancy = kartlag.fancy;
  if (!fancy) return null;
  let primary_text = "";
  let secondary_text = "";
  let url = fancy.url;
  let tittel = fancy.tittel;

  if (fancy.subelement) {
    const subelement = lookup(props.kartlag);
    if (!subelement) return null;
    if (subelement && subelement.tittel && subelement.tittel.nb) {
      primary_text = subelement.tittel.nb;
    }
  } else if (props.type === "naturtype") {
    const { NiNID, Naturtype, NiNKartleggingsenheter } = props;
    primary_text = "Naturtype";
    if (Naturtype) {
      const kode = props.kode;
      let kartlag = props.kartlag[kode];
      if (!kartlag) kartlag = {};
      url = url + "?id=" + NiNID; //NINFP1810030453";
      primary_text = Naturtype;
      secondary_text = tittel + " (" + NiNKartleggingsenheter + ")";
    }
  } else if (props.type === "landskap") {
    const grunntype = finnGrunntype(props);
    primary_text = "Landskap";
    if (grunntype) {
      const { area, code, index, name } = grunntype;
      if (!name) return null;
      url = url + code.replace("LA-", "LA-TI-").replace(/-/g, "/");
      primary_text = name + " (" + parseInt(area) / 1e6 + " km²)";
      secondary_text = tittel + " " + index;
    }
  } else if (props.type === "vassdrag") {
    const { VERNEPLANURL, OBJEKTNAVN, AREAL, OBJEKTID } = props;
    primary_text = "Vassdrag";
    if (props.OBJEKTID) {
      url = url + VERNEPLANURL;
      primary_text = OBJEKTNAVN + " (" + AREAL + " km²)";
      secondary_text = tittel + " " + OBJEKTID;
    }
  } else {
    const layer = props[fancy.layer] || {};
    const feature = layer[fancy.feature] || {};
    primary_text = fancy.tittel;

    if (props.type === "arealtype") {
      const { areal, artype, artype_beskrivelse } = feature;
      primary_text = "Arealtype";
      if (artype_beskrivelse) {
        let kartlag = props.kartlag[props.kode];
        if (!kartlag) kartlag = {};
        url = url + artype_beskrivelse.toLowerCase();
        primary_text =
          artype_beskrivelse + " (" + round(parseInt(areal) / 1e6) + " km²)";
        secondary_text = tittel + " " + artype;
      }
    } else if (props.type === "laksefjord") {
      const { fjord, fylke } = feature;
      primary_text = "Laksefjord";
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
    if (url) url = url.replace(fancy.url_replace[0], fancy.url_replace[1]);
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
      )}
    </div>
  );
};

function round(v) {
  return Math.round(v * 100) / 100;
}

export default ListeTreffElement;
