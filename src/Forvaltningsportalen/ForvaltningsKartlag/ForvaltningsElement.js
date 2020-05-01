import Geonorge from "./Geonorge";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import React, { useState } from "react";
import {
  OpenInNew,
  VisibilityOutlined,
  Link,
  Description,
  Layers,
  VisibilityOffOutlined
} from "@material-ui/icons";
import {
  Typography,
  Slider,
  IconButton,
  ListItemIcon,
  Collapse,
  ListItem,
  ListItemText
} from "@material-ui/core";

const ForvaltningsElement = ({
  kartlag,
  erAktivtLag,
  onUpdateLayerProp,
  handleShowCurrent,
  show_current,
  kartlag_key,
  valgt,
  element
}) => {
  let tittel = kartlag.tittel;

  let kode = kartlag_key;
  const erSynlig = kartlag.erSynlig;
  let startstate = valgt || false;
  const [open, setOpen] = useState(startstate);
  const [openFakta, setOpenFakta] = useState(false);
  const [hasLegend, setHasLegend] = useState(true);
  if (!tittel) return null;
  let tags = kartlag.tags || null;

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
            className="visibility_button"
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

        {!valgt && <>{open ? <ExpandLess /> : <ExpandMore />}</>}
      </ListItem>

      <Collapse
        in={open}
        timeout="auto"
        unmountOnExit
        // Underelementet
      >
        <div className="collapsed_container">
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
              <h4>Gjennomsiktighet</h4>
              <Slider
                value={100 * kartlag.opacity}
                step={1}
                min={0}
                max={100}
                onChange={(e, v) => {
                  onUpdateLayerProp(kode, "opacity", v / 100.0);
                }}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                getAriaValueText={opacity => opacity + " %"}
              />

              {kartlag.produktark && (
                <>
                  <ListItem>
                    <ListItemIcon>
                      <Description />
                    </ListItemIcon>
                    <ListItemText primary="Produktark" />
                    {kartlag.produktark && (
                      <>
                        <OpenInNew
                          className="iconbutton"
                          onClick={e => {
                            window.open(kartlag.produktark);
                          }}
                        />

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
                </>
              )}

              {hasLegend && (
                <>
                  <Typography id="range-slider" gutterBottom>
                    Tegnforklaring
                  </Typography>
                  <div style={{ paddingLeft: 56 }}>
                    <img
                      alt="legend"
                      onError={() => setHasLegend(false)}
                      src={`${kartlag.kart.format.wms.url}?layer=${kartlag.kart.format.wms.layer}&request=GetLegendGraphic&format=image/png&version=1.3.0`}
                    />
                  </div>
                </>
              )}
              {kartlag.legendeurl && (
                <>
                  <Typography id="range-slider" gutterBottom>
                    Tegnforklaring
                  </Typography>
                  <div style={{ paddingLeft: 56 }}>
                    <img
                      alt="legend"
                      src={kartlag.legendeurl}
                      style={{ maxWidth: "90%" }}
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </Collapse>
    </>
  );
};

export default ForvaltningsElement;
