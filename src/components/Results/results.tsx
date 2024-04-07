import { Accessor, For, Show } from "solid-js";
import "./results.scss";

export function Results(props: { titles: Accessor<string[]> }) {
  return (
    <Show when={props.titles() && props.titles().length !== 0}>
      <ul class="results-container">
        <For each={props.titles()}>
          {(title, index) => (
            <li classList={{ title: true, visible: true }}>
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
    </Show>
  );
}
