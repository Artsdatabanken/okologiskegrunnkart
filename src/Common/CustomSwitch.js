import { withStyles } from "@material-ui/core/styles";
import { Switch } from "@material-ui/core";

const styles = {
  root: {
    width: 62,
    height: 44,
    padding: 12,
    display: "flex"
  },
  switchBase: {
    padding: 14.5,
    color: "#808080", // Gray
    "&$checked": {
      transform: "translateX(18px)",
      color: "rgba(34, 170, 34, 1)", // White
      "& + $track": {
        opacity: 1,
        backgroundColor: "rgba(34, 170, 34, 0.2)",
        borderColor: "#000000"
      }
    }
  },
  thumb: {
    width: 15,
    height: 15,
    boxShadow: "none"
  },
  track: {
    border: `1px solid grey`,
    borderRadius: 20 / 2,
    height: 18,
    opacity: 1,
    backgroundColor: "#FFFFFF" // White
  },
  checked: {}
};

const CustomSwitch = withStyles(styles)(Switch);

export default CustomSwitch;
