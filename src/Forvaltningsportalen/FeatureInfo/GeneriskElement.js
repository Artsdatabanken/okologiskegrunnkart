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
import LoadingPlaceholder from "./LoadingPlaceholder";
import { CircularProgress } from "@material-ui/core";

function lookup(o, path) {
  if (o.loading || o.error) return;
  const segments = path.split(".");
  //  if (o[segments[0]])
  console.log(segments, o);

  for (var segment of segments) {
    if (segment === "undefined") continue;
    if (!o[segment]) return null;
    o = o[segment];
  }
  console.log("resssss", path, o);
  if (typeof o === "string") return o;
  return JSON.stringify(o);
}

const GeneriskElement = props => {
  const [open, setOpen] = useState(false);
  const layername = props.element || "navnløs";
  const resultat = props.resultat || "resultatløs";
  let kartlag = props.kartlag[layername] || null;
  let primary_text = "fant ingen match i kartlag";
  let secondary_text = "fant ingen for området";
  let url = props.element.url || "";
  if (kartlag) {
    // egentlig en sjekk for om den finnes i kartlag (tidligere meta-filen)
    primary_text = kartlag.tittel || "mangler tittel";
    url = kartlag.faktaark;

    if (resultat.error)
      secondary_text = "Får ikke kontakt med leverandør" || resultat.error;
    else if (resultat.loading) secondary_text = "...'";
    //return <LoadingItem title={primary_text} />;
    else
      secondary_text = lookup(resultat, kartlag.klikktekst) || secondary_text;
    primary_text = kartlag.tittel || primary_text;
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

export default GeneriskElement;
