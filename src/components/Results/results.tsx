import { For, Show, useContext } from "solid-js";
import { SettingsContext } from "../../context/settingsContext";
import { useNavigate } from "@solidjs/router";
import { Mode } from "../../types/settings";

import "./results.scss";

export function Results() {
  const { mode, setMode, titles, setCurrentTitle } =
    useContext(SettingsContext);
  const navigate = useNavigate();

  return (
    <Show when={titles() && titles().length !== 0 && mode() == Mode.title}>
      <div class="results-container">
        <For each={titles()}>
          {(title) => (
            <div
              class="title"
              onClick={() => {
                navigate(title._id);
                setMode(Mode.episode);
              }}
            >
              <img src={title.thumbnail} />
              <h3 class="thumbnail-title">{title.englishName || title.name}</h3>
            </div>
          )}
        </For>
      </div>
    </Show>
  );
}
