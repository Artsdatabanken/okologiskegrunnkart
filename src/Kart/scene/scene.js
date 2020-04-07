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
    layers: {},
    styles: createStyles(),
    scene: { background: {} }
  };
  updateScene(config, props);
  return config;
}

function updateScene(config, props) {
  if (!config) return; // not yet loaded
  lagAktiveLag({ bk: props.bakgrunnskart }, config, props.token);
  return config;
}

export { createScene, updateScene };
