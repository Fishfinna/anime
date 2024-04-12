import { Show, createSignal, useContext } from "solid-js";
import { Mode } from "../../types/settings";
import { SettingsContext } from "../../context/settingsContext";
import { Toggle } from "../Toggle/toggle";

export function Viewer() {
  const { mode } = useContext(SettingsContext);
  const [isDub, setIsDub] = createSignal(false);

  return (
    <Show when={mode() == Mode.episode}>
      <Toggle options={["sub", "dub"]} state={isDub} setState={setIsDub} />
    </Show>
  );
}
