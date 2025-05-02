import { Router, Route, redirect, useSearchParams } from "@solidjs/router";
import { createEffect } from "solid-js";
import { Search } from "./components/Search/search";
import "./App.scss";
import { SettingsProvider } from "./context/settingsContext";
import { ErrorPage } from "./components/Error/error";
import { Results } from "./components/Results/results";
import { Viewer } from "./components/Viewer/viewer";
import Recent from "./components/Recent/recent";

function AnimePage() {
  const [searchParams] = useSearchParams();
  const showId = searchParams.show_id;

  return (
    <>
      <Search />
      <Recent />
      <Results />
      <Viewer showId={showId} />
    </>
  );
}

export default function App() {
  createEffect(() => {
    redirect("anime");
  });

  return (
    <SettingsProvider>
      <Router>
        <Route path="anime" component={AnimePage} />
        <Route path="*" component={ErrorPage} />
      </Router>
    </SettingsProvider>
  );
}
