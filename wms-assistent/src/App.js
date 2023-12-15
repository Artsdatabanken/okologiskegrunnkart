import React, {Suspense} from "react";
import homepage from "../package.json";
import TjenesteContainer from "./TjenesteContainer";
import CssBaseline from "@mui/material/CssBaseline";
import AuthenticationContextProvider from "./Kart/AuthenticationContextProvider";
import { ErrorBoundary } from "react-error-boundary";
import {
  BrowserRouter,
} from "react-router-dom";

const basename = process.env.NODE_ENV === "development" ? undefined : homepage;

const logError = (error, info) => {
  console.log(error, info)
  // Do something with the error, e.g. log to an external API
};

const ErrorFallback = () => <div>Noe gikk veldig galt..</div>

const Loading = () => <div>Loading...</div>
function App() {
  return (
    <React.StrictMode>
      <Suspense fallback={<Loading />}>
      <ErrorBoundary FallbackComponent={ErrorFallback} onError={logError}>
      <AuthenticationContextProvider>
        <BrowserRouter  basename={basename}>
          <CssBaseline />
            <div>
              <TjenesteContainer />
            </div>
        </BrowserRouter>
        </AuthenticationContextProvider>
      </ErrorBoundary>
      </Suspense>
    </React.StrictMode>
  );
}

export default App;
