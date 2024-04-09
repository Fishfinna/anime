import { Icon } from "./components/Icons/icon";
import { Search } from "./components/Search/search";
import "./App.scss";
import { Settings } from "./components/Settings/settings";
import { SettingsProvider } from "./context/settingsContext";

export default function App() {
  return (
    <SettingsProvider>
      <Settings />
      <Search />
    </SettingsProvider>
  );
}
