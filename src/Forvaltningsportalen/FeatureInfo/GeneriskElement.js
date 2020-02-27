import { Star, ExpandLess, ExpandMore } from "@material-ui/icons";
import {
  Collapse,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";
import React, { useState } from "react";
import ExpandedHeader from "./ExpandedHeader";
import finnGrunntype from "./finnGrunntype";
import ErrorItem from "./ErrorItem";
import LoadingItem from "./LoadingItem";

const GeneriskElement = props => {
  const [open, setOpen] = useState(false);
  const layername = props.element || "navnløs";
  const resultat = props.resultat || "resultatløs";
  const kartlag = props.kartlag[layername] || null;
  let primary_text = "fant ingen match i kartlag";
  let secondary_text = "fant ingen for området";
  let url = props.element.url || "";
  if (kartlag) {
    primary_text = kartlag.tittel && kartlag.tittel.nb;
    let tittel = primary_text;

    if (kartlag.type.split("_")[0] === "bioklimatisk") {
      const trinn = props.resultat.trinn || "ingen";
      const v = props.resultat.v || "ingen";
      secondary_text = trinn.tittel + " (PCA " + v + " )";
    }
    if (kartlag.type === "naturtype") {
      const { NiNID, Naturtype, NiNKartleggingsenheter } = resultat;
      if (Naturtype) {
        const kode = props.kode;
        let kartlag = props.kartlag[kode];
        if (!kartlag) kartlag = {};
        url = url + "?id=" + NiNID; //NINFP1810030453";
        secondary_text = Naturtype + " (" + NiNKartleggingsenheter + ")";
      }
    } else if (kartlag.type === "landskap") {
      const grunntype = finnGrunntype(resultat);
      if (grunntype) {
        const { area, code, index, name } = grunntype;
        if (!name) return null;
        url = url + code.replace("LA-", "LA-TI-").replace(/-/g, "/");
        primary_text = name + " (" + parseInt(area) / 1e6 + " km²)";
        secondary_text = tittel + " " + index;
      }
    } else if (kartlag.type === "vassdrag") {
      const { VERNEPLANURL, OBJEKTNAVN, AREAL, OBJEKTID } = resultat;
      if (props.OBJEKTID) {
        url = url + VERNEPLANURL;
        primary_text = OBJEKTNAVN + " (" + AREAL + " km²)";
        secondary_text = tittel + " " + OBJEKTID;
      }
    }
  } else {
    return null;
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
        {url && <>{open ? <ExpandLess /> : <ExpandMore />}</>}
      </ListItem>
      {url && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <ExpandedHeader
          //visible={props.visible}
          //geonorge={props.geonorge}
          //kode={props.kode}
          //url={url}
          //type={kartlag.type}
          />
          {kartlag && kartlag.type !== "naturtype" && (
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

export default GeneriskElement;
