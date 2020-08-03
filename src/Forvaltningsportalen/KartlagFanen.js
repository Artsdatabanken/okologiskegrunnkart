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
import Bakgrunnskart from "./Bakgrunnskart";
import Bakgrunnskartvelger from "./Bakgrunnskartvelger";
import Tegn from "../Tegn/Tegn";
import LastOpp from "../Tegn/LastOpp";
import Hjelp from "./Hjelp";
import SearchBar from "./SearchBar/SearchBar";
import classNames from "classnames";

const KartlagFanen = props => {
  return (
    <>
      <div
        className={`toggle-side-bar-wrapper${
          props.showSideBar ? " side-bar-open" : " side-bar-close"
        }`}
      >
        <Button
          size="small"
          variant="contained"
          className={
            "toggle-side-bar-button-" + props.showSideBar ? "open" : "close"
          }
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
          <ArrowRight
            style={{
              color: "#555",
              transition: "0.8s",
              transform: props.showSideBar ? "rotate(0deg)" : "rotate(180deg)"
            }}
          ></ArrowRight>
        </Button>
      </div>

      <Paper
        elevation={3}
        style={{ transition: "0.5s" }}
        square
        className={classNames(
          "kartlag_fanen",
          props.showSideBar ? "open" : "close"
        )}
      >
        <SearchBar
          className={props.showSideBar ? "open" : "close"}
          onSelectSearchResult={props.onSelectSearchResult}
          searchResultPage={props.searchResultPage}
          setKartlagSearchResults={props.setKartlagSearchResults}
          setGeoSearchResults={props.setGeoSearchResults}
          handleGeoSelection={props.handleGeoSelection}
          kartlag={props.kartlag}
          onUpdateLayerProp={props.onUpdateLayerProp}
        />

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
                <Tegn
                  polyline={props.polyline}
                  onUpdatePolyline={props.onUpdatePolyline}
                />
              </Route>
              <Route path="/last/opp/kartlag">
                <LastOpp
                  onPreviewGeojson={props.onPreviewGeojson}
                  onAddLayer={props.onAddLayer}
                />
              </Route>
              <Route path="/bakgrunnskart">
                <Bakgrunnskartvelger
                  bakgrunnskart={props.bakgrunnskart}
                  onChangeBakgrunnskart={props.onChangeBakgrunnskart}
                />
              </Route>
              <Route path="/nytt/kartlag">
                <NyttKartlagType />
              </Route>
              <Route path="/">
                <Bakgrunnskart bakgrunnskart={props.bakgrunnskart} />
                <NyttKartlag />
                <TegnforklaringToggle />
                {(props.polyline.length > 0 || props.polygon) && (
                  <PolygonElement
                    polyline={props.polyline}
                    onUpdatePolyline={props.onUpdatePolyline}
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
    </>
  );
};

export default KartlagFanen;
