import ForvaltningsKartlag from "./ForvaltningsKartlag/ForvaltningsKartlag";
import React from "react";
import "../style/kartlagfane.css";
import { Switch, Route } from "react-router-dom";
import PolygonElement from "./PolygonElement";
import { ArrowRight, ArrowLeft } from "@material-ui/icons";
import { Button, Paper } from "@material-ui/core";
import Kartlag from "./Kartlag";
import TegnforklaringToggle from "./TegnforklaringToggle";
import Tegnforklaring from "./Tegnforklaring";
import NyttKartlag from "./NyttKartlag";
import NyttKartlagType from "./NyttKartlagType";
import NyTegn from "./NyTegn";
import Hjelp from "./Hjelp";
import SearchBar from "./SearchBar/SearchBar";

const KartlagFanen = props => {
  return (
    <>
      {props.showSideBar && (
        <SearchBar
          onSelectSearchResult={props.onSelectSearchResult}
          searchResultPage={props.searchResultPage}
          setKartlagSearchResults={props.setKartlagSearchResults}
          setGeoSearchResults={props.setGeoSearchResults}
          handleGeoSelection={props.handleGeoSelection}
          kartlag={props.kartlag}
          onUpdateLayerProp={props.onUpdateLayerProp}
        />
      )}
      <div
        className={`toggle-side-bar-wrapper${
          props.showSideBar ? " side-bar-open" : ""
        }`}
      >
        <Button
          size="small"
          variant="contained"
          className="toggle-side-bar-button"
          onClick={() => {
            props.toggleSideBar();
          }}
          style={{
            backgroundColor: "rgba(255,255,255,0.9)",
            borderRadius: 0,
            paddingTop: 12,
            paddingRight: 0,
            paddingBottom: 12,
            paddingLeft: 0,
            minWidth: 0
          }}
        >
          {props.showSideBar ? (
            <ArrowRight style={{ color: "#555" }}></ArrowRight>
          ) : (
            <ArrowLeft style={{ color: "#555" }}></ArrowLeft>
          )}
        </Button>
      </div>
      {props.showSideBar && (
        <Paper elevation={3} className="kartlag_fanen">
          {props.searchResultPage ? (
            <></>
          ) : (
            <div className="scroll_area">
              <Switch>
                <Route path="/brukermanual">
                  <Hjelp />
                </Route>
                <Route path="/tegnforklaring" exact={false} strict={false}>
                  <Tegnforklaring layers={props.kartlag}></Tegnforklaring>
                </Route>
                <Route path="/kartlag/:tittel">
                  <Kartlag
                    kartlag={props.kartlag}
                    punkt={props.layersResult}
                    onUpdateLayerProp={props.onUpdateLayerProp}
                  />
                </Route>
                <Route path="/tegn/kartlag">
                  <NyTegn
                    polygon={props.polygon}
                    polyline={props.polyline}
                    showPolygon={props.showPolygon}
                    hideAndShowPolygon={props.hideAndShowPolygon}
                    handleEditable={props.handleEditable}
                    addPolygon={props.addPolygon}
                    addPolyline={props.addPolyline}
                  />
                </Route>
                <Route path="/nytt/kartlag">
                  <NyttKartlagType />
                </Route>
                <Route path="/">
                  <NyttKartlag />
                  <TegnforklaringToggle />
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
                </Route>
              </Switch>
            </div>
          )}
        </Paper>
      )}
    </>
  );
};

export default KartlagFanen;
