import { createEffect, For, Show, useContext } from "solid-js";
import { SettingsContext } from "../../context/settingsContext";
import { Mode } from "../../types/settings";
import { Title } from "../Title/title";
import "./recent.scss";

export default function Recent() {
  const { watchLog, setWatchLog, mode } = useContext(SettingsContext);

  function clearRecentlyWatched() {
    setWatchLog([]);
  }

  return (
    <Show when={mode() === Mode.none && watchLog().length}>
      <h3>Recently Watching:</h3>
      <button class="basic-button" onClick={clearRecentlyWatched}>
        clear recently watching
      </button>
      <div class="recent-titles" />
      <For each={watchLog()}>
        {({ title, episodeNumber, timestamp }) => (
          <>
            <Title title={title} />
            <p>
              <b>ep.{episodeNumber}</b>
              <b>
                timestamp: {Math.floor((timestamp || 0) / 60)}:
                {String(Math.floor((timestamp || 0) % 60)).padStart(2, "0")}
              </b>
            </p>
          </>
        )}
      </For>
      <div />
    </Show>
  );
}
