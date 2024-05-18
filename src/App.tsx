import { Router, Route, redirect } from "@solidjs/router";
import { createEffect } from "solid-js";
import { Search } from "./components/Search/search";
import "./App.scss";
import { SettingsProvider } from "./context/settingsContext";
import { ErrorPage } from "./components/Error/error";
import { Results } from "./components/Results/results";
import { Viewer } from "./components/Viewer/viewer";

export default function App() {
  createEffect(() => {
    redirect("anime");
  });

  return (
    <SettingsProvider>
      <Router>
        <Route
          path="anime"
          component={() => {
            return (
              <>
                <Search />
                <Results />
              </>
            );
          }}
        ></Route>
        <Route
          path="anime/:showId"
          component={(data) => (
            <>
              <Search />
              <Results />
              <Viewer showId={data.params.showId} />
            </>
          )}
        ></Route>
        <Route path="*" component={() => <ErrorPage />}></Route>
      </Router>
    </SettingsProvider>
  );
}
