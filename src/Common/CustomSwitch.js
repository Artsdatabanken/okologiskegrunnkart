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
    color: "#aaa", // Grey
    "&$checked": {
      transform: "translateX(18px)",
      color: "rgba(34, 170, 88, 1)", // Green
      "&$disabled": {
        color: "rgb(189, 189, 189)", // Grey
        "& + $track": {
          opacity: 1,
          backgroundColor: "rgba(0, 0, 0, 0.12)", // Grey
          borderColor: "rgba(0, 0, 0, 0.02)" // Grey
        }
      },
      "& + $track": {
        opacity: 1,
        backgroundColor: "rgba(34, 170, 88, 0.2)", // Green
        borderColor: "#999"
      }
    }
  },
  thumb: {
    width: 15,
    height: 15,
    boxShadow: "none"
  },
  track: {
    border: `1px solid #ccc`,
    borderRadius: 20 / 2,
    height: 18,
    opacity: 1,
    backgroundColor: "#FFFFFF" // White
  },
  checked: {},
  disabled: {}
};

const CustomSwitch = withStyles(styles)(Switch);

export default CustomSwitch;
