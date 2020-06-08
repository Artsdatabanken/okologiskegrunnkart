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
import formatterKlikktekst from "./Klikktekst";
import url_formatter from "../../Funksjoner/url_formatter";

const GeneriskElement = props => {
  const [open, setOpen] = useState(false);
  const resultat = props.resultat;

  let kartlag = props.kartlag[props.element];
  if (!kartlag) return null;
  const faktaark_url = url_formatter(kartlag.faktaark, {
    ...props.coordinates_area,
    ...props.resultat
  });

  const primaryText = formatterKlikktekst(kartlag.klikktekst, resultat);
  const secondaryText = formatterKlikktekst(kartlag.klikktekst2, resultat);
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
        <ListItemIcon
          className="visibility_button"
          onClick={e => {
            props.onUpdateLayerProp(kartlag.id, "erSynlig", !kartlag.erSynlig);
          }}
        >
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
          <div className="generic-element-secondary-text">
            {resultat.loading ? (
              <LoadingPlaceholder />
            ) : primaryText.harData ? (
              primaryText.elementer
            ) : (
              "Ingen treff"
            )}
          </div>
          <div className="generic-element-primary-text">
            {secondaryText.harData ? secondaryText.elementer : kartlag.tittel}
          </div>
          <div className="generic-element-data-owner">{kartlag.dataeier}</div>
        </div>
        {faktaark_url && <>{open ? <ExpandLess /> : <ExpandMore />}</>}
      </ListItem>
      {faktaark_url && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <ExpandedHeader
            visible={props.visible}
            geonorge={props.geonorge}
            url={faktaark_url}
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
              src={faktaark_url}
            />
          )}
        </Collapse>
      )}
    </div>
  );
};

export default GeneriskElement;
