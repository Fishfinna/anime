import { For, useContext } from "solid-js";
import { SettingsContext } from "../../context/settingsContext";

export default function Recent() {
  const { watchLog } = useContext(SettingsContext);

  return (
    <>
      <h3>Recently Watching:</h3>
      <For each={watchLog()}>
        {({ title, episodeNumber, timestamp }) => (
          <p>
            {title.name} <b>ep.{episodeNumber}</b>
            <b>
              timestamp: {Math.floor((timestamp || 0) / 60)}:
              {String(Math.floor((timestamp || 0) % 60)).padStart(2, "0")}
            </b>
          </p>
        )}
      </For>
    </>
  );
}
