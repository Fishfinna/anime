import { Icon } from "../Icons/icon";
import { Show, createSignal } from "solid-js";
import { createEffect } from "solid-js";
import "./settings.scss";
import { Toggle } from "../Toggle/toggle";

export function Settings() {
  const [menuVisible, setMenuVisible] = createSignal(false);
  const [isClicked, setIsClicked] = createSignal(false);
  const [isSub, setIsSub] = createSignal(false);
  const translationOptions = ["dub", "sub"];

  function handleButtonClick() {
    setMenuVisible(!menuVisible());
    setIsClicked(true);
  }

  createEffect(() => {
    if (isClicked()) {
      setTimeout(() => setIsClicked(false), 300);
    }
  });

  return (
    <div class="settings-container">
      <button
        onClick={handleButtonClick}
        classList={{ "settings-button": true, bounce: isClicked() }}
      >
        <Icon name="settings" style={{ color: "#4e4e4f" }}></Icon>
      </button>
      <Show when={menuVisible()}>
        <div classList={{ menu: true, fade: isClicked() }}>
          <Toggle
            options={translationOptions}
            isChecked={isSub}
            setChecked={setIsSub}
          />
        </div>
      </Show>
    </div>
  );
}
