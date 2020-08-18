import ForvaltningsKartlag from "./ForvaltningsKartlag/ForvaltningsKartlag";
import React, { useState, useEffect } from "react";
import "../style/kartlagfane.css";
import ForvaltningsElement from "./ForvaltningsKartlag/ForvaltningsElement";
import PolygonElement from "./PolygonElement";
import Tegnforklaring from "../Tegnforklaring/Tegnforklaring";
import { KeyboardBackspace } from "@material-ui/icons";
import CustomIcon from "../Common/CustomIcon";
import { Button } from "@material-ui/core";
import ForvaltningsDetailedInfo from "./ForvaltningsKartlag/ForvaltningsDetailedInfo";
import useWindowDimensions from "../Funksjoner/useWindowDimensions";

const KartlagFanen = props => {
  const [underlag, setUnderlag] = useState(null);
  const [kartlagKey, setKartlagKey] = useState(null);
  const [underlagKey, setUnderlagKey] = useState(null);
  const [fullscreen, setFullscreen] = useState(null);
  const [Y, setY] = useState(0);
  const [DY, setDY] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);
  const [inTransition, setInTransition] = useState(null);

  const showSublayerDetails = (underlag, kartlagKey, underlagKey) => {
    setUnderlag(underlag);
    setKartlagKey(kartlagKey);
    setUnderlagKey(underlagKey);
    props.setSublayerDetailsVisible(true);
  };

  const hideSublayerDetails = () => {
    props.setSublayerDetailsVisible(false);
    setUnderlag(null);
    setKartlagKey(null);
    setUnderlagKey(null);
  };

  const showSublayerDetailsFromSearch = (underlag, kartlagKey, underlagKey) => {
    setUnderlag(underlag);
    setKartlagKey(kartlagKey);
    setUnderlagKey(underlagKey);
    props.removeValgtLag();
    props.setSublayerDetailsVisible(true);
  };

  const { isMobile } = useWindowDimensions();

  const { showSideBar, handleSideBar, legendVisible } = props;

  const toggleSideBarVisible = async () => {
    if (window.innerWidth > 768) {
      const kartlag = document.querySelector(".kartlag_fanen");
      kartlag.classList.toggle("kartlag-hidden", false);
      setInTransition("moving");
    }
  };

  const toggleSideBar = () => {
    if (fullscreen) {
      handleSideBar(true);
    } else if (showSideBar) {
      handleSideBar(false);
    } else {
      handleSideBar(true);
    }
    setFullscreen(false);
  };

  useEffect(() => {
    if (DY < 0 && Y !== 0) {
      if (Math.abs(DY) > screenHeight * 0.4) {
        handleSideBar(false);
        setFullscreen(true);
      } else if (!showSideBar && !fullscreen) {
        handleSideBar(true);
        setFullscreen(false);
      } else if (showSideBar) {
        handleSideBar(false);
        setFullscreen(true);
      }
      setY(0);
    } else if (DY > 0 && Y !== 0) {
      if (Math.abs(DY) > screenHeight * 0.6 - 50) {
        handleSideBar(false);
        setFullscreen(false);
      } else if (fullscreen) {
        handleSideBar(true);
        setFullscreen(false);
      } else if (showSideBar) {
        handleSideBar(false);
        setFullscreen(false);
      }
      setY(0);
    }
  }, [Y, DY, screenHeight, showSideBar, fullscreen, handleSideBar]);

  useEffect(() => {
    const kartlag = document.querySelector(".kartlag_fanen");
    if (inTransition === "finished" && !showSideBar) {
      kartlag.classList.toggle("kartlag-hidden", true);
      setInTransition(null);
    }
  }, [inTransition, showSideBar]);

  useEffect(() => {
    if (!isMobile) return;

    let y0 = 0;
    let disp = 0;
    let locked = false;

    const kartlagSlider = document.querySelector(".toggle-kartlag-wrapper");
    const kartlag = document.querySelector(".kartlag_fanen");

    if (!kartlagSlider || !kartlag) return;

    function lock(e) {
      if (
        e.changedTouches &&
        e.changedTouches.length > 0 &&
        e.changedTouches[0].clientY
      ) {
        locked = true;
        setScreenHeight(window.innerHeight);
        y0 = e.changedTouches[0].clientY;
        kartlagSlider.classList.toggle("swiper-animation", !locked);
        kartlag.classList.toggle("kartlag-animation", !locked);
      }
    }

    function drag(e) {
      e.preventDefault();
      if (locked) {
        disp = -Math.round(e.changedTouches[0].clientY - y0);
        kartlagSlider.style.setProperty("--h", disp + "px");
        kartlag.style.setProperty("--h", disp + "px");
      }
    }

    function move(e) {
      if (locked) {
        locked = false;
        const dy = e.changedTouches[0].clientY - y0;
        setDY(dy);
        setY(y0);
        disp = 0;
        kartlagSlider.classList.toggle("swiper-animation", !locked);
        kartlagSlider.style.setProperty("--h", 0 + "px");
        kartlag.classList.toggle("kartlag-animation", !locked);
        kartlag.style.setProperty("--h", 0 + "px");
      }
    }

    kartlagSlider.addEventListener("touchstart", lock, false);
    kartlagSlider.addEventListener("touchend", move, false);
    kartlagSlider.addEventListener("touchmove", drag, false);

    return () => {
      kartlagSlider.removeEventListener("touchstart", lock, false);
      kartlagSlider.removeEventListener("touchend", move, false);
      kartlagSlider.addEventListener("touchmove", drag, false);
    };
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) return;

    const toggleButton = document.querySelector(".toggle-side-bar-wrapper");
    if (!toggleButton) return;

    function hide(e) {
      if (
        e.srcElement.className &&
        e.srcElement.className.includes("toggle-side-bar-wrapper") &&
        e.propertyName === "right"
      ) {
        setInTransition("finished");
      }
    }

    toggleButton.addEventListener("transitionend", hide, false);

    return () => {
      toggleButton.removeEventListener("transitionend", hide, false);
    };
  }, [isMobile]);

  return (
    <>
      {!isMobile && (
        <div
          className={`toggle-side-bar-wrapper right-animation${
            props.showSideBar ? " side-bar-open" : ""
          }`}
        >
          <Button
            id="toggle-side-bar-button"
            variant="contained"
            size="small"
            onClick={() => {
              toggleSideBarVisible();
              setTimeout(function() {
                toggleSideBar();
              }, 25);
            }}
          >
            <CustomIcon
              id="show-layers-icon"
              icon={props.showSideBar ? "menu-right" : "menu-left"}
              size={30}
            />
          </Button>
        </div>
      )}
      {isMobile && (
        <div
          className={`toggle-kartlag-wrapper swiper-animation${
            fullscreen
              ? " side-bar-fullscreen"
              : props.showSideBar
              ? " side-bar-open"
              : ""
          }${legendVisible ? " legend-visible" : ""}`}
        >
          <button
            id="toggle-kartlag-button"
            variant="contained"
            size="small"
            tabIndex="-1"
            onClick={() => {
              toggleSideBar();
            }}
          >
            <CustomIcon
              id="show-layers-icon"
              icon="drag-horizontal"
              color="#666"
              size={30}
            />
          </button>
        </div>
      )}
      <div
        className={`kartlag_fanen kartlag-animation${
          fullscreen
            ? " side-bar-fullscreen"
            : props.showSideBar
            ? " side-bar-open"
            : ""
        }`}
      >
        {props.legendVisible && (
          <Tegnforklaring
            layers={props.kartlag}
            setLegendVisible={props.setLegendVisible}
          />
        )}
        {props.searchResultPage ? (
          <></>
        ) : props.valgtLag ? (
          <div className="valgtLag">
            <button
              className="listheadingbutton"
              onClick={e => {
                props.removeValgtLag();
              }}
            >
              <KeyboardBackspace />
              <span>Tilbake</span>
            </button>
            <div
              className={`scroll_area${
                fullscreen ? " side-bar-fullscreen" : ""
              }`}
            >
              <ForvaltningsElement
                valgt={true}
                kartlagKey={props.valgtLag.id}
                kartlag={props.valgtLag}
                key={props.valgtLag.id}
                onUpdateLayerProp={props.onUpdateLayerProp}
                changeVisibleSublayers={props.changeVisibleSublayers}
                changeExpandedLayers={props.changeExpandedLayers}
                zoom={props.zoom}
                showSublayerDetails={showSublayerDetailsFromSearch}
              />
            </div>
          </div>
        ) : (
          <>
            <div
              className={
                props.sublayerDetailsVisible || props.legendVisible
                  ? "hidden-app-content"
                  : ""
              }
            >
              {props.polyline.length > 0 && props.polygon && (
                <h3 className="container_header">Polygon</h3>
              )}
              <div
                className={`scroll_area${
                  fullscreen ? " side-bar-fullscreen" : ""
                }`}
              >
                {(props.polyline.length > 0 || props.polygon) && (
                  <PolygonElement
                    polygon={props.polygon}
                    polyline={props.polyline}
                    showPolygon={props.showPolygon}
                    hideAndShowPolygon={props.hideAndShowPolygon}
                    handleEditable={props.handleEditable}
                    addPolygon={props.addPolygon}
                    addPolyline={props.addPolyline}
                  />
                )}
                <ForvaltningsKartlag
                  kartlag={props.kartlag}
                  onUpdateLayerProp={props.onUpdateLayerProp}
                  changeVisibleSublayers={props.changeVisibleSublayers}
                  changeExpandedLayers={props.changeExpandedLayers}
                  zoom={props.zoom}
                  showSublayerDetails={showSublayerDetails}
                  setLegendVisible={props.setLegendVisible}
                />
              </div>
            </div>
            {props.sublayerDetailsVisible && (
              <div>
                <div className="layer-details-div">
                  <ForvaltningsDetailedInfo
                    kartlag={props.kartlag[kartlagKey]}
                    underlag={underlag}
                    kartlagKey={kartlagKey}
                    underlagKey={underlagKey}
                    onUpdateLayerProp={props.onUpdateLayerProp}
                    hideSublayerDetails={hideSublayerDetails}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default KartlagFanen;
