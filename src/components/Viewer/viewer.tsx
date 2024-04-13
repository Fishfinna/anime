import { For, Show, createSignal, useContext } from "solid-js";
import { Mode } from "../../types/settings";
import { SettingsContext } from "../../context/settingsContext";
import { Toggle } from "../Toggle/toggle";
import Video from "../Video/video";

export function Viewer() {
  const { mode, currentTitle, setMode } = useContext(SettingsContext);
  const [isDub, setIsDub] = createSignal(false);

  if (mode() != Mode.episode || !currentTitle()) {
    setMode(Mode.none);
  }

  return (
    <Show when={mode() == Mode.episode}>
      {/* <Video qualities={} /> */}
      <Toggle options={["sub", "dub"]} state={isDub} setState={setIsDub} />
      <div>{JSON.stringify(currentTitle())}</div>
      <For
        each={currentTitle()?.availableEpisodesDetail[
          isDub() ? "dub" : "sub"
        ].sort((a: any, b: any) => a - b)}
      >
        {(episode) => <button>{episode}</button>}
      </For>
    </Show>
  );
}
