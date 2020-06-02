import React from "react";
import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import Container from "./Container";
import { homepage } from "../package.json";
import TjenesteContainer from "./TjenesteContainer";
import AppBarn from "./AppBarn";
import CssBaseline from "@material-ui/core/CssBaseline";
import AuthenticationContextProvider from "./Kart/AuthenticationContextProvider";

const basename = process.env.NODE_ENV === "development" ? undefined : homepage;

function App() {
  return (
    <Container>
      <BrowserRouter basename={basename}>
        <CssBaseline />
        {false && <AppBarn />}
        <Suspense fallback="loading...">
          <AuthenticationContextProvider>
            <div>
              <TjenesteContainer />
            </div>
          </AuthenticationContextProvider>
        </Suspense>
      </BrowserRouter>
    </Container>
  );
}

export default App;
