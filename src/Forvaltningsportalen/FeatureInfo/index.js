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
import GeneriskElement from "./GeneriskElement";

const FeatureInfo = ({
  showExtensiveInfo,
  kartlag,
  onUpdateLayerProp,
  handleExtensiveInfo,
  lat,
  lng,
  resultat,
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

  console.log(resultat);

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

          {resultat !== undefined &&
            Object.keys(resultat).map(key => {
              return (
                <GeneriskElement
                  kartlag={kartlag}
                  resultat={resultat[key]}
                  element={key}
                />
              );
            })}

          {/*
            <ListeTreffElement
              kartlag={kartlag.bioklimatiske_seksjoner}
              {...seksjon}
              onUpdateLayerProp={onUpdateLayerProp}
            />
          <ListeTreffElement
            kartlag={kartlag.bioklimatiske_soner}
            {...sone}
            onUpdateLayerProp={onUpdateLayerProp}
          />
          <ListeTreffElement
            {...kalk}
            onUpdateLayerProp={onUpdateLayerProp}
            kartlag={kartlag.kalk}
          />
            <ListeTreffElement
              kode="FP-MDN"
              {...naturtype}
              onUpdateLayerProp={onUpdateLayerProp}
              kartlag={kartlag.naturtype}
            />
            <ListeTreffElement
              kode="FP-NH"
              {...arealtype}
              onUpdateLayerProp={onUpdateLayerProp}
              kartlag={kartlag.arealtype}
            />
          <ListeTreffElement
            {...løsmasse}
            onUpdateLayerProp={onUpdateLayerProp}
            kartlag={kartlag.løsmasse}
          />
          <ListeTreffElement
            {...laksefjord}
            onUpdateLayerProp={onUpdateLayerProp}
            kartlag={kartlag.laksefjord}
          />

          <ListeTreffElement
            kode="FP-NV"
            {...vassdrag}
            onUpdateLayerProp={onUpdateLayerProp}
            kartlag={kartlag.vassdrag}
          />

          <ListeTreffElement
            {...landskap}
            onUpdateLayerProp={onUpdateLayerProp}
            kartlag={kartlag.landskap}
          />
          <Livsmiljo
            kode="FP-NL"
            {...livsmiljø}
            onUpdateLayerProp={onUpdateLayerProp}
            kartlag={kartlag.livsmiljø}
          />
          */}
        </List>
      </div>
    </div>
  );
};

export default withRouter(FeatureInfo);
