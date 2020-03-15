import { createLights } from "./lights";
import { createStyles } from "./styles";
import lagAktiveLag from "./sceneFunksjoner/lagAktiveLag";

function createScene(props) {
  //console.log(props);
  let config = {
    sources: {},
    cameras: {
      cam: {
        type: "flat"
      }
    },
    lights: createLights(),
    layers: {},
    styles: createStyles(),
    scene: { background: {} }
  };
  updateScene(config, props);
  return config;
}

function updateScene(config, props) {
  if (!config) return; // not yet loaded
  lagAktiveLag(props.aktiveLag, props.opplyst, config);
  console.log("config", config);
  return config;
}

export { createScene, updateScene };
