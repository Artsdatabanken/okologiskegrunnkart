import React, { useState, useEffect } from "react";
import ForvaltningsElement from "./ForvaltningsElement";
import { ListSubheader } from "@material-ui/core";

const ForvaltningsGruppering = ({
  kartlag,
  tagFilter,
  matchAllFilters,
  toggleSublayer,
  toggleAllSublayers,
  element,
  showSublayerDetails
}) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [allLayers, setAllLayers] = useState(kartlag);

  useEffect(() => {
    const tags = Object.keys(tagFilter).filter(tag => tagFilter[tag]);
    setSelectedTags(tags);
  }, [tagFilter]);

  useEffect(() => {
    const layers = kartlag.filter(element => {
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

      return true;
    });
    setAllLayers(layers);
  }, [kartlag, selectedTags, matchAllFilters]);

  console.log("element: ", element);

  if (allLayers.length <= 0) return null;
  return (
    <div className="sorted-layers-subheaders">
      {element !== "" && <ListSubheader disableSticky>{element}</ListSubheader>}

      {allLayers.map(element => {
        return (
          <ForvaltningsElement
            key={element.id}
            kartlagKey={element.id}
            kartlag={element}
            toggleSublayer={toggleSublayer}
            toggleAllSublayers={toggleAllSublayers}
            showSublayerDetails={showSublayerDetails}
          />
        );
      })}
    </div>
  );
};

export default ForvaltningsGruppering;
