import LaksefjordIcon from "./LaksefjordIcon";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import {
  Collapse,
  ListItem,
  SvgIcon,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";
import React, { useState } from "react";
import ExpandedHeader from "./ExpandedHeader";
const Laksefjord = props => {
  // console.log("laksefjord", props);
  const [open, setOpen] = useState(false);
  if (!props) return null;
  const layer = props.layer_388_layer;
  if (!layer) return null;
  const feature = layer.layer_388_feature;
  if (!feature) return null;
  const { fjord, fylke } = feature;
  if (!fjord) return null;
  let url =
    "https://www.nibio.no/tema/jord/arealressurser/arealressurskart-ar5/" +
    fjord;
  url = props.url.replace(
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
          <SvgIcon>
            <LaksefjordIcon />
          </SvgIcon>
        </ListItemIcon>
        <ListItemText primary={fjord} secondary={"Laksefjord i " + fylke} />
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
            transform: "scale(1.5)",
            transformOrigin: "0 0"
          }}
          title="Faktaark"
          src={url}
        />
      </Collapse>
    </div>
  );
};

export default Laksefjord;
