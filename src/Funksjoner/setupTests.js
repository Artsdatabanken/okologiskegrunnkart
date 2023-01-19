import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import backend from "Funksjoner/backend";

configure({ adapter: new Adapter() });

jest.mock("@mui/lab/Slider");
jest.mock("@mui/material/Button");
jest.mock("@mui/material/Drawer");
jest.mock("@mui/material/TextField", () => "TextField");
jest.mock("@mui/material/Tooltip");
jest.mock("@mui/material/MenuItem");
jest.mock("backend", () => () => ({}));

jest.mock("./Kart", () => "tangram");
jest.mock("tangram/dist/tangram.debug", () => "tangram");

var localStorageMock = (function() {
  var store = {};
  return {
    getItem: function(key) {
      return store[key];
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    clear: function() {
      store = {};
    },
    removeItem: function(key) {
      delete store[key];
    }
  };
})();

global.localStorage = localStorageMock;
