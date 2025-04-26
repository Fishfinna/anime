import {
  For,
  Show,
  createEffect,
  createSignal,
  onMount,
  onCleanup,
  useContext,
} from "solid-js";
import { SettingsContext } from "../../context/settingsContext";
import { useNavigate } from "@solidjs/router";
import { Mode, SearchType } from "../../types/settings";
import { client, searchQuery, newQuery, popularQuery } from "../../api";
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
    page,
    setPage,
  } = useContext(SettingsContext);
  const [hasNextPage, setHasNextPage] = createSignal<boolean>(false);
  const [isLoading, setIsLoading] = createSignal<boolean>(false);
  const [error, setError] = createSignal<string | null>(null);
  const navigate = useNavigate();

  async function getNextPage(query: any, variables: any): Promise<boolean> {
    const validationVars = variables;
    validationVars.page++;
    const { data } = await client.query(query, validationVars).toPromise();
    return data.shows.edges.length !== 0;
  }

  async function performSearch(searchFunction: any, searchText?: string) {
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
      if (data.shows.edges.length >= 6) {
        setHasNextPage(await getNextPage(query, variables));
      }
      setTitles(data.shows.edges);
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

  onCleanup(() => {
    setPage(1);
  });

  createEffect(async () => {
    // dependencies
    searchType();
    searchTerm();

    if (mode() == Mode.title) {
      // load titles
      setTitles([]);
      setError(null);
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
      }
    }
  }, [searchType, searchTerm]);

  createEffect(() => {
    // dependencies
    searchTerm();

    setPage(1);
  }, [searchTerm]);

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
              <img
                src={title.thumbnail}
                alt={title.englishName || title.name}
                onError={(e) => {
                  const img = e.currentTarget;
                  if (!img.dataset.fallback) {
                    img.dataset.fallback = "true";
                    img.src = "/anime/default-thumbnail.png";
                  }
                }}
              />
              <Icon
                name="play_arrow filled"
                className="play-arrow material-icons-round"
              />
              <h3 class="thumbnail-title">{title.englishName || title.name}</h3>
            </div>
          )}
        </For>
      </div>
      <Show when={page() != 1 || hasNextPage()}>
        <div class="page-control">
          <button disabled={page() == 1}>
            <Icon
              name="chevron_left"
              onClick={() => setPage((page() as number) - 1)}
            />
          </button>
          <p class="page-control-block">|</p>
          <p class="current-page">page {page()}</p>
          <p class="page-control-block">|</p>
          <button disabled={!hasNextPage()}>
            <Icon
              name="chevron_right"
              onClick={() => setPage((page() as number) + 1)}
            />
          </button>
        </div>
      </Show>
    </Show>
  );
}
