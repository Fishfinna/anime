import { Accessor, For, Show, createSignal } from "solid-js";
import { Titles } from "../../types/titles";

import "./results.scss";

export function Results(props: { titles: Accessor<Titles[]> }) {
  const [selectMode, setSelectMode] = createSignal<boolean>(true);

  return (
    <Show when={props.titles() && props.titles().length !== 0 && selectMode()}>
      <div class="results-container">
        <For each={props.titles()}>
          {(title) => (
            <div
              class="title"
              onClick={() => {
                console.log(title);
                setSelectMode(false);
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
