import { Accessor } from "solid-js";
import "./toggle.scss";

export function Toggle(props: {
  options: string[];
  state: Accessor<boolean>;
  setState: (arg0: boolean) => void;
}) {
  const handleToggle = () => {
    props.setState(!props.state());
  };

  return (
    <label class="toggle-container">
      <input
        type="checkbox"
        checked={props.state()}
        onChange={handleToggle}
        id="toggle"
      />
      <div class="toggle">
        <span class="option">
          {props.state() ? props.options![0] : props.options![1]}
        </span>
      </div>
    </label>
  );
}
