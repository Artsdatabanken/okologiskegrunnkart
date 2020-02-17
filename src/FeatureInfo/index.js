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
import Landskap from "./Landskap";
import Livsmiljo from "./Livsmiljø";
import AdbElement from "./AdbElement";

const FeatureInfo = ({
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
  if (!lat) return null;
  const coords = `${Math.round(lat * 10000) / 10000}° N ${Math.round(
    lng * 10000
  ) / 10000}° Ø`;
  const kommunestr =
    kommune &&
    kommune.kommune.tittel.nb + " kommune i " + kommune.fylke.tittel.nb;

  return (
    <div className="left_window">
      <div
        // Dette er altså markørens søkeinnhold
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          overflowY: "auto",
          paddingBottom: 48,
          width: "100%"
        }}
      >
        <button
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

          <AdbElement
            barn={meta.barn}
            {...seksjon}
            onUpdateLayerProp={onUpdateLayerProp}
            tittel="Bioklimatisk seksjon"
            type="bioklimatisk"
          />
          <AdbElement
            barn={meta.barn}
            {...sone}
            onUpdateLayerProp={onUpdateLayerProp}
            tittel="Bioklimatisk sone"
            type="bioklimatisk"
          />
          <AdbElement
            {...kalk}
            onUpdateLayerProp={onUpdateLayerProp}
            barn={meta.barn}
            tittel="Kalkinnhold"
            type="kalk"
          />
          <AdbElement
            {...løsmasse}
            onUpdateLayerProp={onUpdateLayerProp}
            barn={meta.barn}
            type="løsmasse"
          />
          <AdbElement
            kode="FP-NH"
            {...arealtype}
            onUpdateLayerProp={onUpdateLayerProp}
            barn={meta.barn}
            type="arealtype"
          />

          <AdbElement
            kode="FP-NV"
            {...vassdrag}
            onUpdateLayerProp={onUpdateLayerProp}
            barn={meta.barn}
            type="vassdrag"
          />

          <AdbElement
            {...laksefjord}
            onUpdateLayerProp={onUpdateLayerProp}
            barn={meta.barn}
            type="laksefjord"
          />

          <AdbElement
            {...naturtype}
            onUpdateLayerProp={onUpdateLayerProp}
            barn={meta.barn}
            type="naturtype"
          />

          <Landskap {...landskap} onUpdateLayerProp={onUpdateLayerProp} />




          <Livsmiljo
            kode="FP-NL"
            {...livsmiljø}
            onUpdateLayerProp={onUpdateLayerProp}
            barn={meta.barn}
          />
          */}
        </List>
      </div>
    </div>
  );
};

export default withRouter(FeatureInfo);
