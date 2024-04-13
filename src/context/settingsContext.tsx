import { Context, createContext, createSignal } from "solid-js";
import { Title } from "../types/titles";
import { Mode, Settings } from "../types/settings";

export const SettingsContext = createContext() as Context<Settings>;

export function SettingsProvider(props: { children: any }) {
  const [mode, setMode] = createSignal(Mode.none);
  const [titles, setTitles] = createSignal<Title[]>([]);
  const [currentTitle, setCurrentTitle] = createSignal<Title | undefined>();

  return (
    <SettingsContext.Provider
      value={{
        mode,
        setMode,
        titles,
        setTitles,
        currentTitle,
        setCurrentTitle,
      }}
    >
      {props.children}
    </SettingsContext.Provider>
  );
}
