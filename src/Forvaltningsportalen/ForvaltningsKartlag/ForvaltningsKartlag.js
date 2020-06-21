import React from "react";
import ForvaltningsGruppering from "./ForvaltningsGruppering";
import { Done as DoneIcon, Sort as SortIcon } from "@material-ui/icons";
import { ListSubheader, Chip, Typography, List } from "@material-ui/core";
import TemaPicker from "./TemaPicker";
import Sortering from "./Sortering";
import Filtrering from "./Filtrering";

class ForvaltningsKartlag extends React.Component {
  // Denne funksjonen tar inn alle lagene som sendes inn, og henter ut per eier
  state = {
    sortKey: "alfabetisk",
    tagFilter: {},
    hideHidden: false,
    searchTerm: null,
    showFilter: true
  };

  handleFilterTag = (tag, value) => {
    let tagFilter = this.state.tagFilter;
    tagFilter[tag] = value;
    this.setState({ tagFilter });
  };

  hideHiddendelements = event => {
    if (event.target.checked) {
      this.setState({
        hideHidden: true
      });
    } else {
      this.setState({
        hideHidden: false
      });
    }
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

    return (
      <>
        {this.state.showFilter && (
          <>
            <ListSubheader disableSticky>Filter</ListSubheader>
            <div className="sort_chooser_container">
              <h4>Fritekst</h4>
              <input
                type="text"
                onChange={e => {
                  if (e.target.value) {
                    this.setState({
                      searchTerm: e.target.value.toLowerCase()
                    });
                  }
                }}
              />

              <div className="tags_container">
                {taglist.map(tag => {
                  return (
                    <Chip
                      style={{ margin: 4 }}
                      key={tag}
                      label={tag}
                      clickable
                      color={this.state.tagFilter[tag] ? "primary" : "default"}
                      onClick={() => {
                        this.handleFilterTag(tag, !this.state.tagFilter[tag]);
                      }}
                      onDelete={() => {
                        this.handleFilterTag(tag, false);
                      }}
                      deleteIcon={
                        this.state.tagFilter[tag] ? null : <DoneIcon />
                      }
                    />
                  );
                })}
              </div>

              <h4> Filtrer bort skjulte element </h4>
              <div className="toggle">
                <span>av</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    onChange={e => {
                      this.hideHiddendelements(e);
                    }}
                    onKeyPress={e => {
                      if (e.key === "Enter") {
                        e.target.checked = !e.target.checked;
                        this.hideHiddendelements(e);
                      }
                    }}
                  />
                  <span className="slider"></span>
                </label>
                <span>på</span>
              </div>
            </div>
          </>
        )}

        <List>
          <Filtrering
            taglist={taglist}
            tagFilter={this.state.tagFilter}
            onFilterTag={this.handleFilterTag}
          />
          <Sortering sort={sortKey} onChangeSort={this.handleChangeSort} />
          <Typography style={{ marginLeft: 16, marginTop: 8 }} variant="h6">
            Kartlag sortert{" "}
            {sortKey === "alfabetisk" ? "alfabetisk" : "etter " + sortKey}
          </Typography>
          {Object.keys(sorted)
            .sort()
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
                />
              );
            })}
        </List>
      </>
    );
  }
}

export default ForvaltningsKartlag;
