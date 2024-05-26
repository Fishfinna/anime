import { createSignal, onCleanup, useContext } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { SettingsContext } from "../../context/settingsContext";
import { Mode } from "../../types/settings";
import { Icon } from "../Icons/icon";

import "./search.scss";

export function Search() {
  const [inputRef, setInputRef] = createSignal<HTMLInputElement | null>(null);
  const [isActive, setIsActive] = createSignal<boolean>(false);
  const { mode, setMode, titles, setTitles, setSearchTerm } =
    useContext(SettingsContext);
  let debounceTimeout: number | undefined;
  const navigate = useNavigate();

  async function submitSearch(event: Event) {
    event.preventDefault();
    setSearchTerm(inputRef()!.value);
    setTitles([]);
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
          setMode(Mode.none);
          setIsActive(false);
          navigate("/anime");
        }}
        style={{ "font-size": "100px", color: "#4e4e4f" }}
      />

      <form class="search-form" onSubmit={submitSearch}>
        <button type="submit" class="search-btn" onClick={handleInputChange}>
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
            setMode(mode() == Mode.none ? Mode.title : Mode.episode);
            setIsActive(true);
            window.scrollTo(0, 0);
          }}
          onBlur={() => setIsActive(!!titles().length)}
        ></input>
      </form>
    </div>
  );
}
