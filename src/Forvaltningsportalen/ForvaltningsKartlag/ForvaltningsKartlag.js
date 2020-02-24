import React from "react";
import { SettingsContext } from "SettingsContext";
import ForvaltningsEkspanderTopp from "./ForvaltningsEkspanderTopp";
import { List, ListSubheader } from "@material-ui/core";

class ForvaltningsKartlag extends React.Component {
  // Denne funksjonen tar inn alle lagene som sendes inn, og henter ut per eier

  render() {
    const { onUpdateLayerProp } = this.props;
    const lag = this.props.kartlag;
    return (
      <SettingsContext.Consumer>
        {context => (
          <>
            <List>
              <DataEierLag
                koder={lag}
                onUpdateLayerProp={onUpdateLayerProp}
                context={context}
              ></DataEierLag>
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
        onUpdateLayerProp={onUpdateLayerProp}
      />
    );
  });
};

export default ForvaltningsKartlag;
