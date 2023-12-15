import React, { useState, useEffect } from "react";
import KartlagGruppering from "./KartlagGruppering";
import { Chip, Typography, List, Button } from "@mui/material";
import Sortering from "./Sortering";
import Filtrering from "./Filtrering";
import FavouritesMenu from "./FavouritesMenu";
import TegnforklaringLink from "../../Tegnforklaring/TegnforklaringLink";
import KartlagEmptyElement from "./KartlagEmptyElement";

const GrunnKartlag = ({
  kartlag,
  toggleSublayer,
  toggleAllSublayers,
  showSublayerDetails,
  legendVisible,
  setLegendVisible,
  legendPosition,
  handleLegendPosition,
  handleSortKey,
  handleTagFilter,
  handleMatchAllFilters,
  isMobile,
  showFavoriteLayers,
  toggleShowFavoriteLayers
}) => {
  // Denne funksjonen tar inn alle lagene som sendes inn, og henter ut per eier
  const [sortKey, setSortKey] = useState("tema");
  const [tagFilter, setTagFilter] = useState({});
  const [matchAllFilters, setMatchAllFilters] = useState(true);
  const [sorted, setSorted] = useState({});
  const [taglist, setTaglist] = useState([]);
  const [tags, setTags] = useState(null);
  const [legendOpenLeft, setLegendOpenLeft] = useState(false);

  const handleFilterTag = (tag, value) => {
    let tagFilterTemp = { ...tagFilter };
    tagFilterTemp[tag] = value;
    setTagFilter(tagFilterTemp);
    handleTagFilter(tagFilterTemp);
  };

  const handleChangeSort = sortKey => {
    setSortKey(sortKey);
    handleSortKey(sortKey);
  };

  const sortKeyToDescription = {
    alfabetisk: "Alfabetisk",
    tema: "Gruppert på tema",
    dataeier: "Gruppert på dataeier"
  };

  useEffect(() => {
    let lag = kartlag;
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

    // Henter ut unike tags for checklistegenerering
    let taglist = {};
    for (let i in lag) {
      for (let tag of lag[i]["tags"] || []) {
        taglist[tag] = true;
      }
    }
    taglist = Object.keys(taglist).sort();
    setTaglist(taglist);

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
    setSorted(sorted);
  }, [kartlag, sortKey]);

  useEffect(() => {
    const tags = taglist
      .filter(tag => tagFilter[tag])
      .map(tag => (
        <Chip
          id="layers-filter-chips"
          style={{ margin: "2px 5px 2px 0" }}
          key={tag}
          label={tag}
          clickable
          color="primary"
          onClick={() => {
            let tagFilterTemp = { ...tagFilter };
            tagFilterTemp[tag] = !tagFilter[tag];
            setTagFilter(tagFilterTemp);
            handleTagFilter(tagFilterTemp);
          }}
          onDelete={() => {
            let tagFilterTemp = { ...tagFilter };
            tagFilterTemp[tag] = false;
            setTagFilter(tagFilterTemp);
            handleTagFilter(tagFilterTemp);
          }}
        />
      ));
    setTags(tags);
  }, [taglist, tagFilter, handleTagFilter]);

  useEffect(() => {
    if (legendVisible && legendPosition === "left") {
      setLegendOpenLeft(true);
    } else {
      setLegendOpenLeft(false);
    }
  }, [legendVisible, legendPosition]);

  return (
    <>
      <div className="header-layers-menu">
        <div
          className={
            legendOpenLeft && (!tags || tags.length === 0)
              ? "sort-filter-layers-wrapper-line"
              : "sort-filter-layers-wrapper"
          }
        >
          <div>
            <Typography variant="h6">
              {showFavoriteLayers ? "Favorittkartlag" : "Kartlag"}
            </Typography>
            <Typography variant="body2">
              {sortKeyToDescription[sortKey]}
            </Typography>
          </div>
          <div className="sort-filter-icons-wrapper">
            <FavouritesMenu
              showFavoriteLayers={showFavoriteLayers}
              toggleShowFavoriteLayers={toggleShowFavoriteLayers}
            />
            <Sortering sort={sortKey} onChangeSort={handleChangeSort} />
            <Filtrering
              taglist={taglist}
              tagFilter={tagFilter}
              onFilterTag={handleFilterTag}
            />
          </div>
        </div>
      </div>
      {tags && tags.length > 0 && (
        <div
          className={
            legendOpenLeft
              ? "selected-tags-wrapper-line"
              : "selected-tags-wrapper"
          }
        >
          <div className="selected-tags-tittle">
            <Typography id="filters-header" variant="body2">
              Filtrer
            </Typography>
            {tags.length > 1 && (
              <div className="filter-options-wrapper">
                <Button
                  id="filter-all-button"
                  size="small"
                  color={matchAllFilters ? "primary" : "secondary"}
                  onClick={() => {
                    setMatchAllFilters(true);
                    handleMatchAllFilters(true);
                  }}
                >
                  Matcher alle
                </Button>
                /
                <Button
                  id="filter-all-button"
                  size="small"
                  color={matchAllFilters ? "secondary" : "primary"}
                  onClick={() => {
                    setMatchAllFilters(false);
                    handleMatchAllFilters(false);
                  }}
                >
                  Matcher minst ett
                </Button>
              </div>
            )}
          </div>
          {tags.reduce((accu, elem, index) => {
            return accu === null ? [elem] : [...accu, elem];
          }, null)}
        </div>
      )}

      {!legendVisible && (
        <div className="legend-link-background">
          <div className="legend-link-wrapper">
            <TegnforklaringLink
              layers={kartlag}
              setLegendVisible={setLegendVisible}
              handleLegendPosition={handleLegendPosition}
              isMobile={isMobile}
            />
          </div>
        </div>
      )}

      {Object.keys(kartlag).length > 0 && (
        <List id="layers-list-wrapper">
          {Object.keys(sorted).map(element => {
            return (
              <KartlagGruppering
                tagFilter={tagFilter}
                matchAllFilters={matchAllFilters}
                kartlag={sorted[element]}
                element={element}
                key={element}
                toggleSublayer={toggleSublayer}
                toggleAllSublayers={toggleAllSublayers}
                showSublayerDetails={showSublayerDetails}
              />
            );
          })}
        </List>
      )}
      {Object.keys(kartlag).length === 0 && (
        <KartlagEmptyElement kartlag={kartlag} />
      )}
    </>
  );
};

export default GrunnKartlag;
