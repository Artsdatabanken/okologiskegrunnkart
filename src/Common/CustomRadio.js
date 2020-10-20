import { withStyles } from "@material-ui/core/styles";
import { Radio } from "@material-ui/core";

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
