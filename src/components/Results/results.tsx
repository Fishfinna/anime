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
import { Mode, SearchType } from "../../types/settings";
import { client, searchQuery, newQuery, popularQuery } from "../../api";
import { Icon } from "../Icons/icon";

import "./results.scss";
import { Title } from "../Title/title";

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
  const [currentLimit, setCurrentLimit] = createSignal<number>(6);

  function calculateOptimalLimit(): number {
    const maxCards = 24;
    const minCards = 4;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const cardWidth = 180 + (2 * viewportWidth) / 100;
    const cardHeight = 240 + (2 * viewportWidth) / 100;
    const containerMargins = 50;
    const availableWidth = viewportWidth - containerMargins;
    const availableHeight = viewportHeight - 100;

    const effectiveCardWidth = cardWidth + 30;
    let cardsPerRow = Math.floor(availableWidth / effectiveCardWidth);

    cardsPerRow = Math.max(1, cardsPerRow);
    if (viewportWidth < 1250) {
      cardsPerRow = Math.min(4, cardsPerRow);
    } else if (viewportWidth < 1550) {
      cardsPerRow = Math.min(5, cardsPerRow);
    } else {
      cardsPerRow = Math.min(6, cardsPerRow);
    }

    const effectiveCardHeight = cardHeight + 50;
    const rowsPerScreen = Math.floor(availableHeight / effectiveCardHeight);
    const safeRowsPerScreen = Math.max(1, Math.min(4, rowsPerScreen)); // Max 4 rows

    let totalCards = cardsPerRow * safeRowsPerScreen;
    if (totalCards > maxCards) {
      totalCards = Math.floor(maxCards / cardsPerRow) * cardsPerRow;
    }

    totalCards = Math.max(cardsPerRow, totalCards);
    totalCards = Math.max(minCards, totalCards);
    return totalCards;
  }

  function updateLimit() {
    const newLimit = calculateOptimalLimit();
    setCurrentLimit(newLimit);
  }

  async function getNextPage(query: any, variables: any): Promise<boolean> {
    const validationVars = { ...variables };
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

    const limit = currentLimit();
    const { query, variables } = searchText
      ? searchFunction(searchText, page(), limit)
      : searchFunction(page(), limit);

    try {
      const { data } = await client.query(query, variables).toPromise();
      if (data.shows.edges.length === 0) {
        throw new Error("No search results.");
      }
      if (data.shows.edges.length >= limit) {
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
    updateLimit();

    const handleResize = () => {
      updateLimit();
      if (mode() === Mode.title && titles().length > 0) {
        if (searchType() === SearchType.text && searchTerm()) {
          performSearch(searchQuery, searchTerm());
        } else if (searchType() === SearchType.popular) {
          performSearch(popularQuery);
        } else if (searchType() === SearchType.new) {
          performSearch(newQuery);
        }
      }
    };

    window.addEventListener("resize", handleResize);
    onCleanup(() => {
      window.removeEventListener("resize", handleResize);
    });
  });

  onCleanup(() => {
    setPage(1);
  });

  createEffect(async () => {
    searchType();
    searchTerm();

    if (mode() == Mode.title) {
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

  createEffect(async () => {
    const currentPage = page();

    if (currentPage && currentPage > 1 && mode() === Mode.title) {
      if (searchType() === SearchType.text && searchTerm()) {
        performSearch(searchQuery, searchTerm());
      } else if (searchType() === SearchType.popular) {
        performSearch(popularQuery);
      } else if (searchType() === SearchType.new) {
        performSearch(newQuery);
      }
    }
  }, [page]);

  createEffect(() => {
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
        <For each={titles()}>{(title) => <Title title={title} />}</For>
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
