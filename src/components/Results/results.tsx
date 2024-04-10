import { Accessor, For, Show } from "solid-js";
import { Titles } from "../../types/titles";

import "./results.scss";

export function Results(props: { titles: Accessor<Titles[]> }) {
  return (
    <Show when={props.titles() && props.titles().length !== 0}>
      <div class="results-container">
        <For each={props.titles()}>
          {(title) => (
            <div class="title">
              <img src={title.thumbnail} />
              <h3 class="thumbnail-title">{title.name}</h3>
            </div>
          )}
        </For>
      </div>
    </Show>
  );
}
