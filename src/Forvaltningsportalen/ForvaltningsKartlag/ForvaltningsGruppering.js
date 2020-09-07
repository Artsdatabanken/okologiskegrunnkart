import React from "react";
import ForvaltningsElement from "./ForvaltningsElement";
import { ListSubheader } from "@material-ui/core";

const ForvaltningsGruppering = ({
  kartlag,
  tagFilter,
  matchAllFilters,
  onUpdateLayerProp,
  changeVisibleSublayers,
  hideHidden,
  searchTerm,
  element,
  zoom,
  showSublayerDetails
}) => {
  const selectedTags = Object.keys(tagFilter).filter(tag => tagFilter[tag]);
  kartlag = kartlag.filter(element => {
    let tags = element.tags || [];

    // All tags match the layer's tags
    if (
      selectedTags.length > 0 &&
      matchAllFilters &&
      !selectedTags.every(tag => tags.includes(tag))
    )
      return false;

    // At leats one tag matches the layer's tags
    if (
      selectedTags.length > 0 &&
      !matchAllFilters &&
      !selectedTags.some(tag => tags.includes(tag))
    )
      return false;

    // Layer contains search term
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
            kartlagKey={element.id}
            kartlag={element}
            onUpdateLayerProp={onUpdateLayerProp}
            changeVisibleSublayers={changeVisibleSublayers}
            showSublayerDetails={showSublayerDetails}
          />
        );
      })}
    </div>
  );
};

export default ForvaltningsGruppering;
