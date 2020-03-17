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

      {kartlag.map(element => {
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
            kartlag_key={element.id}
            kartlag={element}
            key={element.id}
            onUpdateLayerProp={onUpdateLayerProp}
          />
        );
      })}
    </>
  );
};

export default ForvaltningsGruppering;
