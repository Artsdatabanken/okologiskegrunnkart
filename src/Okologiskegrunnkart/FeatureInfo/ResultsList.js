import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  LinearProgress,
  ListSubheader
} from "@mui/material";
import GeneriskElement from "./GeneriskElement";
import "../../style/infobox.css";
import CustomIcon from "../../Common/CustomIcon";
import { makeStyles } from "@mui/styles";
import CustomSwitch from "../../Common/CustomSwitch";

const useStyles = makeStyles(() => ({
  root: {
    width: "100%"
  }
}));

const ResultsList = ({
  showExtensiveInfo,
  kartlag,
  coordinates_area,
  layersResult,
  loadingFeatures,
  infoboxDetailsVisible,
  resultLayer,
  showDetailedResults,
  sortKey,
  tagFilter,
  matchAllFilters,
  getBackendData
}) => {
  const classes = useStyles("Ingen kartlag valgt");

  const [allResults, setAllResults] = useState({});

  const layersResultJSON = JSON.stringify(layersResult);

  const toggleAllLayers = () => {
    if (coordinates_area && coordinates_area.lng && coordinates_area.lat) {
      getBackendData(coordinates_area.lng, coordinates_area.lat);
    }
  };

  useEffect(() => {
    // Sort results
    let lag = layersResult;
    let sorted = {};
    if (sortKey === "tema") {
      sorted = {
        Arter: [],
        Arealressurs: [],
        Naturtyper: [],
        Skog: [],
        Marint: [],
        Ferskvann: [],
        Landskap: [],
        Geologi: [],
        Miljøvariabel: [],
        "Administrative støttekart": []
      };
    }
    if (sortKey === "dataeier") {
      const listOwners = [];
      let owner = null;
      for (const l in lag) {
        const layer = lag[l];
        owner = layer.dataeier;
        if (!listOwners.includes(owner)) {
          listOwners.push(owner);
        }
      }
      const sortedOwners = listOwners.sort();
      for (const own of sortedOwners) {
        sorted[own] = [];
      }
    }

    // Sorterer listen på valgt kriterie
    for (const item in lag) {
      let criteria = lag[item][sortKey];
      let new_list = [];
      if (!criteria) {
        criteria = "";
      }
      if (sorted[criteria]) {
        new_list = sorted[criteria];
      }
      lag[item].id = item;
      new_list.push(lag[item]);
      sorted[criteria] = new_list;
    }

    // Get selected tags
    const selectedTags = Object.keys(tagFilter).filter(tag => tagFilter[tag]);

    // Filter sorted results
    let filtered = {};
    Object.keys(sorted).forEach(key => {
      let elements = sorted[key];

      elements = elements.filter(element => {
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

      if (elements.length > 0) {
        // Convert array to object
        const filteredObject = elements.reduce((result, item) => {
          const key = item.id;
          result[key] = item;
          return result;
        }, {});
        filtered = { ...filtered, [key]: filteredObject };
      }
    });

    setAllResults(filtered);
  }, [layersResult, layersResultJSON, sortKey, tagFilter, matchAllFilters]);

  return (
    <div className="detailed-info-container-side">
      <div className="layer-results-side">
        <ListItem id="layer-results-header" class="list-header">
          <ListItemIcon>
            <CustomIcon icon="layers" size={32} color="#262f31" padding={0} />
          </ListItemIcon>
          <div className="search-layers-button-wrapper">
            <span
              className={
                showExtensiveInfo
                  ? "search-layers-switch-text"
                  : "search-layers-switch-text-selected"
              }
            >
              Valgte kartlag
            </span>
            <CustomSwitch
              tabIndex="0"
              id="search-layers-toggle"
              checked={showExtensiveInfo}
              onChange={toggleAllLayers}
              onKeyDown={e => {
                if (e.keyCode === 13) {
                  toggleAllLayers();
                }
              }}
            />
            <span
              className={
                showExtensiveInfo
                  ? "search-layers-switch-text-selected"
                  : "search-layers-switch-text"
              }
            >
              Alle kartlag
            </span>
          </div>
        </ListItem>

        {coordinates_area && coordinates_area.lat && (
          <div className="layer-results-scrollable-side">
            {loadingFeatures && (
              <div className={classes.root}>
                <LinearProgress color="primary" />
              </div>
            )}
            <List id="layers-results-list">
              {allResults &&
                Object.keys(allResults).map(key => {
                  return (
                    <div key={key} className="layers-results-subheaders">
                      {key !== "" && (
                        <ListSubheader disableSticky>{key}</ListSubheader>
                      )}
                      {Object.keys(allResults[key]).map(resultkey => {
                        return (
                          <GeneriskElement
                            key={resultkey}
                            kartlag={kartlag}
                            resultat={allResults[key][resultkey]}
                            element={resultkey}
                            infoboxDetailsVisible={infoboxDetailsVisible}
                            resultLayer={resultLayer}
                            showDetailedResults={showDetailedResults}
                          />
                        );
                      })}
                    </div>
                  );
                })}
            </List>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsList;
