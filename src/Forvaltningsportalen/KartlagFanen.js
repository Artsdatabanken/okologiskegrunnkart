import ForvaltningsKartlag from "./ForvaltningsKartlag/ForvaltningsKartlag";
import React from "react";
import "../style/kartlagfane.css";

const KartlagFanen = props => {
  return (
    <div className="kartlag_fanen">
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
  );
};

export default KartlagFanen;
