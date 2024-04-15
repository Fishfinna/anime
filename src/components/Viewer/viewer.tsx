import { For, Show, createEffect, createSignal, useContext } from "solid-js";
import { Mode } from "../../types/settings";
import { SettingsContext } from "../../context/settingsContext";
import { Toggle } from "../Toggle/toggle";
import { EpisodeVariables, client, episodeQuery } from "../../api";
import "./viewer.scss";

function convertUrlsToProperLinks(sourceUrls: SourceUrl[]) {
  return sourceUrls.map(({ sourceUrl }) => {
    const bytes: number[] = [];
    for (let i = 0; i < sourceUrl.length; i += 2) {
      bytes.push(parseInt(sourceUrl.substring(i, i + 2), 16));
    }
    const decodedUrl = String.fromCharCode(...bytes);
    console.log({ decodedUrl, sourceUrl });
    return decodedUrl;
  });
}

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
    });

    setLastModified(formattedDate);
    return () => {};
  }, [isDub, currentTitle]);

  // handle the episode number
  createEffect(() => {
    console.log("switched to mode:", lang());
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
    console.log("trigger episode request");
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
        const properUrls = convertUrlsToProperLinks(data.episode.sourceUrls);
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
      <Show when={error()}>
        <div class="error">{error()}</div>
      </Show>
      <Show when={!isLoading()} fallback={<div class="loader"></div>}>
        <video controls>
          <For each={urls()}>{(url) => <source src={url} />}</For>
          Your browser does not support the video tag.
        </video>
      </Show>

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
