import ForvaltningsKartlag from "./ForvaltningsKartlag/ForvaltningsKartlag";
import React from "react";
import { Route, Switch } from "react-router-dom";
import "../style/kartlagfane.css";
import ForvaltningsElement from "./ForvaltningsKartlag/ForvaltningsElement";
import PolygonElement from "./PolygonElement";
import Tegnforklaring from "../Tegnforklaring/Tegnforklaring";
import { KeyboardBackspace } from "@material-ui/icons";
import CustomIcon from "../Common/CustomIcon";
import { Button } from "@material-ui/core";

const KartlagFanen = props => {
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
      {props.showSideBar && (
        <div className="kartlag_fanen">
          <Switch>
            <Route path="/tegnforklaring" exact={false} strict={false}>
              <Tegnforklaring layers={props.kartlag}></Tegnforklaring>
            </Route>
            <Route path="/">
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
                  <div className="scroll_area">
                    <ForvaltningsElement
                      valgt={true}
                      kartlag_key={props.valgtLag.id}
                      kartlag={props.valgtLag}
                      key={props.valgtLag.id}
                      onUpdateLayerProp={props.onUpdateLayerProp}
                      zoom={props.zoom}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  {props.polyline.length > 0 && props.polygon && (
                    <h3 className="container_header">Polygon</h3>
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
                      kartlag={props.kartlag}
                      onUpdateLayerProp={props.onUpdateLayerProp}
                      zoom={props.zoom}
                    />
                  </div>
                </div>
              )}
            </Route>
          </Switch>
        </div>
      )}
    </>
  );
};

export default KartlagFanen;
