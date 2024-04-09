import { Icon } from "../Icons/icon";
import { Results } from "../Results/results";
import { createSignal, onCleanup, Show, useContext } from "solid-js";
import { client, titlesQuery } from "../../api";
import { SettingsContext } from "../../context/settingsContext";

import "./search.scss";

interface Show {
  _id: string;
  name: string;
  availableEpisodes: {
    sub: number;
    dub: number;
    raw: number;
  };
  __typename: string;
}

export function Search() {
  const [titles, setTitles] = createSignal<string[]>([]);
  const [inputRef, setInputRef] = createSignal<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = createSignal<boolean>(false);
  const [error, setError] = createSignal<string | null>(null);
  const [data, setData] = createSignal<Show[] | null>(null);
  const { isSub } = useContext<any>(SettingsContext);
  let debounceTimeout: number | undefined;

  async function submitSearch(event: Event) {
    event.preventDefault();
    setTitles([]);
    setData(null);
    if (inputRef() && inputRef()!.value.trim() !== "") {
      const searchText = inputRef()!.value;
      setIsLoading(true);
      const { query, variables } = titlesQuery(searchText, isSub());
      try {
        const { data: response } = await client
          .query(query, variables)
          .toPromise();

        if (response.shows.edges.length === 0) {
          throw new Error("No search results.");
        }

        setData(response.shows.edges);
        setError(null);
        if (data) setTitles(data()!.map((x: Show) => x.name));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
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
    <>
      <div
        class="search"
        classList={{ standby: data() != null, active: data() == null }}
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
          ></input>
        </form>
        <Results titles={titles} />
      </div>
      <Show when={isLoading()}>
        <div class="loader"></div>
      </Show>
      <Show when={error()}>
        <div class="error">{error()}</div>
      </Show>
      {/* <div>{`${JSON.stringify(data())}`}</div> */}
    </>
  );
}
