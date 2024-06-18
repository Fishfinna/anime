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

  // function findRandom(event: Event) {
  //   event.preventDefault();
  //   setSearchType(SearchType.random);
  //   setMode(Mode.title);
  // }

  return (
    <div class="start-buttons">
      <button onClick={findPopular}>popular</button>
      <button onClick={findNew}>new</button>
      {/* TODO: random */}
      {/* <button onClick={findRandom}>random</button> */}
    </div>
  );
}
