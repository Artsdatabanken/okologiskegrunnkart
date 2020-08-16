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

const KartlagFanen = props => {
  // const [showDetails, setShowDetails] = useState(false);
  const [underlag, setUnderlag] = useState(null);
  const [kartlagKey, setKartlagKey] = useState(null);
  const [underlagKey, setUnderlagKey] = useState(null);
  const [fullscreen, setFullscreen] = useState(null);
  const [Y, setY] = useState(0);
  const [DY, setDY] = useState(0);

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

  const { showSideBar, handleSideBar } = props;

  const toggleSideBar = () => {
    if (fullscreen) {
      handleSideBar(true);
      setFullscreen(false);
    } else if (showSideBar) {
      handleSideBar(false);
    } else {
      handleSideBar(true);
    }
    setFullscreen(false);
  };

  useEffect(() => {
    if (DY < 0 && Y !== 0) {
      if (!showSideBar && !fullscreen) {
        handleSideBar(true);
        setFullscreen(false);
      } else if (showSideBar) {
        handleSideBar(false);
        setFullscreen(true);
      }
      setY(0);
    } else if (DY > 0 && Y !== 0) {
      if (fullscreen) {
        handleSideBar(true);
        setFullscreen(false);
      } else if (showSideBar) {
        handleSideBar(false);
        setFullscreen(false);
      }
      setY(0);
    }
  }, [Y, DY, showSideBar, fullscreen, handleSideBar]);

  useEffect(() => {
    let y0 = 0;
    let disp = 0;

    const kartlagSlider = document.querySelector(".toggle-kartlag-wrapper");
    const kartlag = document.querySelector(".kartlag_fanen");
    const kartlagBack = document.querySelector(".fullscreen-button-back");
    kartlag.style.setProperty("--h", disp + "px");

    function lock(e) {
      if (
        e.changedTouches &&
        e.changedTouches.length > 0 &&
        e.changedTouches[0].clientY
      ) {
        y0 = e.changedTouches[0].clientY;
      }
    }

    function move(e) {
      if (
        e.changedTouches &&
        e.changedTouches.length > 0 &&
        e.changedTouches[0].clientY
      ) {
        const dy = e.changedTouches[0].clientY - y0;
        setDY(dy);
        setY(y0);
        disp = 0;
        kartlagSlider.style.setProperty("--h", 0 + "px");
        kartlag.style.setProperty("--h", 0 + "px");
        kartlagBack.style.setProperty("--h", 0 + "px");
      }
    }

    function drag(e) {
      disp = -(e.changedTouches[0].clientY - y0);
      kartlagSlider.style.setProperty("--h", disp + "px");
      kartlag.style.setProperty("--h", disp + "px");
      kartlagBack.style.setProperty("--h", disp + "px");
    }

    kartlagSlider.addEventListener("touchstart", lock, false);
    kartlagSlider.addEventListener("touchend", move, false);
    kartlagSlider.addEventListener("touchmove", drag, false);

    return () => {
      kartlagSlider.removeEventListener("touchstart", lock, false);
      kartlagSlider.removeEventListener("touchend", move, false);
      kartlagSlider.addEventListener("touchmove", drag, false);
    };
  }, []);

  return (
    <>
      <div
        className={`toggle-side-bar-wrapper${
          props.showSideBar ? " side-bar-open" : ""
        }`}
      >
        <Button
          id="toggle-side-bar-button"
          variant="contained"
          size="small"
          onClick={() => {
            toggleSideBar();
          }}
        >
          <CustomIcon
            id="show-layers-icon"
            icon={props.showSideBar ? "menu-right" : "menu-left"}
            size={30}
          />
        </Button>
      </div>
      <div
        className={`fullscreen-button-back${
          fullscreen ? " side-bar-fullscreen" : ""
        }`}
      />
      <div
        className={`toggle-kartlag-wrapper${
          fullscreen
            ? " side-bar-fullscreen"
            : props.showSideBar
            ? " side-bar-open"
            : ""
        }`}
      >
        <Button
          id="toggle-kartlag-button"
          variant="contained"
          size="small"
          onClick={() => {
            toggleSideBar();
          }}
        >
          <CustomIcon
            id="show-layers-icon"
            icon={
              fullscreen
                ? "menu-down"
                : props.showSideBar
                ? "menu-up-down"
                : "menu-up"
            }
            size={30}
          />
        </Button>
      </div>
      {/* <div
        className={`toggle-fullscreen-kartlag-wrapper${
          fullscreen
            ? " side-bar-fullscreen"
            : props.showSideBar
            ? " side-bar-open"
            : ""
        }`}
      >
        <Button
          id="toggle-fullscreen-kartlag-button"
          variant="contained"
          size="small"
          onClick={() => {
            toggleFullscreenSideBar();
          }}
        >
          {fullscreen ? <FullscreenExit /> : <Fullscreen />}
        </Button>
      </div> */}
      <div
        className={`kartlag_fanen${
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
