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
  ListItemIcon,
  ListItemSecondaryAction,
  ListItem,
  ListItemText
} from "@material-ui/core";
import ForvaltningsUnderElement from "./ForvaltningsKartlag/ForvaltningsUnderElement";
import ExpandedHeader from "../Forvaltningsportalen/FeatureInfo/ExpandedHeader";

const Kartlag = ({
  kartlag: alleKartlag,
  punkt,
  onUpdateLayerProp,
  tagFilter,
  onFilterTag
}) => {
  let { id } = useParams();
  console.log({ kartlag, id, punkt });
  const kartlag = alleKartlag[id];
  if (!kartlag) return null;
  let tags = kartlag.tags || [];
  return (
    <div>
      Kartlag {id}
      <div className="valgtLag">
        {punkt.faktaark_url && (
          <>
            <ExpandedHeader
              visible={true}
              geonorge={kartlag.geonorge}
              url={punkt.faktaark_url}
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
                src={punkt.faktaark_url}
              />
            )}
          </>
        )}
        {kartlag.underlag && (
          <>
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
          </>
        )}

        {tags.length > 0 && (
          <>
            <ListItem button>
              <ListItemIcon>
                <CategoryIcon />
              </ListItemIcon>
              <ListItemText
                primary={tags.join(", ")}
                secondary="Tema"
              ></ListItemText>
            </ListItem>
            {false && (
              <div _className="tags_container">
                <h4>Emneknagger</h4>
                {tags.map(tag => {
                  return (
                    <Chip
                      style={{ margin: 4 }}
                      key={tag}
                      label={tag}
                      clickable
                      color={tagFilter[tag] ? "primary" : "default"}
                      onClick={() => {
                        onFilterTag(tag, !tagFilter[tag]);
                      }}
                      onDelete={() => {
                        onFilterTag(tag, false);
                      }}
                      deleteIcon={tagFilter[tag] ? null : <DoneIcon />}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}

        {kartlag.kart && kartlag.kart.format.wms && (
          <>
            {kartlag.produktark && (
              <>
                <ListItem button>
                  <ListItemIcon>
                    <Description />
                  </ListItemIcon>
                  <ListItemText primary="Produktark" />
                </ListItem>
              </>
            )}

            <ListItem
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
                <OpenInNew style={{ color: "#555" }} />
              </ListItemSecondaryAction>
            </ListItem>

            {kartlag.dataeier && (
              <>
                <ListItem
                  button
                  onClick={e => {
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
                  {kartlag.kildeurl && <OpenInNew />}
                </ListItem>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Kartlag;
