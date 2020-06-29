import Geonorge from "./Geonorge";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import React, { useState } from "react";
import { OpenInNew, Link, Description, Layers } from "@material-ui/icons";
import {
  ListItemIcon,
  Collapse,
  ListItem,
  ListItemText
} from "@material-ui/core";
import ForvaltningsUnderElement from "./ForvaltningsUnderElement";
import CustomIcon from "../../Common/CustomIcon";
import DisabledTooltip from "../../Common/DisabledTooltip";
import Badge from "@material-ui/core/Badge";
import { zoomRangeLayer, zoomRangeBadge } from "../../Funksjoner/zoomRange";

const ForvaltningsElement = ({
  kartlag,
  onUpdateLayerProp,
  kartlag_key,
  valgt,
  zoom
}) => {
  let tittel = kartlag.tittel;
  const erSynlig = kartlag.erSynlig;
  let startstate = valgt || false;
  const [open, setOpen] = useState(startstate);
  const [openFakta, setOpenFakta] = useState(false);
  if (!tittel) return null;
  let tags = kartlag.tags || null;

  const { disabled, description } = zoomRangeLayer(
    zoom,
    kartlag.underlag || {}
  );

  const disabledBadge = zoomRangeBadge(zoom, kartlag.underlag || {});
  const isLargeIcon = tema => {
    return ["Arealressurs", "Arter", "Klima", "Skog", "Landskap"].includes(
      tema
    );
  };

  return (
    <>
      {disabled ? (
        <DisabledTooltip
          id="tooltip-zoom-layer"
          placement="left"
          title={description}
        >
          <ListItem
            // Elementet som inneholder tittel, visningsøye og droppned-knapp
            id="layer-list-item"
            button
            divider
            onClick={() => {
              if (!valgt) {
                setOpen(!open);
              }
            }}
          >
            <ListItemIcon>
              <div className="layer-list-element-icon">
                <Badge
                  className="badge-disabled"
                  badgeContent={kartlag.numberVisible || 0}
                  color="secondary"
                >
                  <CustomIcon
                    id="kartlag"
                    icon={kartlag.tema}
                    size={isLargeIcon(kartlag.tema) ? 30 : 26}
                    padding={isLargeIcon(kartlag.tema) ? 0 : 2}
                    color={"#ccc"}
                  />
                </Badge>
              </div>
            </ListItemIcon>
            <ListItemText
              className="layer-disabled"
              primary={tittel.nb || tittel}
            />
            {!valgt && <>{open ? <ExpandLess /> : <ExpandMore />}</>}
          </ListItem>
        </DisabledTooltip>
      ) : (
        <ListItem
          // Elementet som inneholder tittel, ikon og droppned-knapp
          id="layer-list-item"
          button
          divider
          onClick={() => {
            if (!valgt) {
              setOpen(!open);
            }
          }}
        >
          <ListItemIcon>
            <div className="layer-list-element-icon">
              <Badge
                className={disabledBadge ? "badge-disabled" : ""}
                badgeContent={kartlag.numberVisible || 0}
                color="secondary"
              >
                <CustomIcon
                  id="kartlag"
                  icon={kartlag.tema}
                  size={isLargeIcon(kartlag.tema) ? 30 : 26}
                  padding={isLargeIcon(kartlag.tema) ? 0 : 2}
                  color={erSynlig ? "#666" : "#999"}
                  tooltipText={kartlag.tema}
                />
              </Badge>
            </div>
          </ListItemIcon>
          <ListItemText primary={tittel.nb || tittel} />
          {!valgt && <>{open ? <ExpandLess /> : <ExpandMore />}</>}
        </ListItem>
      )}

      <Collapse
        in={open}
        timeout="auto"
        unmountOnExit
        // Underelementet
      >
        <div className="collapsed_container">
          {kartlag.underlag && (
            <>
              {Object.keys(kartlag.underlag).map(sublag => {
                let lag = kartlag.underlag[sublag];

                return (
                  <div className="underlag" key={sublag}>
                    <ForvaltningsUnderElement
                      kartlag={lag}
                      kartlag_owner_key={kartlag_key}
                      kartlag_key={sublag}
                      onUpdateLayerProp={onUpdateLayerProp}
                      zoom={zoom}
                    />
                  </div>
                );
              })}
            </>
          )}

          {tags && (
            <div className="tags_container">
              <h4>Emneknagger</h4>
              {tags.map((element, index) => {
                return (
                  <div className="tags" key={index}>
                    {element}
                  </div>
                );
              })}
            </div>
          )}

          {kartlag.kart && kartlag.kart.format.wms && (
            <div>
              {kartlag.produktark && (
                <>
                  <ListItem>
                    <ListItemIcon>
                      <Description />
                    </ListItemIcon>
                    <ListItemText primary="Produktark" />
                    {kartlag.produktark && (
                      <>
                        {openFakta ? (
                          <ExpandLess
                            className="iconbutton"
                            onClick={e => {
                              setOpenFakta(!openFakta);
                            }}
                          />
                        ) : (
                          <ExpandMore
                            className="iconbutton"
                            onClick={e => {
                              setOpenFakta(!openFakta);
                            }}
                          />
                        )}
                        <OpenInNew
                          className="iconbutton"
                          onClick={e => {
                            window.open(kartlag.produktark);
                          }}
                        />
                      </>
                    )}
                  </ListItem>

                  {kartlag.produktark && (
                    <Collapse in={openFakta} timeout="auto" unmountOnExit>
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
                        title="Produktark"
                        src={kartlag.produktark}
                      />
                    </Collapse>
                  )}
                </>
              )}

              <ListItem
                button
                onClick={e => {
                  window.open(
                    kartlag.geonorgeurl || "https://www.geonorge.no/"
                  );
                }}
              >
                <ListItemIcon>
                  <Geonorge />
                </ListItemIcon>
                <ListItemText primary="Datasettet på Geonorge.no" />
                <OpenInNew />
              </ListItem>

              {kartlag.dataeier && (
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
                        src={kartlag.logourl}
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
              )}
            </div>
          )}
        </div>
      </Collapse>
    </>
  );
};

export default ForvaltningsElement;
