import http from "./http";

class Backend {
  static async getPromise(url) {
    try {
      const response = await fetch(url, {
        method: "get",
        headers: {
          Accept: "application/json"
        }
      });
      const json = await response.json();
      return json;
    } catch (e) {
      console.error(url, e);
      return null;
    }
  }

  static async hentLokalFil(filnavn) {
    return this.getPromise(filnavn);
  }

  static async updateLayer(id, data) {
    let url = `https://forvaltningsportaladmin.artsdatabanken.no/api/v1/kartlag/${id}/update/`;
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      url = `http://localhost:8000/api/v1/kartlag/${id}/update/`;
    }
    const body = JSON.stringify(data);

    try {
      var response = await http.put(url, body);

      var layer = await response.json();
    } catch (e) {
      console.error(`Failed to update layer ${data.tittel}.`);
    }

    return { response, layer };
  }
}

export default Backend;
