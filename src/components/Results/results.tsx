import { For, Show, createSignal, useContext } from "solid-js";
import { SettingsContext } from "../../context/settingsContext";
import { useNavigate } from "@solidjs/router";
import { Mode } from "../../types/settings";

import "./results.scss";
import { Icon } from "../Icons/icon";

export function Results() {
  const { mode, setMode, titles, setCurrentTitle } =
    useContext(SettingsContext);
  const [page, setPage] = createSignal(1);
  const navigate = useNavigate();

  return (
    <Show when={titles() && titles().length !== 0 && mode() == Mode.title}>
      <div class="results-container">
        <For each={titles()}>
          {(title) => (
            <div
              class="title"
              onClick={() => {
                navigate(`/anime/${title._id}`);
                setCurrentTitle(title);
                setMode(Mode.episode);
              }}
            >
              <img src={title.thumbnail} />
              <h3 class="thumbnail-title">{title.englishName || title.name}</h3>
            </div>
          )}
        </For>
      </div>
      <div class="page-control">
        <button disabled>&lt; prev</button>
        <p class="page-control-block">|</p>
        <p class="current-page">page {page() || 0}</p>
        <p class="page-control-block">|</p>
        <button disabled>next &gt;</button>
      </div>
    </Show>
  );
}
