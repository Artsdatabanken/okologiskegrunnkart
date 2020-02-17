import { ClearAll, ExpandLess, ExpandMore } from "@material-ui/icons";
import {
  Collapse,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";
import React, { useState } from "react";
import ExpandedHeader from "./ExpandedHeader";

const Løsmasse = props => {
  const [open, setOpen] = useState(false);
  if (!props) return null;
  const layer = props.Losmasse_flate_layer;
  if (!layer) return null;
  const feature = layer.Losmasse_flate_feature;
  if (!feature) return null;
  const { losmassetype_tekst, objectid } = feature;
  if (!losmassetype_tekst) return null;
  let url = props.url.replace(
    "info_format=application/vnd.ogc.gml",
    "info_format=text/html"
  );
  return (
    <div style={{ backgroundColor: open ? "#fff" : "#eeeeee" }}>
      <ListItem
        button
        onClick={() => {
          setOpen(!open);
        }}
      >
        <ListItemIcon>
          <ClearAll />
        </ListItemIcon>
        <ListItemText
          primary={losmassetype_tekst}
          secondary={"Løsmasse " + objectid}
        />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <ExpandedHeader
          visible={props.visible}
          opacity={props.opacity}
          onUpdateLayerProp={props.onUpdateLayerProp}
          geonorge={props.geonorge}
          kode={props.kode}
          url={url}
        ></ExpandedHeader>
        <iframe
          style={{
            width: "100%",
            height: "100vh",
            transform: "scale(0.9)",
            transformOrigin: "0 0"
          }}
          title="Faktaark"
          src={url}
        />
      </Collapse>
    </div>
  );
};

export default Løsmasse;
