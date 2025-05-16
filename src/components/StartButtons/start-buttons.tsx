import "./start-buttons.scss";
import { SettingsContext } from "../../context/settingsContext";
import { useContext } from "solid-js";
import { Mode, SearchType } from "../../types/settings";

export function StartButtons() {
  const { setMode, setSearchType, setPage } = useContext(SettingsContext);

  function findPopular(event: Event) {
    event.preventDefault();
    setPage(1);
    setSearchType(SearchType.popular);
    setMode(Mode.title);
  }

  function findNew(event: Event) {
    event.preventDefault();
    setPage(1);
    setSearchType(SearchType.new);
    setMode(Mode.title);
  }

  return (
    <div class="start-buttons">
      <button class="basic-button" onClick={findPopular}>
        popular
      </button>
      <button class="basic-button" onClick={findNew}>
        new
      </button>
    </div>
  );
}
