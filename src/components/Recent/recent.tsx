import { For, Show, useContext } from "solid-js";
import { SettingsContext } from "../../context/settingsContext";
import { Mode } from "../../types/settings";

export default function Recent() {
  const { watchLog, mode } = useContext(SettingsContext);

  return (
    <Show when={mode() === Mode.none}>
      <h3>Recently Watching:</h3>
      <For each={watchLog()}>
        {({ title, episodeNumber, timestamp }) => (
          <p>
            {title.name} <b>ep.{episodeNumber}</b>
            <b>
              timestamp: {Math.floor((timestamp || 0) / 60)}:
              {String(Math.floor((timestamp || 0) % 60)).padStart(2, "0")}
            </b>
          </p>
        )}
      </For>
    </Show>
  );
}
