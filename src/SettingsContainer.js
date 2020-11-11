import React, { Component } from "react";
import { SettingsContext } from "./SettingsContext";

class SettingsContainer extends Component {
  state = {
    visAktiveLag: false,
    visHovedmeny: false,
    width: window.innerWidth
  };

  render() {
    return (
      <SettingsContext.Provider
        value={{
          visHovedmeny: this.state.visHovedmeny,
          visAktiveLag: this.state.visAktiveLag,
          width: this.state.width,
          onUpdateValue: this.handleUpdateValue,
          onToggleAktiveLag: this.handleToggleAktivelag,
          onToggleHovedmeny: this.handleToggleHovedmeny,
          onToggleForside: this.handleToggleForside,
          onMapMove: this.handleMapMove,
          onSetWidth: this.setWidth
        }}
      >
        {this.props.children}
      </SettingsContext.Provider>
    );
  }

  handleUpdateValue = (key, value) => {
    this.setState({ [key]: value });
    localStorage.setItem(key, value);
  };

  handleToggleAktivelag = () =>
    this.handleUpdateValue("visAktiveLag", !this.state.visAktiveLag);

  handleToggleHovedmeny = () => {
    this.handleUpdateValue("visHovedmeny", !this.state.visHovedmeny);
  };
  setWidth = width => {
    this.setState({ width });
  };
}

export default SettingsContainer;
