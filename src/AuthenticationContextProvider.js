import React, { useState, useEffect } from "react";
import AuthenticationContext from "./AuthenticationContext";

const url = "https://artskart.artsdatabanken.no/appapi/api/token/gettoken";
const thirtyMinutes = 30 * 60 * 1000;

async function downloadToken() {
  window.setInterval(downloadToken, thirtyMinutes);
  console.log(new Date());
  try {
    const result = await fetch(url);
    const t = await result.text();
    return JSON.parse(t);
  } catch (err) {
    console.error("token troubles", url, err);
    return {};
  }
}

const AuthenticationContextProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  useEffect(() => {
    async function download() {
      const token = await downloadToken();
      setToken(token);
    }
    download();
  }, []);

  return (
    <AuthenticationContext.Provider value={token}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationContextProvider;
