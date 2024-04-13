import { For, Show, useContext } from "solid-js";
import { SettingsContext } from "../../context/settingsContext";
import { Mode } from "../../types/settings";

import "./results.scss";

export function Results() {
  const { mode, setMode, titles, setCurrentTitle } =
    useContext(SettingsContext);

  return (
    <Show when={titles() && titles().length !== 0 && mode() == Mode.title}>
      <div class="results-container">
        <For each={titles()}>
          {(title) => (
            <div
              class="title"
              onClick={() => {
                console.log(title);
                setCurrentTitle(title);
                setMode(Mode.episode);
              }}
            >
              <img src={title.thumbnail} />
              <h3 class="thumbnail-title">{title.name}</h3>
            </div>
          )}
        </For>
      </div>
    </Show>
  );
}
