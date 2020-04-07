import ForvaltningsKartlag from "./ForvaltningsKartlag/ForvaltningsKartlag";
import React from "react";
import "../style/kartlagfane.css";
import ForvaltningsElement from "./ForvaltningsKartlag/ForvaltningsElement";

import { KeyboardBackspace } from "@material-ui/icons";
const KartlagFanen = props => {
  console.log("ny fin prop:", props.searchResultPage);
  return (
    <div className="kartlag_fanen">
      {props.searchResultPage ? (
        <div className="valgtLag">
          <button
            className="listheadingbutton"
            onClick={e => {
              props.setSearchResultPage(false);
            }}
          >
            <KeyboardBackspace />
            <span>Tilbake til kartlag</span>
          </button>
          <div className="scroll_area">
            <b>Her kommer søkeresultatene</b>
          </div>
        </div>
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
                <span>Tilbake til kartlag</span>
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
              <h3 className="container_header">Kartlag</h3>
              <div className="scroll_area">
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
  );
};

export default KartlagFanen;
