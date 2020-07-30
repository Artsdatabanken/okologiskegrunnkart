import Geonorge from "./Geonorge";
import {
  // ExpandLess,
  // ExpandMore,
  Visibility,
  VisibilityOff,
  OpenInNew,
  Link,
  Description,
  Layers,
  KeyboardBackspace
} from "@material-ui/icons";
import React, { useState } from "react";
import {
  Slider,
  ListItemIcon,
  // Collapse,
  ListItem,
  ListItemText,
  Typography,
  Badge
} from "@material-ui/core";
import CustomIcon from "../../Common/CustomIcon";
import CustomSwitch from "../../Common/CustomSwitch";

const ForvaltningsDetailedInfo = ({
  kartlag,
  underlag,
  kartlagKey,
  underlagKey,
  onUpdateLayerProp,
  hideSublayerDetails
}) => {
  const tittel = kartlag.tittel;
  // const [openFakta, setOpenFakta] = useState(false);
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
  const openInNewTabWithoutOpener = url => {
    // Done this way for security reasons
    var newTab = window.open();
    newTab.opener = null;
    newTab.location = url;
  };
  const isLargeIcon = tema => {
    return ["Arealressurs", "Arter", "Klima", "Skog", "Landskap"].includes(
      tema
    );
  };

  if (!tittel || !underlagTittel) return null;
  return (
    <>
      <ListItem
        // Kartlag
        id="legend-title-wrapper"
        button
        onClick={() => {
          hideSublayerDetails();
        }}
      >
        <ListItemIcon>
          <KeyboardBackspace />
        </ListItemIcon>
        <ListItemText>
          <span className="legend-title-text">Detaljert info om lag</span>
        </ListItemText>
      </ListItem>

      <ListItem
        // Elementet som inneholder tittel, ikon og droppned-knapp
        id="layer-details-list"
        divider
      >
        <ListItemIcon>
          <div className="layer-list-element-icon">
            <Badge
              className={"badge-enabled"}
              badgeContent={kartlag.numberVisible || 0}
              color="primary"
            >
              <CustomIcon
                id="kartlag"
                icon={kartlag.tema}
                size={isLargeIcon(kartlag.tema) ? 30 : 26}
                padding={isLargeIcon(kartlag.tema) ? 0 : 2}
                color={kartlag.erSynlig ? "#666" : "#999"}
              />
            </Badge>
          </div>
        </ListItemIcon>
        <ListItemText primary={tittel} />
      </ListItem>

      <div className="sublayer-details-div">
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
          <div className="data-owner-wrapper">
            {kartlag.produktark && (
              <>
                <ListItem
                  button
                  onClick={e => {
                    openInNewTabWithoutOpener(kartlag.produktark);
                  }}
                >
                  <ListItemIcon>
                    <Description />
                  </ListItemIcon>
                  <ListItemText primary="Produktark" />
                  {kartlag.produktark && (
                    <>
                      {/* {openFakta ? (
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
                      )} */}
                      <OpenInNew
                        className="iconbutton"
                        onClick={e => {
                          openInNewTabWithoutOpener(kartlag.produktark);
                        }}
                      />
                    </>
                  )}
                </ListItem>

                {/* {kartlag.produktark && (
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
                )} */}
              </>
            )}

            <ListItem
              button
              onClick={e => {
                openInNewTabWithoutOpener(
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
                    openInNewTabWithoutOpener(kartlag.kildeurl);
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

      <ListItem
        // Underlag
        id="sublayer-details-list"
      >
        <ListItemIcon>
          <CustomSwitch
            tabIndex="0"
            id="visiblility-sublayer-toggle"
            checked={erSynlig}
            onChange={e => {
              onUpdateLayerProp(
                kartlagKey,
                kode + "erSynlig",
                !underlag.erSynlig
              );
            }}
            onKeyDown={e => {
              if (e.keyCode === 13) {
                onUpdateLayerProp(
                  kartlagKey,
                  kode + "erSynlig",
                  !underlag.erSynlig
                );
              }
            }}
          />
        </ListItemIcon>
        <ListItemText primary={tittel} />
        {underlag.suggested && (
          <ListItemIcon id="bookmark-icon">
            <CustomIcon
              id="bookmark"
              icon="check-decagram"
              size={20}
              padding={0}
              color={erSynlig ? "#666" : "#999"}
            />
          </ListItemIcon>
        )}
      </ListItem>

      <div className="sublayer-details-wrapper">
        <div className="opacity-slider-wrapper">
          <VisibilityOff
            id="opacity-invisible-icon"
            color="primary"
            style={{ paddingRight: 15 }}
          />
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
    </>
  );
};

export default ForvaltningsDetailedInfo;
