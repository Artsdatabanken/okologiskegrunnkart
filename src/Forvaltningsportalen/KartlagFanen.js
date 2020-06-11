import ForvaltningsKartlag from "./ForvaltningsKartlag/ForvaltningsKartlag";
import React from "react";
import "../style/kartlagfane.css";
import ForvaltningsElement from "./ForvaltningsKartlag/ForvaltningsElement";
import PolygonElement from "./PolygonElement";

import { KeyboardBackspace } from "@material-ui/icons";
const KartlagFanen = props => {
  return (
    <>
      <div
        className={`toggle-side-bar-wrapper${
          props.showSideBar ? " side-bar-open" : ""
        }`}
      >
        <button
          className="toggle-side-bar-button"
          onClick={() => {
            props.toggleSideBar();
          }}
        >
          {props.showSideBar ? "Skjul kartlag" : "Vis kartlag"}
        </button>
      </div>
      {props.showSideBar && (
        <div
          className={`kartlag_fanen${
            props.sideBarAnimationClass === " show-sidebar-animation"
              ? " closed"
              : ""
          }${props.sideBarAnimationClass ? props.sideBarAnimationClass : ""}`}
        >
          {props.searchResultPage ? (
            <></>
          ) : (
            <>
              {props.valgtLag ? (
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
                  <div className="scroll_area">
                    <ForvaltningsElement
                      valgt={true}
                      kartlag_key={props.valgtLag.id}
                      kartlag={props.valgtLag}
                      key={props.valgtLag.id}
                      onUpdateLayerProp={props.onUpdateLayerProp}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  {props.polyline.length > 0 || props.polygon ? (
                    <h3 className="container_header">Polygon</h3>
                  ) : (
                    <h3 className="container_header">Kartlag</h3>
                  )}

                  <div className="scroll_area">
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
                      show_current={props.show_current}
                      handleShowCurrent={props.handleShowCurrent}
                      kartlag={props.kartlag}
                      navigation_history={props.navigation_history}
                      onFitBounds={props.handleFitBounds}
                      history={props.history}
                      onUpdateLayerProp={props.onUpdateLayerProp}
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
