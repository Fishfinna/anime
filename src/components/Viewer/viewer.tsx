import { For, Show, createEffect, createSignal, useContext } from "solid-js";
import { Mode } from "../../types/settings";
import { SettingsContext } from "../../context/settingsContext";
import { Toggle } from "../Toggle/toggle";
import { EpisodeVariables, client, episodeQuery } from "../../api";
import "./viewer.scss";
import { convertUrlsToProperLinks } from "../../api/decodeUrl";

export function Viewer() {
  const { mode, currentTitle, setMode } = useContext(SettingsContext);
  const [isDub, setIsDub] = createSignal(false);
  const [lang, setLang] = createSignal<"sub" | "dub">(isDub() ? "dub" : "sub");
  const [lastModified, setLastModified] = createSignal("");
  const [selectedEpisode, setSelectedEpisode] = createSignal<string>("1");
  const [error, setError] = createSignal<string>();
  const [isLoading, setIsLoading] = createSignal<boolean>(false);
  const [urls, setUrls] = createSignal<string[]>([]);
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
      year: "numeric",
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
  createEffect(async () => {
    const episodes = currentTitle()!?.availableEpisodesDetail[lang()].sort(
      (a: any, b: any) => a - b
    );
    if (episodes?.includes(selectedEpisode()) && currentTitle() != undefined) {
      const selectedInfo: EpisodeVariables = {
        showId: currentTitle()?._id || "",
        episodeString: selectedEpisode(),
        translationType: lang(),
      };
      try {
        setIsLoading(true);
        const { query, variables } = episodeQuery(selectedInfo);
        const { data } = await client.query(query, variables).toPromise();
        const properUrls = await convertUrlsToProperLinks(
          data.episode.sourceUrls
        );
        setUrls(properUrls);
        setError("");
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  }, [selectedEpisode, isDub, lang]);

  return (
    <Show when={mode() === Mode.episode}>
      <div class="viewer-container">
        <div class="controls">
          <h1 class="show-title">{currentTitle()?.name}</h1>
          <Show when={error()}>
            <div class="error">{error()}</div>
          </Show>
          <div class="video-container">
            <Show when={!isLoading()} fallback={<div class="loader"></div>}>
              <video
                width="640"
                height="360"
                class="video-display"
                controls
                poster={currentTitle()?.thumbnail}
              >
                <For each={urls()}>{(url) => <source src={url} />}</For>
                Your browser does not support the video tag.
              </video>
            </Show>
          </div>

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
        </div>
        <Show when={currentTitle()?.lastEpisodeTimestamp[lang()]}>
          <footer class="last-modified">
            Last episode posted on <br /> {lastModified()}
          </footer>
        </Show>
      </div>
    </Show>
  );
}
