import { Accessor, For, Show } from "solid-js";
import "./results.scss";

export function Results(props: { titles: Accessor<string[]> }) {
  return (
    <ul class="results-container">
      <For each={props.titles()}>
        {(title, index) => (
          <li class="title">
            <button
              class="result"
              onClick={() => {
                console.log("click");
              }}
            >
              {title}
            </button>
            <Show when={index() !== props.titles.length - 1}>
              <div class="line" />
            </Show>
          </li>
        )}
      </For>
    </ul>
  );
}
