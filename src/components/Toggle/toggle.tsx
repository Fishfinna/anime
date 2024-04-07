import { Accessor, Show } from "solid-js";
import "./toggle.scss";

export function Toggle(props: {
  options: string[];
  isChecked: Accessor<boolean>;
  setChecked: (value: boolean) => void;
}) {
  const handleToggle = () => {
    props.setChecked(!props.isChecked());
    console.log(props.isChecked());
  };

  return (
    <label class="toggle-container">
      <input
        type="checkbox"
        checked={props.isChecked()}
        onChange={handleToggle}
        id="toggle"
      />
      <div class="toggle">
        <Show
          when={!props.isChecked()}
          fallback={<span class="option">{props.options![1]}</span>}
        >
          <span class="option">{props.options![0]}</span>
        </Show>
      </div>
    </label>
  );
}
