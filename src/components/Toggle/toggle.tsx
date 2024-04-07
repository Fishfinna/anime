import { createSignal, Show } from "solid-js";
import "./toggle.scss";

export function Toggle(props: { options?: string[] }) {
  const [isChecked, setIsChecked] = createSignal(false);

  const handleToggle = () => {
    setIsChecked(!isChecked());
  };

  return (
    <Show when={props.options}>
      <div class="toggle-container">
        <input
          type="checkbox"
          checked={isChecked()}
          onChange={handleToggle}
          id="toggle"
        />
        <label for="toggle" class="toggle">
          <Show
            when={!isChecked()}
            fallback={<span class="option">{props.options![1]}</span>}
          >
            <span class="option">{props.options![0]}</span>
          </Show>
        </label>
      </div>
    </Show>
  );
}
