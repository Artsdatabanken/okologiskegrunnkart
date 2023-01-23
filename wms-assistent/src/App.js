import React from "react";
import Suspense from "react";
import { BrowserRouter } from "react-router-dom";
import homepage from "../package.json";
import TjenesteContainer from "./TjenesteContainer";
import CssBaseline from "@mui/material/CssBaseline";
import AuthenticationContextProvider from "./Kart/AuthenticationContextProvider";

const basename = process.env.NODE_ENV === "development" ? undefined : homepage;

function App() {
  return (
    <BrowserRouter basename={basename}>
      <CssBaseline />
      <Suspense fallback="loading...">
        <AuthenticationContextProvider>
          <div>
            <TjenesteContainer />
          </div>
        </AuthenticationContextProvider>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
