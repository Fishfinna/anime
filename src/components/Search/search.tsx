import { Icon } from "../Icons/icon";
import "./search.scss";

export function Search(setTitles) {
  return (
    <form class="search">
      <button class="search-btn">
        <Icon
          name="search"
          style={{
            "font-size": "20px",
            color: "#4e4e4f",
            "vertical-align": "bottom",
          }}
        />
      </button>
      <input placeholder="search"></input>
    </form>
  );
}
