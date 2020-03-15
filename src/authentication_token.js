const url = "https://artskart.artsdatabanken.no/appapi/api/token/gettoken";

const token = {};

fetch(url)
  .then(result => {
    result.text().then(t => {
      token.kartverket = JSON.parse(t);
      console.log("token ok", token);
    });
  })
  .catch(err => {
    console.error("token troubles", url, err);
    return {};
  });

export default token;
