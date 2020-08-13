import React from "react";
import { TextField } from "@material-ui/core";

class PlainTextField extends React.Component {
  shouldComponentUpdate(prevProps) {
    console.log(this.props, prevProps);
    return this.props.value != prevProps.value;
  }
  componentWillUnmount() {
    console.log("UNMOUNT!!!!!");
  }

  componentWillMount() {
    console.log("MOUNT!!!!");
  }

  render() {
    const { title, value, onUpdate, dockey, inputProps } = this.props;
    return (
      <TextField
        key={dockey}
        id={dockey}
        label={title}
        variant="outlined"
        multiline
        value={value}
        style={{ marginTop: 8, width: "100%" }}
        onChange={e => onUpdate(dockey, e.target.value)}
        InputProps={inputProps}
      />
    );
  }
}

const xPlainTextField = ({ title, value, onUpdate, dockey, inputProps }) => {
  //    console.log({ title, value, dockey })
  return (
    <TextField
      key={dockey}
      id={dockey}
      label={title}
      variant="outlined"
      multiline
      value={value}
      style={{ marginTop: 8, width: "100%" }}
      onChange={e => onUpdate(dockey, e.target.value)}
      InputProps={inputProps}
    />
  );
};

export default PlainTextField;
