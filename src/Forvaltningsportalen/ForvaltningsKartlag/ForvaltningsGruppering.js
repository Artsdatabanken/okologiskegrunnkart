import React from "react";
import ForvaltningsElement from "./ForvaltningsElement";

const ForvaltningsGruppering = ({
  kartlag,
  erAktivtLag,
  onUpdateLayerProp,
  handleShowCurrent,
  show_current,
  element
}) => {
  return (
    <>
      <h4 className="container_header">{element}</h4>

      {kartlag.map((element, index) => {
        return (
          <ForvaltningsElement
            kartlag={element}
            key={index}
            onUpdateLayerProp={onUpdateLayerProp}
          />
        );
      })}
    </>
  );
};

export default ForvaltningsGruppering;
