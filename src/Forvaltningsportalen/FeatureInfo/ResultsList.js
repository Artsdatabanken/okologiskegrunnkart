import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  ListSubheader
} from "@material-ui/core";
import GeneriskElement from "./GeneriskElement";
import "../../style/infobox.css";
import CustomIcon from "../../Common/CustomIcon";
import { makeStyles } from "@material-ui/core/styles";

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
  matchAllFilters
}) => {
  const classes = useStyles("Ingen kartlag valgt");

  const [title, setTitle] = useState(null);
  const [allResults, setAllResults] = useState({});

  const layersResultJSON = JSON.stringify(layersResult);

  useEffect(() => {
    const emptyKartlag =
      Object.keys(kartlag).length === 0 && kartlag.constructor === Object;
    let title = "Ingen kartlag valgt";
    if (showExtensiveInfo && !emptyKartlag) {
      title = "Resultat fra alle kartlag";
    } else if (!showExtensiveInfo && !emptyKartlag) {
      title = "Resultat fra valgte kartlag";
    }
    setTitle(title);
  }, [kartlag, showExtensiveInfo]);

  useEffect(() => {
    // Sort results
    let lag = layersResult;
    let sorted = {};

    // Sorterer listen på valgt kriterie
    for (let item in lag) {
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
    // console.log("filtered results: ", filtered);
    // console.log("layersResult: ", layersResult)
  }, [layersResult, layersResultJSON, sortKey, tagFilter, matchAllFilters]);

  return (
    <div className="detailed-info-container-side">
      <div className="layer-results-side">
        <ListItem id="layer-results-header">
          <ListItemIcon>
            <CustomIcon icon="layers" size={32} color="#777" padding={0} />
          </ListItemIcon>
          <ListItemText primary={title} />
        </ListItem>

        {coordinates_area && coordinates_area.lat && (
          <div className="layer-results-scrollable-side">
            {loadingFeatures && (
              <div className={classes.root}>
                <LinearProgress color="primary" />
              </div>
            )}
            <List id="layers-results-list">
              {allResults !== undefined &&
                Object.keys(allResults)
                  .reverse()
                  .map(key => {
                    return (
                      <div key={key}>
                        <ListSubheader disableSticky>{key}</ListSubheader>
                        <>
                          {Object.keys(allResults[key]).map(resultkey => {
                            return (
                              <GeneriskElement
                                coordinates_area={coordinates_area}
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
                        </>
                      </div>
                    );
                  })}
              {/* {layersResult !== undefined &&
                Object.keys(layersResult).map(key => {
                  return (
                    <GeneriskElement
                      coordinates_area={coordinates_area}
                      key={key}
                      kartlag={kartlag}
                      resultat={layersResult[key]}
                      element={key}
                      infoboxDetailsVisible={infoboxDetailsVisible}
                      resultLayer={resultLayer}
                      showDetailedResults={showDetailedResults}
                    />
                  );
                })} */}
            </List>
          </div>
        )}
      </div>
    </div>
  );
};

export default withRouter(ResultsList);
