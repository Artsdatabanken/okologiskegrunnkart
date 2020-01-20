import ForvaltningsKartlag from "Forvaltningsportalen/ForvaltningsKartlag/ForvaltningsKartlag";
import React from "react";

const RightWindow = props => {
  return (
    <div className="right_panel">
      <h3 className="container_header">Kartlag</h3>
      <div className="scroll_area">
        <ForvaltningsKartlag
          lag={props.meta.lag}
          show_current={props.show_current}
          handleShowCurrent={props.handleShowCurrent}
          aktiveLag={props.aktiveLag}
          meta={props.meta}
          navigation_history={props.navigation_history}
          onFitBounds={props.handleFitBounds}
          history={props.history}
          onUpdateLayerProp={props.onUpdateLayerProp}
        />
      </div>
    </div>
  );
};

export default RightWindow;
