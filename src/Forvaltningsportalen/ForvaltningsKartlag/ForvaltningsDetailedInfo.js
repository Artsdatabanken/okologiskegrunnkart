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
import React, { useState, useEffect } from "react";
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
  allCategories,
  kartlag,
  underlag,
  kartlagKey,
  underlagKey,
  toggleSublayer,
  toggleAllSublayers,
  onUpdateLayerProp,
  hideSublayerDetails
}) => {
  const [tags, setTags] = useState(null);
  const [isLargeIcon, setIsLargeIcon] = useState(false);
  const [sublayer, setSublayer] = useState(null);
  const [underlagTittel, setUnderlagTittel] = useState(null);
  const [erSynlig, setErSynlig] = useState(null);
  const [visible, setVisible] = useState(null);
  const [sliderValue, setSliderValue] = useState(80);
  const [listLegends, setListLegends] = useState([]);

  const kartlagJSON = JSON.stringify(kartlag);

  useEffect(() => {
    if (kartlag) {
      setTags(kartlag.tags);
      const largeIcon = [
        "Arealressurs",
        "Arter",
        "Klima",
        "Skog",
        "Landskap"
      ].includes(kartlag.tema);
      setIsLargeIcon(largeIcon);
    }
  }, [kartlag, kartlagJSON]);

  useEffect(() => {
    if (kartlag) {
      const sublayer = underlag ? underlag : kartlag.allcategorieslayer;
      setSublayer(sublayer);
      setUnderlagTittel(sublayer.tittel);
      setErSynlig(sublayer.erSynlig);
      const visible = underlag ? sublayer.visible : sublayer.erSynlig;
      setVisible(visible);
      setSliderValue(sublayer.opacity || 80);
      const legends = [];
      if (underlag && underlag.legendeurl) {
        legends.push(underlag.legendeurl);
        Object.keys(kartlag.underlag).forEach(key => {
          const sub = kartlag.underlag[key];
          if (
            sub.wmslayer.toLowerCase().includes("dekningskart") &&
            sub.legendeurl
          ) {
            legends.push(sub.legendeurl);
          }
        });
      } else {
        Object.keys(kartlag.underlag).forEach(key => {
          const sub = kartlag.underlag[key];
          if (sub.legendeurl) legends.push(sub.legendeurl);
        });
      }
      setListLegends(legends);
      console.log(legends);
    }
  }, [kartlag, kartlagJSON, underlag]);

  const handleSliderChange = value => {
    setSliderValue(value / 100);
  };

  const changeLayerOpacity = value => {
    setSliderValue(value / 100);
    if (allCategories || kartlag.allcategorieslayer.erSynlig) {
      let kode = "allcategorieslayer.";
      onUpdateLayerProp(kartlagKey, kode + "opacity", value / 100.0);
      Object.keys(kartlag.underlag).forEach(underlagKey => {
        kode = "underlag." + underlagKey + ".";
        onUpdateLayerProp(kartlagKey, kode + "opacity", value / 100.0);
      });
    } else {
      let kode = "underlag." + underlagKey + ".";
      onUpdateLayerProp(kartlagKey, kode + "opacity", value / 100.0);
      let maxOpacity = 0;
      Object.keys(kartlag.underlag).forEach(underlagKey => {
        const opacity = kartlag.underlag[underlagKey].opacity;
        if (opacity > maxOpacity) maxOpacity = opacity;
      });
      onUpdateLayerProp(kartlagKey, "allcategorieslayer.opacity", maxOpacity);
    }
  };
  const openInNewTabWithoutOpener = url => {
    // Done this way for security reasons
    var newTab = window.open();
    newTab.opener = null;
    newTab.location = url;
  };

  const toggleSublayerDetail = () => {
    if (allCategories) {
      toggleAllSublayers(kartlagKey);
    } else {
      const kode = "underlag." + underlagKey + ".";
      toggleSublayer(kartlagKey, underlagKey, kode, !erSynlig, !visible);
    }
  };

  if (!kartlag.tittel || !underlagTittel) return null;
  return (
    <>
      <ListItem
        // Kartlag
        id="details-title-wrapper"
        button
        onClick={() => {
          hideSublayerDetails();
        }}
      >
        <ListItemIcon>
          <KeyboardBackspace />
        </ListItemIcon>
        <ListItemText>
          <span className="details-title-text">Detaljert info om lag</span>
        </ListItemText>
      </ListItem>

      <div className="details-content-wrapper">
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
                  size={isLargeIcon ? 30 : 26}
                  padding={isLargeIcon ? 0 : 2}
                  color={kartlag.visible ? "#666" : "#999"}
                />
              </Badge>
            </div>
          </ListItemIcon>
          <ListItemText primary={kartlag.tittel} />
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
                        <OpenInNew />
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
                        {/* <OpenInNew
                          className="iconbutton"
                          onClick={e => {
                            openInNewTabWithoutOpener(kartlag.produktark);
                          }}
                        /> */}
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
                        style={{ maxWidth: "24px", maxHeight: "24px" }}
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
              checked={visible}
              onChange={e => {
                toggleSublayerDetail();
              }}
              onKeyDown={e => {
                if (e.keyCode === 13) {
                  toggleSublayerDetail();
                }
              }}
            />
          </ListItemIcon>
          <ListItemText
            primary={allCategories ? "Alle kategorier" : underlag.tittel}
          />
          {sublayer.suggested && (
            <ListItemIcon id="bookmark-icon">
              <CustomIcon
                id="bookmark"
                icon="check-decagram"
                size={20}
                padding={0}
                color={visible ? "#666" : "#999"}
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
              disabled={!visible}
            />
            <Visibility
              id={
                visible
                  ? "opacity-visible-icon"
                  : "opacity-visible-icon-disabled"
              }
              color="primary"
              style={{ paddingRight: 0, paddingLeft: 15 }}
            />
          </div>

          {listLegends.length > 0 && (
            <>
              <Typography id="legend-sublayer" variant="body2" gutterBottom>
                Tegnforklaring
              </Typography>
              <div className="legend-sublayer-list">
                {listLegends.map((url, index) => {
                  return <img key={index} alt="tegnforklaring" src={url} />;
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ForvaltningsDetailedInfo;
