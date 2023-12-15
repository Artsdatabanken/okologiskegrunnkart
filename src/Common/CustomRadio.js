import { withStyles } from "@mui/styles";
import { Radio } from "@mui/material";

const styles = {
  root: {
    color: "#666", // Green
    "&$checked": {
      color: "rgba(34, 170, 88, 1)" // Green
    },
    padding: "5px"
  },
  checked: {},
  disabled: {}
};

const CustomRadio = withStyles(styles)(Radio);

export default CustomRadio;
