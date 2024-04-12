import { Context, createContext, createSignal } from "solid-js";
import { Titles } from "../types/titles";
import { Mode, Settings } from "../types/settings";

export const SettingsContext = createContext() as Context<Settings>;

export function SettingsProvider(props: { children: any }) {
  const [mode, setMode] = createSignal(Mode.none);
  const [titles, setTitles] = createSignal<Titles[]>([]);
  const [episodes, setEpisodes] = createSignal<any>([]);

  return (
    <SettingsContext.Provider
      value={{ mode, setMode, titles, setTitles, episodes, setEpisodes }}
    >
      {props.children}
    </SettingsContext.Provider>
  );
}
