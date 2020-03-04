// RESTful JSON API 
const json_api = {
    makeUrl: (url, lat, lng) => url + `&lat=${lat}&lng=${lng}`,
    parse: async response => JSON.parse(await response.text())
}

export default json_api;
