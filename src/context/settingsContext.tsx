import { createContext, createSignal } from "solid-js";

export const SettingsContext = createContext();

export function SettingsProvider(props: { children: any }) {
  const [isSub, setSub] = createSignal(false);

  return (
    <SettingsContext.Provider value={{ isSub, setSub }}>
      {props.children}
    </SettingsContext.Provider>
  );
}
