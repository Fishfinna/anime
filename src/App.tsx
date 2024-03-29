import { createSignal } from "solid-js";
import { Icon } from "./components/Icon";
import "./App.css";

function App() {
  return (
    <>
      <Icon
        name="emoji_food_beverage"
        style={{ "font-size": "100px", color: "#4e4e4f" }}
      />

      <form>
        <input placeholder="search"></input>
        {/* <Icon name="search" style={{ "font-size": "20px", color: "#717171" }} /> */}
      </form>
    </>
  );
}

export default App;
