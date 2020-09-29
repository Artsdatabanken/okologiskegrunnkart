import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress
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
  // const [sortKey, setSortKey] = useState("alfabetisk");
  // const [tagFilter, setTagFilter] = useState({});
  // const [matchAllFilters, setMatchAllFilters] = useState(true);
  const [sortedResults, setSortedResults] = useState({});
  // const [taglist, setTaglist] = useState([]);
  // const [tags, setTags] = useState(null);

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
    let lag = layersResult;
    let sorted = {};
    console.log("Sortkey: ", sortKey);

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
    setSortedResults(sorted);
    console.log("sorted results: ", sorted);
  }, [layersResult, layersResultJSON, sortKey]);

  // useEffect(() => {
  //   const selectedTags = Object.keys(tagFilter).filter(tag => tagFilter[tag]);

  //   let lag = layersResult.filter(element => {
  //     let tags = element.tags || [];

  //     // All tags match the layer's tags
  //     if (
  //       selectedTags.length > 0 &&
  //       matchAllFilters &&
  //       !selectedTags.every(tag => tags.includes(tag))
  //     )
  //       return false;

  //     // At leats one tag matches the layer's tags
  //     if (
  //       selectedTags.length > 0 &&
  //       !matchAllFilters &&
  //       !selectedTags.some(tag => tags.includes(tag))
  //     )
  //       return false;

  //     return true;
  //   });

  //   // let lag = layersResult;

  //   let sorted = {};

  //   // Sorterer listen på valgt kriterie
  //   for (let item in lag) {
  //     let criteria = lag[item][sortKey];
  //     let new_list = [];
  //     if (!criteria) {
  //       criteria = "";
  //     }
  //     if (sorted[criteria]) {
  //       new_list = sorted[criteria];
  //     }
  //     lag[item].id = item;
  //     new_list.push(lag[item]);
  //     sorted[criteria] = new_list;
  //   }
  //   setSortedResults(sorted);
  //   console.log("sorted results: ", sorted)
  // }, [layersResult, layersResultJSON, sortKey, tagFilter, matchAllFilters]);

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
              {layersResult !== undefined &&
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
                })}
            </List>
          </div>
        )}
      </div>
    </div>
  );
};

export default withRouter(ResultsList);
