import React from "react";
import { SettingsContext } from "SettingsContext";
import ForvaltningsEkspanderTopp from "./ForvaltningsEkspanderTopp";
import { List, ListSubheader } from "@material-ui/core";

class ForvaltningsKartlag extends React.Component {
  // Denne funksjonen tar inn alle lagene som sendes inn, og henter ut per eier

  render() {
    const { onUpdateLayerProp } = this.props;
    const lag = this.props.meta.lag;
    return (
      <SettingsContext.Consumer>
        {context => (
          <>
            <List>
              {Object.keys(lag || {}).map(dataeier => {
                return (
                  <div key={dataeier}>
                    <ListSubheader disableSticky={true}>
                      {dataeier}
                    </ListSubheader>
                    <DataEierLag
                      koder={lag[dataeier]}
                      onUpdateLayerProp={onUpdateLayerProp}
                      context={context}
                    ></DataEierLag>
                  </div>
                );
              })}
            </List>
          </>
        )}
      </SettingsContext.Consumer>
    );
  }
}

const DataEierLag = ({ context, koder, onUpdateLayerProp, ...props }) => {
  // Denne funksjonen behandler hvert lag per dataeier
  const keys = Object.keys(koder);
  return keys.reverse().map(fkode => {
    const kartlag = koder[fkode];
    return (
      <ForvaltningsEkspanderTopp
        kartlag={kartlag}
        key={fkode}
        {...props}
        visKoder={context.visKoder}
        onUpdateLayerProp={onUpdateLayerProp}
      />
    );
  });
};

export default ForvaltningsKartlag;
