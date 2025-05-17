import {
  Context,
  createContext,
  createSignal,
  onMount,
  createEffect,
} from "solid-js";
import { Title } from "../types/titles";
import { Mode, SearchType, Settings } from "../types/settings";
import { WatchLog } from "../types/watchLog";

export const SettingsContext = createContext() as Context<Settings>;

export function SettingsProvider(props: { children: any }) {
  const [mode, setMode] = createSignal<Mode>(Mode.none);
  const [titles, setTitles] = createSignal<Title[]>([]);
  const [currentTitle, setCurrentTitle] = createSignal<Title | undefined>();
  const [isDub, setIsDub] = createSignal<boolean>(false);
  const [episodeNumber, setEpisodeNumber] = createSignal<string | undefined>();
  const [timestamp, setTimestamp] = createSignal<number | undefined>(0);
  const [searchTerm, setSearchTerm] = createSignal<string | undefined>();
  const [searchType, setSearchType] = createSignal<SearchType | undefined>();
  const [page, setPage] = createSignal<number>(1);
  const [watchLog, setWatchLog] = createSignal<WatchLog[]>([]);

  let initialized = false;

  onMount(() => {
    const savedSettings = localStorage.getItem("settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setMode(parsed.mode ?? Mode.none);
        setTitles(parsed.titles ?? []);
        setCurrentTitle(parsed.currentTitle);
        setIsDub(parsed.isDub ?? false);
        setEpisodeNumber(parsed.episodeNumber);
        setTimestamp(parsed.timestamp ?? 0);
        setSearchTerm(parsed.searchTerm);
        setWatchLog(parsed.watchLog ?? []);
      } catch (err) {
        console.error("Failed to parse saved settings", err);
      }
    }

    initialized = true;
  });

  createEffect(() => {
    if (!initialized) return;

    const settings = {
      mode: mode(),
      titles: titles(),
      currentTitle: currentTitle(),
      isDub: isDub(),
      episodeNumber: episodeNumber(),
      timestamp: timestamp(),
      searchTerm: searchTerm(),
      watchLog: watchLog(),
    };

    try {
      localStorage.setItem("settings", JSON.stringify(settings));
    } catch (err) {
      console.error("Failed to save settings", err);
    }
  });

  return (
    <SettingsContext.Provider
      value={{
        mode,
        setMode,
        titles,
        setTitles,
        currentTitle,
        setCurrentTitle,
        isDub,
        setIsDub,
        episodeNumber,
        setEpisodeNumber,
        timestamp,
        setTimestamp,
        searchTerm,
        setSearchTerm,
        searchType,
        setSearchType,
        page,
        setPage,
        watchLog,
        setWatchLog,
      }}
    >
      {props.children}
    </SettingsContext.Provider>
  );
}
