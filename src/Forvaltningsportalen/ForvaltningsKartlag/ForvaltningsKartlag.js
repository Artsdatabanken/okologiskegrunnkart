import React from "react";
import { SettingsContext } from "SettingsContext";
import ForvaltningsGruppering from "./ForvaltningsGruppering";
import { List } from "@material-ui/core";

class ForvaltningsKartlag extends React.Component {
  // Denne funksjonen tar inn alle lagene som sendes inn, og henter ut per eier
  state = {
    sortcriteria: "ingen",
    filterlist: []
  };

  render() {
    const { onUpdateLayerProp } = this.props;
    let lag = this.props.kartlag;

    let sortcriteria = this.state.sortcriteria;
    let sorted = {};

    let taglist = [];
    for (let i in lag) {
      let new_tags = lag[i]["tags"];
      if (new_tags) {
        taglist = taglist.concat(
          new_tags.filter(item => taglist.indexOf(item) < 0)
        );
      }
    }
    for (let item in lag) {
      let criteria = lag[item][sortcriteria];
      let new_list = [];
      if (!criteria) {
        criteria = "Ikke gruppert";
      }
      if (sorted[criteria]) {
        new_list = sorted[criteria];
      }
      new_list.push(lag[item]);
      sorted[criteria] = new_list;
    }

    return (
      <SettingsContext.Consumer>
        {context => (
          <>
            <div className="sort_chooser_container">
              <h4>Filtrering</h4>

              {taglist.map(element => {
                return (
                  <div className="filterobject">
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

            <List>
              {Object.keys(sorted)
                .reverse()
                .map(element => {
                  return (
                    <ForvaltningsGruppering
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
