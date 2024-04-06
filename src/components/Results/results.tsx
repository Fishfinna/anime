import { For, Show } from "solid-js";
import "./results.scss";

export function Results({ titles }: { titles: string[] }) {
  return (
    <div class="results-container">
      <For each={titles}>
        {(title) => (
          <div class="title">
            <button
              class="result"
              onClick={() => {
                console.log("click");
              }}
            >
              {title}
            </button>
            <Show when={title !== titles[titles.length - 1]}>
              <div class="line" />
            </Show>
          </div>
        )}
      </For>
    </div>
  );
}
