import { createEffect, For, Show, useContext } from "solid-js";
import { SettingsContext } from "../../context/settingsContext";
import { Mode } from "../../types/settings";
import { Title } from "../Title/title";
import "./recent.scss";
import { Icon } from "../Icons/icon";

export default function Recent() {
  const { watchLog, setWatchLog, mode } = useContext(SettingsContext);

  function clearRecentlyWatched() {
    setWatchLog([]);
  }

  function removeRecentlyWatchedShow(index: number) {
    setWatchLog(watchLog().filter((_, i) => i !== index));
  }

  return (
    <Show when={mode() === Mode.none && watchLog().length}>
      <div class="recently-watching-container">
        <h3>Recently Watching:</h3>
        <button class="basic-button" onClick={clearRecentlyWatched}>
          clear recently watching
        </button>
        <div class="recent-titles" />
        <For each={watchLog()}>
          {({ title, episodeNumber }, index) => (
            <div class="recent-show-item">
              <Title title={title} episodeNumber={episodeNumber} />
              <button
                class="remove-button"
                onclick={() => removeRecentlyWatchedShow(index())}
              >
                <Icon name="close" />
              </button>
            </div>
          )}
        </For>
        <div />
      </div>
    </Show>
  );
}
