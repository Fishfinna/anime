import { Icon } from "../Icons/icon";
import { Results } from "../Results/results";
import { createSignal, onCleanup, useContext, Show } from "solid-js";
import { client, titlesQuery } from "../../api";
import { SettingsContext } from "../../context/settingsContext";

import "./search.scss";

export function Search() {
  const [inputRef, setInputRef] = createSignal<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = createSignal<boolean>(false);
  const [error, setError] = createSignal<string | null>(null);
  const [isActive, setIsActive] = createSignal<boolean>(false);
  const { selectMode, setSelectMode, titles, setTitles } =
    useContext(SettingsContext);
  let debounceTimeout: number | undefined;

  async function submitSearch(event: Event) {
    event.preventDefault();
    if (inputRef() && inputRef()!.value.trim() !== "") {
      const searchText = inputRef()!.value;
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
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      setTitles([]);
      setError(null);
    }
  }

  function handleInputChange() {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    debounceTimeout = setTimeout(() => {
      setSelectMode(true);
      submitSearch(new Event("input"));
    }, 600);
  }
  onCleanup(() => {
    setInputRef(null);
  });

  return (
    <>
      <div
        class="search"
        classList={{
          standby: !isActive(),
          active: isActive(),
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
            onFocus={() => setIsActive(true)}
            onBlur={() => setIsActive(!!titles().length)}
          ></input>
        </form>
      </div>
      <Show when={error()}>
        <div class="error">{error()}</div>
      </Show>
      <Show when={isLoading()}>
        <div class="loader"></div>
      </Show>
      <Results titles={titles} />
    </>
  );
}
