import { Icon } from "../Icons/icon";
import { createSignal, onCleanup, useContext, Show } from "solid-js";
import { client, titlesQuery } from "../../api";
import { SettingsContext } from "../../context/settingsContext";
import { Mode } from "../../types/settings";

import "./search.scss";

export function Search() {
  const [inputRef, setInputRef] = createSignal<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = createSignal<boolean>(false);
  const [error, setError] = createSignal<string | null>(null);
  const [isActive, setIsActive] = createSignal<boolean>(false);
  const { mode, setMode, titles, setTitles } = useContext(SettingsContext);
  let debounceTimeout: number | undefined;

  async function submitSearch(event: Event) {
    event.preventDefault();
    if (inputRef() && inputRef()!.value.trim() !== "") {
      const searchText = inputRef()!.value;
      setMode(Mode.none);
      setIsLoading(true);
      const { query, variables } = titlesQuery(searchText);
      try {
        const { data: response } = await client
          .query(query, variables)
          .toPromise();

        if (response.shows.edges.length === 0) {
          throw new Error("No search results.");
        }
        setTitles(response.shows.edges);
        setMode(Mode.title);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      setTitles([]);
      setError(null);
      if (mode() == Mode.title) setMode(Mode.none);
    }
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
            setIsActive(true);
            window.scrollTo(0, 0);
          }}
          onBlur={() => setIsActive(!!titles().length)}
        ></input>
      </form>

      <Show when={error()}>
        <div class="error">{error()}</div>
      </Show>
      <Show when={isLoading()}>
        <div class="loader"></div>
      </Show>
    </div>
  );
}
