import { Icon } from "./components/Icons/icon";
import { Search } from "./components/Search/search";
import { Results } from "./components/Results/results";
import "./App.scss";
import { createSignal, Show } from "solid-js";

export default function App() {
  const [titles, setTitles] = createSignal<string[]>([]);
  setTitles(["test", "a very  see the  sdfsdf sdfs"]);
  return (
    <>
      <Icon
        name="emoji_food_beverage"
        style={{ "font-size": "100px", color: "#4e4e4f" }}
      />
      <Search setTitles={setTitles} />
      <Show when={titles() && titles().length != 0}>
        <Results titles={titles()} />
      </Show>
    </>
  );
}
