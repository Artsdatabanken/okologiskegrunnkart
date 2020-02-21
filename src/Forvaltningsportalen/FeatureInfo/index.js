import LocationSearching from "@material-ui/icons/LocationSearching";
import React from "react";
import { withRouter } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import Livsmiljo from "./Livsmiljø";
import ListeTreffElement from "./ListeTreffElement";

const FeatureInfo = ({
  showExtensiveInfo,
  meta,
  onUpdateLayerProp,
  handleExtensiveInfo,
  lat,
  lng,
  sted,
  kommune,
  arealtype,
  landskap,
  naturtype,
  livsmiljø,
  vassdrag,
  seksjon,
  sone,
  kalk,
  laksefjord,
  løsmasse
}) => {
  if (!showExtensiveInfo) return null;
  if (!lat) return null;
  const coords = `${Math.round(lat * 10000) / 10000}° N ${Math.round(
    lng * 10000
  ) / 10000}° Ø`;
  const kommunestr =
    kommune &&
    kommune.kommune.tittel.nb + " kommune i " + kommune.fylke.tittel.nb;

  return (
    <div className="left_window">
      <div className="left_window_scrollable">
        <button
          className="close_button"
          onClick={e => {
            handleExtensiveInfo(false);
          }}
        >
          <Close />
        </button>
        <List>
          <ListSubheader disableSticky={true}>
            {lat ? coords : "Klikk i kartet..."}
          </ListSubheader>
          {lat && (
            <ListItem button>
              <ListItemIcon>
                <LocationSearching />
              </ListItemIcon>
              <ListItemText
                primary={sted && sted.navn}
                secondary={kommunestr}
              />
            </ListItem>
          )}
          {/*
          <ListeTreffElement
            barn={meta.barn}
            {...seksjon}
            onUpdateLayerProp={onUpdateLayerProp}
            type="bioklimatiske_seksjoner"
          />
          <ListeTreffElement
            barn={meta.barn}
            {...sone}
            onUpdateLayerProp={onUpdateLayerProp}
            type="bioklimatiske_soner"
          />
          <ListeTreffElement
            {...kalk}
            onUpdateLayerProp={onUpdateLayerProp}
            barn={meta.barn}
            type="kalk"
          />

          <ListeTreffElement
            {...løsmasse}
            onUpdateLayerProp={onUpdateLayerProp}
            barn={meta.barn}
            type="løsmasse"
          />
          <ListeTreffElement
            {...laksefjord}
            onUpdateLayerProp={onUpdateLayerProp}
            barn={meta.barn}
            type="laksefjord"
          />
*/}
          <ListeTreffElement
            kode="FP-NV"
            {...vassdrag}
            onUpdateLayerProp={onUpdateLayerProp}
            barn={meta.barn}
            type="vassdrag"
          />
          <ListeTreffElement
            kode="FP-NH"
            {...arealtype}
            onUpdateLayerProp={onUpdateLayerProp}
            barn={meta.barn}
            type="arealtype"
          />

          <ListeTreffElement
            kode="FP-MDN"
            {...naturtype}
            onUpdateLayerProp={onUpdateLayerProp}
            barn={meta.barn}
            type="naturtype"
          />
          <ListeTreffElement
            {...landskap}
            onUpdateLayerProp={onUpdateLayerProp}
            barn={meta.barn}
            type="landskap"
          />
          <Livsmiljo
            kode="FP-NL"
            {...livsmiljø}
            onUpdateLayerProp={onUpdateLayerProp}
            barn={meta.barn}
          />
        </List>
      </div>
    </div>
  );
};

export default withRouter(FeatureInfo);
