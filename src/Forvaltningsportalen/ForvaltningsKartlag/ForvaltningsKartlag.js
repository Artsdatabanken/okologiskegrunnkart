import React from "react";
import ForvaltningsGruppering from "./ForvaltningsGruppering";
import { Done as DoneIcon } from "@material-ui/icons";
import { Paper, Chip, Typography, List } from "@material-ui/core";
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
          style={{ marginLeft: 4, marginRight: 4, marginBottom: 4 }}
          key={tag}
          label={tag}
          clickable
          color="secondary"
          onClick={() => this.handleFilterTag(tag, !this.state.tagFilter[tag])}
          onDelete={() => this.handleFilterTag(tag, false)}
        />
      ));

    return (
      <>
        <Paper
          square
          elevation={1}
          style={{
            paddingLeft: 16,
            paddingTop: 0,
            paddingBottom: 12,
            paddingRight: 4
          }}
        >
          <Filtrering
            taglist={taglist}
            tagFilter={this.state.tagFilter}
            onFilterTag={this.handleFilterTag}
          />
          <Sortering sort={sortKey} onChangeSort={this.handleChangeSort} />
          <Typography variant="h6">Kartlag</Typography>
          <div>
            <Typography variant="body2">
              {this.sortKeyToDescription[sortKey]}
              {tags.length > 0 && <span> & bare </span>}
            </Typography>
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
                        marginRight: 8
                      }}
                    >
                      og
                    </div>,
                    elem
                  ];
            }, null)}
          </div>
        </Paper>
        <List>
          <TegnforklaringLink />
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
