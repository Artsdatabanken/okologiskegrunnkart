import React from "react";
import ForvaltningsGruppering from "./ForvaltningsGruppering";
import { Done as DoneIcon } from "@material-ui/icons";
import { ListSubheader, Chip, Typography, List } from "@material-ui/core";
import Sortering from "./Sortering";
import Filtrering from "./Filtrering";

class ForvaltningsKartlag extends React.Component {
  // Denne funksjonen tar inn alle lagene som sendes inn, og henter ut per eier
  state = {
    sortKey: "alfabetisk",
    tagFilter: {},
    hideHidden: false,
    searchTerm: null,
    showFilter: false
  };

  handleFilterTag = (tag, value) => {
    let tagFilter = this.state.tagFilter;
    tagFilter[tag] = value;
    this.setState({ tagFilter });
  };

  handleChangeSort = sortKey => {
    this.setState({ sortKey });
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
          style={{ marginRight: 8, marginBottom: 8 }}
          key={tag}
          label={tag}
          clickable
          color="secondary"
          _color={this.state.tagFilter[tag] ? "primary" : "default"}
          onClick={() => this.handleFilterTag(tag, !this.state.tagFilter[tag])}
          onDelete={() => this.handleFilterTag(tag, false)}
          deleteIcon={this.state.tagFilter[tag] ? null : <DoneIcon />}
        />
      ));

    return (
      <>
        <List>
          <Filtrering
            taglist={taglist}
            tagFilter={this.state.tagFilter}
            onFilterTag={this.handleFilterTag}
          />
          <Sortering sort={sortKey} onChangeSort={this.handleChangeSort} />

          <ListSubheader disableSticky>
            Kartlag sortert{" "}
            {sortKey === "alfabetisk" ? "alfabetisk" : "etter " + sortKey}
            {tags.length > 0 && <span> med tema</span>}
          </ListSubheader>

          <div style={{ marginLeft: 24, marginRight: 24 }}>
            {tags.length > 0 && (
              <Typography variant="body2">
                {tags.reduce((accu, elem) => {
                  return accu === null
                    ? [elem]
                    : [
                        ...accu,
                        <div
                          style={{
                            display: "inline",
                            verticalAlign: "text-bottom",
                            marginRight: 8
                          }}
                        >
                          og
                        </div>,
                        elem
                      ];
                }, null)}
              </Typography>
            )}
          </div>

          {Object.keys(sorted)
            .reverse()
            .map(element => {
              return (
                <ForvaltningsGruppering
                  searchTerm={this.state.searchTerm}
                  hideHidden={this.state.hideHidden}
                  tagFilter={this.state.tagFilter}
                  onFilterTag={this.handleFilterTag}
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
