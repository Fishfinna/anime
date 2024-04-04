import { Icon } from "./components/Icons/icon";
import { Search } from "./components/Search/search";
import { Results } from "./components/Results/results";
import "./App.scss";
import { createSignal } from "solid-js";

export default function App() {
  const [titles, setTitles] = createSignal<string[]>([]);
  setTitles(["test", "data", "a very long title so I can see the results"]);
  return (
    <>
      <Icon
        name="emoji_food_beverage"
        style={{ "font-size": "100px", color: "#4e4e4f" }}
      />
      <Search setTitles={setTitles} />
      <Results titles={titles()} />
    </>
  );
}
