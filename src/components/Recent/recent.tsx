import { For, useContext } from "solid-js";
import { SettingsContext } from "../../context/settingsContext";

export default function Recent() {
  const { watchLog } = useContext(SettingsContext);

  return (
    <>
      <h3>Recently Watching:</h3>
      {/* <p>{JSON.stringify(watchLog())}</p> */}
      <For each={watchLog()}>{({ title }) => <p>{title.name}</p>}</For>
    </>
  );
}
