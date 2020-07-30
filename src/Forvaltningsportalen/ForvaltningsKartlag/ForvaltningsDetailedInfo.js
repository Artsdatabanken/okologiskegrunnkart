import Geonorge from "./Geonorge";
import {
  ExpandLess,
  ExpandMore,
  Visibility,
  VisibilityOff,
  OpenInNew,
  Link,
  Description,
  Layers
} from "@material-ui/icons";
import React, { useState } from "react";
import {
  Slider,
  ListItemIcon,
  Collapse,
  ListItem,
  ListItemText,
  Typography
} from "@material-ui/core";
import ForvaltningsUnderElement from "./ForvaltningsUnderElement";

const ForvaltningsDetailedInfo = ({
  kartlag,
  underlag,
  kartlagKey,
  underlagKey,
  valgt,
  onUpdateLayerProp,
  zoom,
  showSublayerDetails
}) => {
  const tittel = kartlag.tittel;
  const [openFakta, setOpenFakta] = useState(false);
  let tags = kartlag.tags || null;

  const underlagTittel = underlag.tittel;
  const erSynlig = underlag.erSynlig;
  const [sliderValue, setSliderValue] = useState(underlag.opacity || 80);
  let kode = "underlag." + underlagKey + ".";

  const handleSliderChange = value => {
    setSliderValue(value / 100);
  };
  const changeLayerOpacity = value => {
    setSliderValue(value / 100);
    onUpdateLayerProp(kartlagKey, kode + "opacity", value / 100.0);
  };

  if (!tittel || !underlagTittel) return null;
  return (
    <>
      <ForvaltningsUnderElement
        underlag={underlag}
        kartlagKey={kartlagKey}
        underlagKey={underlagKey}
        onUpdateLayerProp={onUpdateLayerProp}
        zoom={zoom}
        showSublayerDetails={showSublayerDetails}
      />

      <div className="underlag_collapse">
        <div className="collapsed_container">
          <div>
            <div className="opacity-slider-wrapper">
              <VisibilityOff id="opacity-invisible-icon" color="primary" />
              <Slider
                color="primary"
                value={Math.round(100 * sliderValue)}
                step={1}
                min={0}
                max={100}
                onChange={(e, v) => {
                  handleSliderChange(v);
                }}
                onChangeCommitted={(e, v) => {
                  changeLayerOpacity(v);
                }}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                getAriaValueText={opacity => opacity + " %"}
                disabled={!erSynlig}
              />
              <Visibility
                id={
                  erSynlig
                    ? "opacity-visible-icon"
                    : "opacity-visible-icon-disabled"
                }
                color="primary"
                style={{ paddingRight: 0, paddingLeft: 15 }}
              />
            </div>

            {underlag.legendeurl && (
              <>
                <Typography id="legend-sublayer" variant="body2" gutterBottom>
                  Tegnforklaring
                </Typography>
                <img alt="tegnforklaring" src={underlag.legendeurl} />
              </>
            )}
          </div>
        </div>
      </div>

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
                window.open(kartlag.geonorgeurl || "https://www.geonorge.no/");
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
    </>
  );
};

export default ForvaltningsDetailedInfo;
