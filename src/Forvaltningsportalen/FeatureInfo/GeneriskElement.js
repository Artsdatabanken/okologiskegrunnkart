import {
  Visibility,
  VisibilityOff,
  ErrorOutline,
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
import finnGrunntype from "./finnGrunntype";
import LoadingPlaceholder from "./LoadingPlaceholder";
import { CircularProgress } from "@material-ui/core";

const GeneriskElement = props => {
  const [open, setOpen] = useState(false);
  const layername = props.element || "navnløs";
  const resultat = props.resultat || "resultatløs";
  let kartlag = props.kartlag[layername] || null;
  let primary_text = "fant ingen match i kartlag";
  let secondary_text = "fant ingen for området";
  let url = props.element.url || "";
  let kode = "";
  if (kartlag) {
    // egentlig en sjekk for om den finnes i kartlag (tidligere meta-filen)
    primary_text = (kartlag.tittel && kartlag.tittel.nb) || "mangler tittel";
    const featureinfo = kartlag.featureinfo;
    let tittel = featureinfo.tittel || primary_text;
    url = featureinfo.faktaark; //props.element.url || "";

    if (resultat.error)
      secondary_text = "Får ikke kontakt med leverandør" || resultat.error;
    if (resultat.loading) secondary_text = "...'"; //return <LoadingItem title={primary_text} />;

    // Overført og modifisert fra ListeTreffElement - sammenligningene :)
    if (kartlag.type.split("_")[0] === "bioklimatisk") {
      const trinn = (props.resultat.barn || []).find(x => x.aktiv) || {
        tittel: { nb: "Ingen data" }
      };
      const v = props.resultat.v || "ingen";
      secondary_text = trinn.tittel.nb + " (PCA " + v + " )";
    }
    if (kartlag.type.split("_")[0] === "kalk") {
      secondary_text = "Ingen data";
    }
    if (kartlag.type === "naturtype") {
      const { NiNID, Naturtype, NiNKartleggingsenheter } = resultat;
      if (Naturtype) {
        const kode = props.kode;
        let kartlag = props.kartlag[kode];
        if (!kartlag) kartlag = {};
        url = url + "?id=" + NiNID;
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
    } else {
      const layer = resultat[featureinfo.layer] || {};
      const feature = layer[featureinfo.feature] || {};
      primary_text = featureinfo.tittel || primary_text;

      if (kartlag.type === "arealtype") {
        const { areal, artype, artype_beskrivelse } = feature;
        if (artype_beskrivelse) {
          kode = "FP-NH";
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
        if (kartlag.type === "livsmiljø") {
          kode = "FP-NL";
        }
        const title = feature[featureinfo.feature_text];
        if (title) primary_text = title;
        const objectid = feature["objectid"];
        if (objectid) secondary_text = tittel + " " + objectid;
      }
      if (url && featureinfo.url_replace)
        url = url.replace(
          featureinfo.url_replace[0],
          featureinfo.url_replace[1]
        );
    }
  } else {
    // Her kan vi teknisk sett akseptere å vise element som ikke har en match i kartlagfila også
    // Hvordan ønsker vi da å fremstille dem?
    return null;
  }
  return (
    <div
      style={{ backgroundColor: open ? "#fff" : "#eeeeee" }}
      className="generic_element"
    >
      <ListItem
        button
        onClick={() => {
          setOpen(!open);
        }}
      >
        <ListItemIcon>
          {resultat.loading ? (
            <CircularProgress />
          ) : (
            <>
              {resultat.error ? (
                <ErrorOutline />
              ) : (
                <>{kartlag.erSynlig ? <Visibility /> : <VisibilityOff />}</>
              )}
            </>
          )}
        </ListItemIcon>
        <ListItemText
          primary={primary_text}
          secondary3={<LoadingPlaceholder />}
          secondary={resultat.loading ? <LoadingPlaceholder /> : secondary_text}
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

export default GeneriskElement;
