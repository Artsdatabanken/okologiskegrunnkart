import { withStyles } from "@mui/styles";
import { Switch } from "@mui/material";

const styles = {
  root: {
    width: 62,
    height: 44,
    padding: 12,
    display: "flex"
  },
  switchBase: {
    padding: 14.5,
    color: "#999", // Grey
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
        borderColor: "#888"
      }
    }
  },
  thumb: {
    width: 15,
    height: 15,
    boxShadow: "none"
  },
  track: {
    border: `1px solid #bbb`,
    borderRadius: 20 / 2,
    height: 18,
    opacity: 1,
    backgroundColor: "#FFFFFF" // White
  },
  checked: {},
  disabled: {}
};

const CustomSwitchAll = withStyles(styles)(Switch);

export default CustomSwitchAll;
