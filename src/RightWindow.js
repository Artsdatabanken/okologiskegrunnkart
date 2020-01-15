import ForvaltningsKartlag from "Forvaltningsportalen/ForvaltningsKartlag/ForvaltningsKartlag";
import React from "react";
import FeatureInfo from "./FeatureInfo";

const RightWindow = props => {
  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        width: 408,
        backgroundColor: "#eee",
        boxShadow: "0 0 20px rgba(0, 0, 0, 0.3)",
        zIndex: -1
      }}
    >
      <h3>Kartlag</h3>
      <div
        style={{
          position: "absolute",
          top: 56,
          bottom: 0,
          overflowY: "auto",
          paddingBottom: 48,
          width: "100%"
        }}
      >
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
