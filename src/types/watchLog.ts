import { Title } from "./titles";

export interface WatchLog {
  title: Title;
  episodeNumber?: number;
  timestamp?: number;
  isDub?: boolean;
}
