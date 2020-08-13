import ForvaltningsKartlag from "./ForvaltningsKartlag/ForvaltningsKartlag";
import React, { useState } from "react";
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

  return (
    <>
      {!props.showFullscreenSideBar && (
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
              props.toggleSideBar();
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
      {props.showSideBar && (
        <div
          className={`toggle-fullscreen-side-bar-wrapper${
            props.showFullscreenSideBar ? " side-bar-open" : ""
          }`}
        >
          <Button
            id="toggle-fullscreen-side-bar-button"
            variant="contained"
            size="small"
            onClick={() => {
              props.toggleFullscreenSideBar();
            }}
          >
            <CustomIcon
              id="show-layers-icon"
              icon={
                props.showSideBar && props.showFullscreenSideBar
                  ? "menu-right"
                  : "menu-left"
              }
              size={30}
            />
          </Button>
        </div>
      )}
      {props.showSideBar && (
        <div
          className={`kartlag_fanen${
            props.showFullscreenSideBar ? " side-bar-fullscreen" : ""
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
                  props.showFullscreenSideBar ? " side-bar-fullscreen" : ""
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
                    props.showFullscreenSideBar ? " side-bar-fullscreen" : ""
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
      )}
    </>
  );
};

export default KartlagFanen;
