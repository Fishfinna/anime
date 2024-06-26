import { Accessor } from "solid-js";
import { Title } from "./titles";
import { WatchLog } from "./watchLog";

export interface Settings {
  mode: Accessor<Mode>;
  setMode: (arg: Mode) => void;
  titles: Accessor<Title[]>;
  setTitles: (arg: Title[]) => void;
  currentTitle: Accessor<Title | undefined>;
  setCurrentTitle: (arg: Title | undefined) => void;
  isDub: Accessor<boolean>;
  setIsDub: (arg: boolean) => void;
  episodeNumber: Accessor<string | undefined>;
  setEpisodeNumber: (arg: string) => void;
  searchTerm: Accessor<string | undefined>;
  setSearchTerm: (arg: string) => void;
  searchType: Accessor<SearchType | undefined>;
  setSearchType: (arg: SearchType) => void;
  page: Accessor<number | undefined>;
  setPage: (arg: number) => void;
  watchLog: Accessor<WatchLog[]>;
  setWatchLog: (arg: WatchLog[]) => void;
}

export enum Mode {
  none = "none",
  title = "title",
  episode = "episode",
}

export enum SearchType {
  text = "text",
  popular = "popular",
  new = "new",
  random = "random",
}
