import React from "react";
import { SettingsContext } from "../../SettingsContext";
import ForvaltningsGruppering from "./ForvaltningsGruppering";
import { List } from "@material-ui/core";
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

  filterData = (event, element) => {
    let filterlist = this.state.filterlist;
    if (event.target.checked) {
      filterlist.push(element);
    } else {
      const index = filterlist.indexOf(element);
      if (index > -1) {
        filterlist.splice(index, 1);
      }
    }
    this.setState({
      filterlist: filterlist
    });
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

  render() {
    const { onUpdateLayerProp } = this.props;
    let lag = this.props.kartlag;
    let sortcriteria = this.state.sortcriteria;
    let sorted = {};

    // Henter ut unike tags for checklistegenerering
    let taglist = new Set();
    for (let i in lag) {
      let new_tags = lag[i]["tags"];
      if (new_tags) {
        for (let tag of new_tags) taglist.add(tag);
      }
    }

    // Sorterer listen på valgt kriterie
    for (let item in lag) {
      let criteria = lag[item][sortcriteria];
      let new_list = [];
      if (!criteria) {
        criteria = "Ikke gruppert";
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
        <List>
          {Object.keys(sorted)
            .reverse()
            .map(element => {
              return (
                <ForvaltningsGruppering
                  searchTerm={this.state.searchTerm}
                  hideHidden={this.state.hideHidden}
                  filterlist={this.state.filterlist}
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
