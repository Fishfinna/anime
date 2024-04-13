import { For, Show, createEffect, createSignal, useContext } from "solid-js";
import { Mode } from "../../types/settings";
import { SettingsContext } from "../../context/settingsContext";
import { Toggle } from "../Toggle/toggle";
import "./viewer.scss";
import Video from "../Video/video";

export function Viewer() {
  const { mode, currentTitle, setMode } = useContext(SettingsContext);
  const [isDub, setIsDub] = createSignal(false);
  const [lang, setLang] = createSignal<"sub" | "dub">(isDub() ? "dub" : "sub");
  const [lastModified, setLastModified] = createSignal("");
  const dateOffset = 1000;

  if (mode() !== Mode.episode || !currentTitle()) {
    setMode(Mode.none);
  }

  createEffect(() => {
    setLang(isDub() ? "dub" : "sub");

    const modifiedDate = new Date(
      currentTitle()!.lastEpisodeTimestamp[lang()] * dateOffset
    );

    const formattedDate = modifiedDate.toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });

    setLastModified(formattedDate);
  }, [isDub, currentTitle]);

  return (
    <Show when={mode() === Mode.episode}>
      {/* <Video qualities={} /> */}
      <h2 class="episode-title">Episodes</h2>
      <Toggle options={["sub", "dub"]} state={isDub} setState={setIsDub} />
      <div class="episode-list">
        <Show
          when={currentTitle()?.availableEpisodesDetail[lang()].length != 0}
          fallback={<p class="error">nothing :{"("}</p>}
        >
          <For
            each={currentTitle()?.availableEpisodesDetail[lang()].sort(
              (a: any, b: any) => a - b
            )}
          >
            {(episode) => <li>{episode}</li>}
          </For>
        </Show>
      </div>
      <Show when={currentTitle()?.lastEpisodeTimestamp[lang()]}>
        <p class="last-modified">Last episode posted on {lastModified()}</p>
      </Show>
    </Show>
  );
}
