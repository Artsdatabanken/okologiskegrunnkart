import React from "react";
import ForvaltningsElement from "./ForvaltningsElement";

const ForvaltningsGruppering = ({
  kartlag,
  filterlist,
  erAktivtLag,
  onUpdateLayerProp,
  handleShowCurrent,
  show_current,
  hideHidden,
  searchTerm,
  element,
  zoom
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

        if (searchTerm && searchTerm.length > 0) {
          let string = JSON.stringify(element).toLowerCase();
          if (string.indexOf(searchTerm) === -1) {
            return null;
          }
        }
        if (hideHidden && !element.erSynlig) return null;
        if (!showelement) return null;
        return (
          <ForvaltningsElement
            key={element.id}
            kartlag_key={element.id}
            kartlag={element}
            onUpdateLayerProp={onUpdateLayerProp}
            zoom={zoom}
          />
        );
      })}
    </>
  );
};

export default ForvaltningsGruppering;
