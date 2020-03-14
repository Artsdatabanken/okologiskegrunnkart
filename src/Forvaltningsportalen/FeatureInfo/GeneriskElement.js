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
import Klikktekst from "./Klikktekst";

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
  url = kartlag.faktaark;

  secondary_text = (
    <Klikktekst input={resultat} formatstring={kartlag.klikktekst} />
  );
  primary_text = kartlag.tittel || primary_text;

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
