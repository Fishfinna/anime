import { Router, Route, redirect } from "@solidjs/router";
import { createEffect } from "solid-js";
import { Search } from "./components/Search/search";
import "./App.scss";
import { SettingsProvider } from "./context/settingsContext";
import { Error } from "./components/Error/error";
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
          component={() => (
            <>
              <Search />
              <Results />
            </>
          )}
        ></Route>
        <Route
          path="anime/:showId"
          component={(data) => (
            <>
              <Search />
              <Viewer showId={data.params.showId} />
            </>
          )}
        ></Route>
        <Route path="*" component={() => <Error />}></Route>
      </Router>
    </SettingsProvider>
  );
}
