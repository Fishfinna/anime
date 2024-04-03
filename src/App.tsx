import { Icon } from "./components/Icons/icon";
import { Search } from "./components/Search/search";
import "./App.css";

export default function App() {
  return (
    <>
      <Icon
        name="emoji_food_beverage"
        style={{ "font-size": "100px", color: "#4e4e4f" }}
      />
      <Search />
    </>
  );
}
