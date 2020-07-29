import React from "react";
import ForvaltningsGruppering from "./ForvaltningsGruppering";
import { Chip, Typography, List, Button } from "@material-ui/core";
import Sortering from "./Sortering";
import Filtrering from "./Filtrering";
import TegnforklaringLink from "../../Tegnforklaring/TegnforklaringLink";

class ForvaltningsKartlag extends React.Component {
  // Denne funksjonen tar inn alle lagene som sendes inn, og henter ut per eier
  state = {
    sortKey: "alfabetisk",
    tagFilter: {},
    hideHidden: false,
    searchTerm: null,
    showFilter: false,
    matchAllFilters: true
  };

  handleFilterTag = (tag, value) => {
    let tagFilter = this.state.tagFilter;
    tagFilter[tag] = value;
    this.setState({ tagFilter });
  };

  handleChangeSort = sortKey => {
    this.setState({ sortKey });
  };

  sortKeyToDescription = {
    alfabetisk: "Alfabetisk",
    tema: "Gruppert på tema",
    dataeier: "Gruppert på dataeier"
  };

  render() {
    const { onUpdateLayerProp } = this.props;
    let lag = this.props.kartlag;
    let sortKey = this.state.sortKey;
    let sorted = {};

    // Henter ut unike tags for checklistegenerering
    let taglist = {};
    for (let i in lag)
      for (let tag of lag[i]["tags"] || []) taglist[tag] = true;

    taglist = Object.keys(taglist).sort();

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

    const tags = taglist
      .filter(tag => this.state.tagFilter[tag])
      .map(tag => (
        <Chip
          id="layers-filter-chips"
          style={{ margin: "2px 0" }}
          key={tag}
          label={tag}
          clickable
          color="primary"
          onClick={() => this.handleFilterTag(tag, !this.state.tagFilter[tag])}
          onDelete={() => this.handleFilterTag(tag, false)}
        />
      ));

    return (
      <>
        <div className="header-layers-menu">
          <div className="sort-filter-layers-wrapper">
            <div>
              <Typography variant="h6">Kartlag</Typography>
              <Typography variant="body2">
                {this.sortKeyToDescription[sortKey]}
              </Typography>
            </div>
            <div className="sort-filter-icons-wrapper">
              <Sortering sort={sortKey} onChangeSort={this.handleChangeSort} />
              <Filtrering
                taglist={taglist}
                tagFilter={this.state.tagFilter}
                onFilterTag={this.handleFilterTag}
              />
            </div>
          </div>
          {tags && tags.length > 0 && (
            <div className="selected-tags-wrapper">
              <div className="selected-tags-tittle">
                <Typography id="filters-header" variant="body2">
                  Filtrer
                </Typography>
                <div className="filter-options-wrapper">
                  <Button
                    id="filter-all-button"
                    size="small"
                    onClick={() => {
                      this.setState({ matchAllFilters: true });
                    }}
                  >
                    Matcher alle
                  </Button>
                  /
                  <Button
                    id="filter-all-button"
                    size="small"
                    onClick={() => {
                      this.setState({ matchAllFilters: false });
                    }}
                  >
                    Matcher minst ett
                  </Button>
                </div>
              </div>
              {tags.reduce((accu, elem, index) => {
                return accu === null
                  ? [elem]
                  : [
                      ...accu,
                      <div
                        key={index}
                        style={{
                          display: "inline",
                          verticalAlign: "text-bottom",
                          padding: "0px 5px"
                        }}
                      />,
                      elem
                    ];
              }, null)}
            </div>
          )}
        </div>

        <div className="legend-link-wrapper">
          <TegnforklaringLink />
        </div>

        <List id="layers-list-wrapper">
          {Object.keys(sorted)
            .reverse()
            .map(element => {
              return (
                <ForvaltningsGruppering
                  searchTerm={this.state.searchTerm}
                  hideHidden={this.state.hideHidden}
                  tagFilter={this.state.tagFilter}
                  matchAllFilters={this.state.matchAllFilters}
                  kartlag={sorted[element]}
                  element={element}
                  key={element}
                  onUpdateLayerProp={onUpdateLayerProp}
                  zoom={this.props.zoom}
                />
              );
            })}
        </List>
      </>
    );
  }
}

export default ForvaltningsKartlag;
