// RESTful JSON API
const json_api = {
  parse: async response => JSON.parse(await response.text())
};

export default json_api;
