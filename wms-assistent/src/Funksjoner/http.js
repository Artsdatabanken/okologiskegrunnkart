import csrfToken from "./csrf";

const defaultHeaders = { "Content-Type": "application/json" };

const put = async (
  url,
  data,
  headers = defaultHeaders,
  credentials = "include"
) => {
  headers["X-CSRFToken"] = csrfToken();

  const request = new Request(url, {
    method: "PUT",
    mode: "cors",
    credentials: credentials,
    headers: new Headers(headers),
    body: data
  });

  return fetch(request);
};

const putter = { put };

export default putter;
