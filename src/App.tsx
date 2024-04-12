import { Search } from "./components/Search/search";
import "./App.scss";
import { SettingsProvider } from "./context/settingsContext";
import { Results } from "./components/Results/results";
import { Viewer } from "./components/Viewer/viewer";

export default function App() {
  return (
    <SettingsProvider>
      <Search />
      <Results />
      <Viewer />
    </SettingsProvider>
  );
}
