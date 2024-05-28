import { For, Show, createEffect, createSignal, useContext } from "solid-js";
import { SettingsContext } from "../../context/settingsContext";
import { useNavigate } from "@solidjs/router";
import { Mode } from "../../types/settings";
import { client, titlesQuery } from "../../api";
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
    setSearchTerm,
    setEpisodeNumber,
  } = useContext(SettingsContext);
  const [page, setPage] = createSignal<number>(1);
  const [hasNextPage, setHasNextPage] = createSignal<boolean>(false);
  const [isLoading, setIsLoading] = createSignal<boolean>(false);
  const [error, setError] = createSignal<string | null>(null);
  const navigate = useNavigate();

  createEffect(() => {
    setPage(1);
  }, [searchTerm]);

  createEffect(async () => {
    // load titles
    setTitles([]);
    setError(null);
    if (searchTerm()?.trim() != "" && searchTerm()) {
      setIsLoading(true);
      setEpisodeNumber("1");
      const { query, variables } = titlesQuery(`${searchTerm()}`, page());
      try {
        const { data: response } = await client
          .query(query, variables)
          .toPromise();
        if (response.shows.edges.length === 0) {
          console.log(searchTerm());
          throw new Error("No search results.");
        }
        setTitles(response.shows.edges);
        setCurrentTitle(undefined);
        setMode(Mode.title);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      setError(null);
      if (mode() == Mode.title) setMode(Mode.none);
    }

    // for navigation
    const { query, variables } = titlesQuery(`${searchTerm()}`, page() + 1);
    const { data } = await client.query(query, variables).toPromise();
    setHasNextPage(data.shows.edges.length !== 0);
  }, [page]);

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
              onClick={() => {
                setCurrentTitle(title);
                setMode(Mode.episode);
                setSearchTerm("");
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
