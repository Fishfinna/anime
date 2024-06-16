import { Show, createSignal, onCleanup, useContext } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { SettingsContext } from "../../context/settingsContext";
import { Mode, SearchType } from "../../types/settings";
import { Icon } from "../Icons/icon";
import { StartButtons } from "../StartButtons/start-buttons";

import "./search.scss";

export function Search() {
  const [inputRef, setInputRef] = createSignal<HTMLInputElement | null>(null);
  const [isActive, setIsActive] = createSignal<boolean>(false);
  const {
    mode,
    setMode,
    titles,
    setTitles,
    setSearchTerm,
    setSearchType,
    setCurrentTitle,
  } = useContext(SettingsContext);
  let debounceTimeout: number | undefined;
  const navigate = useNavigate();

  async function submitSearch(event: Event) {
    event.preventDefault();
    setSearchTerm(inputRef()!.value);
    setMode(Mode.title);
    setTitles([]);
    setSearchType(SearchType.text);
  }

  function handleInputChange() {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    debounceTimeout = setTimeout(() => {
      submitSearch(new Event("input"));
    }, 600);
  }
  onCleanup(() => {
    setInputRef(null);
    setSearchTerm("");
  });

  return (
    <div
      class="search"
      classList={{
        standby: !isActive() && mode() == Mode.none,
        active: isActive() || mode() != Mode.none,
      }}
    >
      <Icon
        name="emoji_food_beverage"
        className="main-icon"
        onClick={() => {
          navigate("/anime");
          setMode(Mode.none);
          setCurrentTitle(undefined);
          setIsActive(false);
        }}
        style={{ "font-size": "100px", color: "#4e4e4f" }}
      />

      <form class="search-form" onSubmit={submitSearch}>
        <button type="submit" class="search-btn" onClick={submitSearch}>
          <Icon
            name="search"
            style={{
              fontSize: "20px",
              color: "#4e4e4f",
              verticalAlign: "bottom",
            }}
          />
        </button>
        <input
          ref={setInputRef}
          onInput={handleInputChange}
          placeholder="search"
          onFocus={() => {
            setIsActive(true);
            window.scrollTo(0, 0);
          }}
          onBlur={() => {
            setIsActive(!!titles().length);
            if (!inputRef()?.value && !titles().length) {
              setMode(Mode.none);
            }
          }}
        ></input>
      </form>
      <Show when={mode() === Mode.none}>
        <StartButtons />
      </Show>
    </div>
  );
}
