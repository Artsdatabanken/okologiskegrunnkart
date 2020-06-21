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
  element
}) => {
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
    if (hideHidden && !element.erSynlig) return false;
    return true;
  });

  if (kartlag.length <= 0) return null;
  return (
    <>
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
          />
        );
      })}
    </>
  );
};

export default ForvaltningsGruppering;
