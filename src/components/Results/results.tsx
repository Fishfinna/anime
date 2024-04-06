import { Accessor, For, Show } from "solid-js";
import "./results.scss";

export function Results({ titles }: { titles: Accessor<string[]> }) {
  return (
    <ul class="results-container">
      <For each={titles}>
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
            <Show when={index() !== titles().length - 1}>
              <div class="line" />
            </Show>
          </li>
        )}
      </For>
    </ul>
  );
}
