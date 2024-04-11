import { Context, createContext, createSignal } from "solid-js";
import { Titles } from "../types/titles";
import { Settings } from "../types/settings";

export const SettingsContext = createContext<Settings>() as Context<Settings>;

export function SettingsProvider(props: { children: any }) {
  const [selectMode, setSelectMode] = createSignal<boolean>(true);
  const [titles, setTitles] = createSignal<Titles[]>([]);

  return (
    <SettingsContext.Provider
      value={{ selectMode, setSelectMode, titles, setTitles }}
    >
      {props.children}
    </SettingsContext.Provider>
  );
}
