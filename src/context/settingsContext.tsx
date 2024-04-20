import { Context, createContext, createSignal, createEffect } from "solid-js";
import { Title } from "../types/titles";
import { Mode, Settings } from "../types/settings";

export const SettingsContext = createContext() as Context<Settings>;

export function SettingsProvider(props: { children: any }) {
  const [mode, setMode] = createSignal<Mode>(Mode.none);
  const [titles, setTitles] = createSignal<Title[]>([]);
  const [currentTitle, setCurrentTitle] = createSignal<Title | undefined>();

  const updateLocalStorage = (settings: any) => {
    localStorage.setItem("settings", JSON.stringify(settings));
  };

  createEffect(() => {
    if (mode() != Mode.none) {
      const settings = {
        mode: mode(),
        titles: titles(),
        currentTitle: currentTitle(),
      };
      updateLocalStorage(settings);
    }
  });

  createEffect(() => {
    const savedSettings = localStorage.getItem("settings");
    console.log(savedSettings);
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      console.log(parsedSettings);
      setMode(parsedSettings.mode);
      setTitles(parsedSettings.titles);
      setCurrentTitle(parsedSettings.currentTitle);
    }
  }, []);

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
