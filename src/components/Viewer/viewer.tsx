import { For, Show, createEffect, createSignal, useContext } from "solid-js";
import { Mode } from "../../types/settings";
import { SettingsContext } from "../../context/settingsContext";
import { Toggle } from "../Toggle/toggle";
import Video from "../Video/video";
import "./viewer.scss";

export function Viewer() {
  const { mode, currentTitle, setMode } = useContext(SettingsContext);
  const [isDub, setIsDub] = createSignal(false);
  const [lang, setLang] = createSignal<"sub" | "dub">(isDub() ? "dub" : "sub");
  const [lastModified, setLastModified] = createSignal("");
  const [selectedEpisode, setSelectedEpisode] = createSignal<string>("1");
  const dateOffset = 1000;

  if (mode() !== Mode.episode || !currentTitle()) {
    setMode(Mode.none);
  }

  // handle date modified
  createEffect(() => {
    setLang(isDub() ? "dub" : "sub");

    const modifiedDate = new Date(
      currentTitle()!?.lastEpisodeTimestamp[lang()] * dateOffset
    );

    const formattedDate = modifiedDate.toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });

    setLastModified(formattedDate);
    return () => {};
  }, [isDub, currentTitle]);

  // handle the episode number
  createEffect(() => {
    const episodes = currentTitle()!?.availableEpisodesDetail[lang()].sort(
      (a: any, b: any) => a - b
    );
    if (episodes) {
      const maxEpisodeNumber = Number(episodes[episodes?.length - 1]);
      if (Number(selectedEpisode()) > maxEpisodeNumber) {
        setSelectedEpisode(String(1));
      }
    }

    return () => {};
  }, [isDub]);

  // request for episode sources
  createEffect(() => {
    const episodes = currentTitle()!?.availableEpisodesDetail[lang()].sort(
      (a: any, b: any) => a - b
    );

    if (episodes?.includes(selectedEpisode())) {
      console.log(
        "desired episode",
        selectedEpisode(),
        currentTitle()?._id,
        lang()
      );
    }

    return () => {};
  }, [selectedEpisode]);

  return (
    <Show when={mode() === Mode.episode}>
      {/* <Video qualities={{}} /> */}
      <div>{selectedEpisode()}</div>

      <h2 class="episode-header">Episodes</h2>
      <Toggle options={["sub", "dub"]} state={isDub} setState={setIsDub} />
      <ul class="episode-list">
        <Show
          when={currentTitle()?.availableEpisodesDetail[lang()].length != 0}
          fallback={<p class="error">nothing :{"("}</p>}
        >
          <For
            each={currentTitle()?.availableEpisodesDetail[lang()].sort(
              (a: any, b: any) => a - b
            )}
          >
            {(episode) => (
              <li
                class={selectedEpisode() == episode ? "selected" : ""}
                onClick={() => setSelectedEpisode(episode)}
              >
                {episode}
              </li>
            )}
          </For>
        </Show>
      </ul>
      <Show when={currentTitle()?.lastEpisodeTimestamp[lang()]}>
        <p class="last-modified">Last episode posted on {lastModified()}</p>
      </Show>
    </Show>
  );
}
