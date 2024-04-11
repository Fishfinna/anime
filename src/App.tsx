import { Search } from "./components/Search/search";
import "./App.scss";
import { SettingsProvider } from "./context/settingsContext";

export default function App() {
  return (
    <SettingsProvider>
      <Search />
    </SettingsProvider>
  );
}
