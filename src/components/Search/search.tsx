import { Icon } from "../Icons/icon";
import { Results } from "../Results/results";
import { createSignal, Show } from "solid-js";

import "./search.scss";

export function Search() {
  const [titles, setTitles] = createSignal<string[]>([]);
  const [inputRef, setInputRef] = createSignal<HTMLInputElement | null>(null);

  function submitSearch(event: Event) {
    event.preventDefault();
    if (inputRef() && inputRef()!.value.trim() !== "") {
      const newTitle = inputRef()!.value;
      setTitles((prevTitles) => [...prevTitles, newTitle]);
      inputRef()!.value = "";
    }
  }

  return (
    <div class="search">
      <form class="search-form" onSubmit={submitSearch}>
        <button type="submit" class="search-btn">
          <Icon
            name="search"
            style={{
              fontSize: "20px",
              color: "#4e4e4f",
              verticalAlign: "bottom",
            }}
          />
        </button>
        <input ref={setInputRef} placeholder="search"></input>
      </form>
      <Show when={titles() && titles().length !== 0}>
        <Results titles={titles} />
      </Show>
    </div>
  );
}
