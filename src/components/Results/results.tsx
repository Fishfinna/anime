import { For } from "solid-js";
import "./results.scss";

export function Results({ titles }: { titles: string[] }) {
  return (
    <div class="results-container">
      <For each={titles}>
        {(title) => (
          <>
            <p class="result">{title}</p>
          </>
        )}
      </For>
    </div>
  );
}
