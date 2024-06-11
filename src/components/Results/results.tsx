import {
  For,
  Show,
  createEffect,
  createSignal,
  onMount,
  useContext,
} from "solid-js";
import { SettingsContext } from "../../context/settingsContext";
import { useNavigate } from "@solidjs/router";
import { Mode, SearchType } from "../../types/settings";
import {
  limit,
  client,
  searchQuery,
  newQuery,
  randomQuery,
  popularQuery,
} from "../../api";
import { Icon } from "../Icons/icon";

import "./results.scss";

export function Results() {
  const {
    mode,
    setMode,
    titles,
    setTitles,
    setCurrentTitle,
    searchTerm,
    setEpisodeNumber,
    searchType,
  } = useContext(SettingsContext);
  const [page, setPage] = createSignal<number>(1);
  const [hasNextPage, setHasNextPage] = createSignal<boolean>(false);
  const [isLoading, setIsLoading] = createSignal<boolean>(false);
  const [error, setError] = createSignal<string | null>(null);
  const navigate = useNavigate();

  async function performSearch(searchFunction: any, searchText?: string) {
    console.log("here");
    setIsLoading(true);
    setEpisodeNumber("1");
    setHasNextPage(false);
    setCurrentTitle(undefined);
    setMode(Mode.title);
    const { query, variables } = searchText
      ? searchFunction(searchText, page())
      : searchFunction(page());
    try {
      const { data } = await client.query(query, variables).toPromise();
      if (data.shows.edges.length === 0) {
        throw new Error("No search results.");
      }
      setHasNextPage(data.shows.edges.length > limit);
      setTitles(data.shows.edges.slice(0, -1));
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  onMount(() => {
    setPage(1);
  });

  createEffect(async () => {
    if (mode() == Mode.title) {
      // load titles
      setTitles([]);
      setError(null);
      console.log("search");
      if (searchType() == SearchType.text) {
        if (searchTerm()?.trim() != "" && searchTerm()) {
          performSearch(searchQuery, searchTerm());
        } else if (!searchTerm()) {
          setError(null);
          if (mode() == Mode.title) setMode(Mode.none);
        }
      } else if (searchType() == SearchType.popular) {
        performSearch(popularQuery);
      } else if (searchType() == SearchType.new) {
        performSearch(newQuery);
      } else if (searchType() == SearchType.random) {
        performSearch(randomQuery);
      }
    }
  }, [searchType, searchTerm]);

  return (
    <Show when={mode() === Mode.title}>
      <Show when={error()}>
        <div class="error">{error()}</div>
      </Show>
      <Show when={isLoading()}>
        <div class="loader"></div>
      </Show>

      <div class="results-container">
        <For each={titles()}>
          {(title) => (
            <div
              class="title"
              onClick={(event) => {
                event.preventDefault();
                setCurrentTitle(title);
                setMode(Mode.episode);
                navigate(`/anime/${title._id}`);
              }}
            >
              <img src={title.thumbnail} />
              <h3 class="thumbnail-title">{title.englishName || title.name}</h3>
            </div>
          )}
        </For>
      </div>
      <Show when={page() != 1 || hasNextPage()}>
        <div class="page-control">
          <button disabled={page() == 1}>
            <Icon name="chevron_left" onClick={() => setPage(page() - 1)} />
          </button>
          <p class="page-control-block">|</p>
          <p class="current-page">page {page()}</p>
          <p class="page-control-block">|</p>
          <button disabled={!hasNextPage()}>
            <Icon name="chevron_right" onClick={() => setPage(page() + 1)} />
          </button>
        </div>
      </Show>
    </Show>
  );
}
