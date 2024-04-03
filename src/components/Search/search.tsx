import { Icon } from "../Icons/icon";
import "./search.scss";

export function Search() {
  return (
    <form>
      <button>
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
