import React from "react";
import { SettingsContext } from "../SettingsContext";
import ForvaltningsGruppering from "./ForvaltningsGruppering";
import { List } from "@material-ui/core";

class ForvaltningsKartlag extends React.Component {
  // Denne funksjonen tar inn alle lagene som sendes inn, og henter ut per eier

  render() {
    const { onUpdateLayerProp } = this.props;
    let lag = this.props.kartlag;

    let sortcriteria = "dataeier";
    let sorted = {};
    for (let item in lag) {
      let criteria = lag[item][sortcriteria];
      let new_list = [];
      if (!criteria) {
        criteria = "Ikke markert";
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
            <List>
              {Object.keys(sorted)
                .reverse()
                .map(element => {
                  return (
                    <ForvaltningsGruppering
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
