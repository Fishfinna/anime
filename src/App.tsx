import { Router, Route, useNavigate, redirect } from "@solidjs/router";
import { createEffect } from "solid-js";
import { Search } from "./components/Search/search";
import "./App.scss";
import { SettingsProvider } from "./context/settingsContext";
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
              <Viewer />
            </>
          )}
        ></Route>
        <Route
          path="anime/:showid"
          component={(data) => <p>{JSON.stringify(data)}</p>}
        ></Route>
        <Route
          path="*"
          component={() => {
            const navigate = useNavigate();
            return (
              <>
                <h1>Show not found</h1>
                <button onClick={() => navigate("anime")}>Return Home</button>
              </>
            );
          }}
        ></Route>
      </Router>
    </SettingsProvider>
  );
}
