import { Icon } from "../Icons/icon";
import "./search.scss";

export function Search() {
  return (
    <form>
      <input placeholder="search"></input>
      <button>
        <Icon name="search" style={{ "font-size": "20px", color: "#717171" }} />
      </button>
    </form>
  );
}
