import { createLights } from "./lights";
import { createStyles } from "./styles";
import lagAktiveLag from "./sceneFunksjoner/lagAktiveLag";

function createScene(props) {
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
  const viserKatalog = !!props.meta; // meta = true or meta = false , never meta = null
  lagAktiveLag(props.aktiveLag, viserKatalog, props.opplyst, config);
  return config;
}

export { createScene, updateScene };
