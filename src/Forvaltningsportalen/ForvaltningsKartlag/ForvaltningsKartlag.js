import React from "react";
import { SettingsContext } from "../../SettingsContext";
import ForvaltningsGruppering from "./ForvaltningsGruppering";
import { ExpandLess, ExpandMore, FilterList } from "@material-ui/icons";
import { List } from "@material-ui/core";

class ForvaltningsKartlag extends React.Component {
  // Denne funksjonen tar inn alle lagene som sendes inn, og henter ut per eier
  state = {
    sortcriteria: "ingen",
    filterlist: [],
    hideHidden: false,
    searchTerm: null,
    showFilter: false
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
      <SettingsContext.Consumer>
        {context => (
          <>
            <button
              className="listheadingbutton"
              onClick={e => {
                this.setState({
                  showFilter: !this.state.showFilter
                });
              }}
            >
              <FilterList />
              <span>Vis listeinnstillinger og filtere</span>
              {this.state.showFilter ? <ExpandLess /> : <ExpandMore />}
            </button>

            {this.state.showFilter && (
              <div className="sort_chooser_container">
                <h4>Filtrer kartlag på søkestreng</h4>
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

                <h4>Filtrering</h4>

                {Array.from(taglist).map((element, index) => {
                  return (
                    <div className="filterobject" key={index}>
                      <input
                        type="checkbox"
                        onChange={e => {
                          let filterlist = this.state.filterlist;
                          if (e.target.checked) {
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
                        }}
                        id=""
                      />
                      <label>{element}</label>
                    </div>
                  );
                })}

                <h4> Filtrer bort skjulte element </h4>
                <div className="toggle">
                  <span>av</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      onChange={e => {
                        if (e.target.checked) {
                          this.setState({
                            hideHidden: true
                          });
                        } else {
                          this.setState({
                            hideHidden: false
                          });
                        }
                      }}
                    />
                    <span className="slider"></span>
                  </label>
                  <span>på</span>
                </div>

                <h4>Gruppering</h4>

                <select id="sort_chooser">
                  <option
                    value="ingen"
                    onClick={e => {
                      this.setState({
                        sortcriteria: "ingen"
                      });
                    }}
                  >
                    Ingen gruppering
                  </option>
                  <option
                    value="dataeier"
                    onClick={e => {
                      this.setState({
                        sortcriteria: "dataeier"
                      });
                    }}
                  >
                    Dataeier
                  </option>
                  <option
                    value="tema"
                    onClick={e => {
                      this.setState({
                        sortcriteria: "tema"
                      });
                    }}
                  >
                    Tema
                  </option>
                </select>
              </div>
            )}

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
                    />
                  );
                })}
            </List>
          </>
        )}
      </SettingsContext.Consumer>
    );
  }
}

export default ForvaltningsKartlag;
