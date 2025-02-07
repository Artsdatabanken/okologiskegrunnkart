import React, { useState, useEffect } from "react";
import AuthenticationContext from "./AuthenticationContext";

// geonorge-tokenet som vi må ha for å få lov å laste lukkede data

const url = "https://www.norgeskart.no/ws/gkt.py";
const thirtyMinutes = 30 * 60 * 1000;

async function downloadToken() {
  window.setTimeout(downloadToken, thirtyMinutes);
  try {
    const result = await fetch(url);
    const t = await result.text();
    var parts = t.split('"');
    var token = parts[1];
    return token;
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
