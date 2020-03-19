import {
  Visibility,
  VisibilityOff,
  ErrorOutline,
  ExpandLess,
  ExpandMore
} from "@material-ui/icons";
import { Collapse, ListItem, ListItemIcon } from "@material-ui/core";
import React, { useState } from "react";
import ExpandedHeader from "./ExpandedHeader";
import LoadingPlaceholder from "./LoadingPlaceholder";
import { CircularProgress } from "@material-ui/core";
import Klikktekst from "./Klikktekst";

const formatterFaktaarkUrl = (formatstring, pos) => {
  if (!formatstring) return;
  const delta = 0.01;
  const bbox = [
    pos.lng - delta,
    pos.lat - delta,
    pos.lng + delta,
    pos.lat + delta
  ].join(",");
  return formatstring.replace("{bbox}", bbox);
};

const GeneriskElement = props => {
  const [open, setOpen] = useState(false);
  const resultat = props.resultat;

  let kartlag = props.kartlag[props.element];
  if (!kartlag) return null;

  let primary_text = "fant ingen match i kartlag";
  let secondary_text = "fant ingen for området";
  let url = props.element.url || "";
  // egentlig en sjekk for om den finnes i kartlag (tidligere meta-filen)
  primary_text = kartlag.tittel || "mangler tittel";
  url = formatterFaktaarkUrl(kartlag.faktaark, props.coordinates_area);

  secondary_text = (
    <Klikktekst input={resultat} formatstring={kartlag.klikktekst} />
  );
  primary_text = kartlag.tittel || primary_text;

  console.log(kartlag.dataeier);

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
        <div
          style={{
            flex: 1
          }}
        >
          <div>
            {resultat.loading ? <LoadingPlaceholder /> : secondary_text}
          </div>
          <div
            style={{
              display: "block",
              fontSize: "12pt",
              color: "#6d6d6d"
            }}
          >
            {primary_text}
          </div>
          <div
            style={{
              display: "block",
              fontSize: "10pt",
              color: "grey"
            }}
          >
            {kartlag.dataeier}
          </div>
        </div>

        {url && <>{open ? <ExpandLess /> : <ExpandMore />}</>}
      </ListItem>
      {url && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <ExpandedHeader
            visible={props.visible}
            geonorge={props.geonorge}
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
