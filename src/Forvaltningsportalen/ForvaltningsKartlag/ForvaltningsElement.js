import Geonorge from "./Geonorge";
import React, { useState } from "react";
import {
  OpenInNew,
  VisibilityOutlined,
  Link,
  Description,
  Layers,
  Category as CategoryIcon,
  Done as DoneIcon,
  VisibilityOffOutlined
} from "@material-ui/icons";
import {
  Chip,
  IconButton,
  ListItemIcon,
  ListItemSecondaryAction,
  Collapse,
  ListItem,
  ListItemText
} from "@material-ui/core";
import ForvaltningsUnderElement from "./ForvaltningsUnderElement";

const ForvaltningsElement = ({
  kartlag,
  onUpdateLayerProp,
  kartlag_key,
  tagFilter,
  onFilterTag,
  valgt
}) => {
  let tittel = kartlag.tittel;
  let kode = kartlag_key;
  const erSynlig = kartlag.erSynlig;
  let startstate = valgt || false;
  const [open, setOpen] = useState(startstate);
  const [openFakta, setOpenFakta] = useState(false);
  if (!tittel) return null;
  let tags = kartlag.tags || [];

  return (
    <>
      <ListItem
        // Elementet som inneholder tittel, visningsøye og droppned-knapp
        button
        onClick={() => {
          if (!valgt) {
            setOpen(!open);
          }
        }}
      >
        <ListItemIcon onClick={e => e.stopPropagation()}>
          <IconButton
            _className="visibility_button"
            onClick={e => {
              onUpdateLayerProp(kode, "erSynlig", !erSynlig);
              e.stopPropagation();
            }}
          >
            {erSynlig ? (
              <VisibilityOutlined style={{ color: "#333" }} />
            ) : (
              <VisibilityOffOutlined style={{ color: "#aaa" }} />
            )}
          </IconButton>
        </ListItemIcon>
        <ListItemText primary={tittel.nb || tittel} />
      </ListItem>

      <Collapse
        in={open}
        timeout="auto"
        unmountOnExit
        // Underelementet
      >
        {kartlag.underlag && (
          <>
            {Object.keys(kartlag.underlag).map(sublag => {
              let lag = kartlag.underlag[sublag];

              return (
                <div _className="underlag" key={sublag}>
                  <ForvaltningsUnderElement
                    kartlag={lag}
                    kartlag_owner_key={kartlag_key}
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
      </Collapse>
    </>
  );
};

export default ForvaltningsElement;
