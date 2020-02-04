import React from "react";
import FeatureInfo from "../FeatureInfo";

const LeftWindow = props => {
  if (props.showExtensiveInfo) {
    return <FeatureInfo {...props}></FeatureInfo>;
  } else {
    return null;
  }
};
export default LeftWindow;
