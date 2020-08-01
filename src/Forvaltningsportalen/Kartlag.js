import React from "react";
import { useParams } from "react-router";
import "../style/kartknapper.css";
import "../style/kartlagfane.css";
import Geonorge from "./ForvaltningsKartlag/Geonorge";
import {
  OpenInNew,
  Link,
  Description,
  Layers,
  Category as CategoryIcon,
  Done as DoneIcon
} from "@material-ui/icons";
import {
  Chip,
  List,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItem,
  ListItemText,
  Typography,
  ListSubheader
} from "@material-ui/core";
import ForvaltningsUnderElement from "./ForvaltningsKartlag/ForvaltningsUnderElement";
import ExpandedHeader from "../Forvaltningsportalen/FeatureInfo/ExpandedHeader";

const Kartlag = ({ kartlag: alleKartlag, punkt, onUpdateLayerProp }) => {
  let { tittel } = useParams();
  const kartlag = Object.values(alleKartlag).find(
    layer => layer.tittel === tittel
  );
  if (!kartlag) return null;
  const id = kartlag.id;
  let tags = kartlag.tags || [];
  const featureinfo = punkt[id] || {};
  console.log({ featureinfo });
  return (
    <div>
      <div style={{ marginLeft: 24, marginRight: 24 }}>
        <Typography variant="body2">
          TODO: AR5 står for arealressurskart i målestokk 1:5000. AR5 er et
          detaljert, nasjonalt heldekkende datasett og den beste kilden til
          informasjon om landets arealressurser. Datasettet deler inn
          landarealet etter arealtype, skogbonitet, treslag og grunnforhold.
        </Typography>
        {tags.map(tag => {
          return (
            <Chip
              style={{ marginRight: 8, marginBottom: 8 }}
              key={tag}
              label={tag}
              clickable
              color={"default"}
              onClick={() => {
                //onFilterTag(tag, !tagFilter[tag]);
              }}
            />
          );
        })}
      </div>
      <List style={{ marginLeft: 32 }}>
        {kartlag.produktark && (
          <ListItem
            dense
            button
            onClick={() => {
              window.open(kartlag.produktark);
            }}
          >
            <ListItemIcon>
              <Description />
            </ListItemIcon>
            <ListItemText primary="Produktark" />
            <ListItemSecondaryAction>
              <OpenInNew style={{ color: "rgba(0,0,0,0.48)" }} />
            </ListItemSecondaryAction>
          </ListItem>
        )}
        {kartlag.dataeier && (
          <>
            <ListItem
              dense
              button
              onClick={() => {
                if (kartlag.kildeurl) {
                  window.open(kartlag.kildeurl);
                }
              }}
            >
              <ListItemIcon>
                {kartlag.logourl ? (
                  <img
                    src={"/logo/" + kartlag.dataeier + ".png"}
                    style={{ maxWidth: "24px" }}
                    alt=""
                  />
                ) : (
                  <>{kartlag.kildeurl ? <Link /> : <Layers />}</>
                )}
              </ListItemIcon>
              <ListItemText primary={kartlag.dataeier} />
              <OpenInNew style={{ color: "rgba(0,0,0,0.48)" }} />
            </ListItem>
          </>
        )}
        <ListItem
          dense
          button
          onClick={e => {
            window.open(kartlag.geonorgeurl || "https://www.geonorge.no/");
          }}
        >
          <ListItemIcon>
            <Geonorge />
          </ListItemIcon>
          <ListItemText primary="Datasettet på Geonorge.no" />
          <ListItemSecondaryAction>
            <OpenInNew style={{ color: "rgba(0,0,0,0.48)" }} />
          </ListItemSecondaryAction>
        </ListItem>
      </List>

      {featureinfo.primary && (
        <>
          <ListSubheader disableSticky>På markør</ListSubheader>
          <ListItem>
            <ListItemText
              primary={featureinfo.primary}
              secondary={featureinfo.secondary}
            ></ListItemText>
          </ListItem>
          {featureinfo.faktaark_url && (
            <>
              {" "}
              <ExpandedHeader
                visible={true}
                geonorge={kartlag.geonorge}
                url={featureinfo.faktaark_url}
                type={kartlag.type}
              />
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
                src={featureinfo.faktaark_url}
              />
            </>
          )}
        </>
      )}

      <ListSubheader>Kartlag</ListSubheader>
      {Object.keys(kartlag.underlag).map(sublag => {
        let lag = kartlag.underlag[sublag];

        return (
          <div key={sublag}>
            <ForvaltningsUnderElement
              kartlag={lag}
              kartlag_owner_key={id}
              kartlag_key={sublag}
              onUpdateLayerProp={onUpdateLayerProp}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Kartlag;
