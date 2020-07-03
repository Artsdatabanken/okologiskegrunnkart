import React from "react";
import ForvaltningsElement from "./ForvaltningsElement";
import { ListSubheader } from "@material-ui/core";

const ForvaltningsGruppering = ({
  kartlag,
  tagFilter,
  onFilterTag,
  onUpdateLayerProp,
  hideHidden,
  searchTerm,
  element,
  zoom
}) => {
  console.log(element);
  kartlag = kartlag.filter(element => {
    let tags = element.tags || [];
    if (
      Object.keys(tagFilter).some(tag => tagFilter[tag] && !tags.includes(tag))
    )
      return false;

    if (searchTerm && searchTerm.length > 0) {
      let string = JSON.stringify(element).toLowerCase();
      if (string.indexOf(searchTerm) === -1) {
        return false;
      }
    }
    if (hideHidden && element.opacity === 0) return false;
    return true;
  });

  if (kartlag.length <= 0) return null;
  return (
    <div className="sorted-layers-subheaders">
      <ListSubheader disableSticky>{element}</ListSubheader>

      {kartlag.map(element => {
        return (
          <ForvaltningsElement
            key={element.id}
            kartlag_key={element.id}
            kartlag={element}
            tagFilter={tagFilter}
            onFilterTag={onFilterTag}
            onUpdateLayerProp={onUpdateLayerProp}
            zoom={zoom}
          />
        );
      })}
    </div>
  );
};

export default ForvaltningsGruppering;
