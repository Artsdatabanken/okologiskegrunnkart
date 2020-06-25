const getCookie = name => {
  let value = null;

  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      cookie = cookie.trim();

      if (cookie.substring(0, name.length + 1) === name + "=") {
        value = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }

  return value;
};

export { getCookie };

export default () => {
  return getCookie("csrftoken");
};
