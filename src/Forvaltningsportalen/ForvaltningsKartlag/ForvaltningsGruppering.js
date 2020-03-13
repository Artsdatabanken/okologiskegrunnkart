import React from "react";
import ForvaltningsElement from "./ForvaltningsElement";

const ForvaltningsGruppering = ({
  kartlag,
  filterlist,
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
        let showelement = false;
        let tags = element.tags;
        if (
          filterlist.length <= 0 ||
          (tags && tags.length > 0 && filterlist.some(r => tags.includes(r)))
        ) {
          showelement = true;
        }
        if (!showelement) return null;
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
