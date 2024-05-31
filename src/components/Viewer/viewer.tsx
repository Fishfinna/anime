import {
  For,
  Show,
  createEffect,
  createSignal,
  onMount,
  useContext,
} from "solid-js";
import { Mode } from "../../types/settings";
import { SettingsContext } from "../../context/settingsContext";
import { Toggle } from "../Toggle/toggle";
import { EpisodeVariables, client, episodeQuery } from "../../api";
import "./viewer.scss";
import { convertUrlsToProperLinks } from "../../api/decodeUrl";
import { Video } from "../Video/video";
import { getShow } from "../../api";

async function getUrls(episodeVariables: EpisodeVariables) {
  const { query, variables } = episodeQuery(episodeVariables);
  const { data } = await client.query(query, variables).toPromise();
  if (!data.episode?.sourceUrls) {
    throw new Error("No episodes found, please try another translation type.");
  }
  return await convertUrlsToProperLinks(data.episode.sourceUrls);
}

export function Viewer(param: { showId?: string }) {
  const {
    mode,
    setMode,
    currentTitle,
    setCurrentTitle,
    isDub,
    setIsDub,
    episodeNumber,
    setEpisodeNumber,
  } = useContext(SettingsContext);
  const [lang, setLang] = createSignal<"sub" | "dub">(isDub() ? "dub" : "sub");
  const [lastModified, setLastModified] = createSignal("");
  const [error, setError] = createSignal<string>();
  const [isLoading, setIsLoading] = createSignal<boolean>(false);
  const [urls, setUrls] = createSignal<url[]>([]);
  const dateOffset = 1000;

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
    if (!episodeNumber() && episodes) {
      setEpisodeNumber(
        currentTitle()!?.availableEpisodesDetail[lang()].sort(
          (a: any, b: any) => a - b
        )[0]
      );
    }
    if (episodes) {
      const maxEpisodeNumber = Number(episodes[episodes?.length - 1]);
      if (Number(episodeNumber()) > maxEpisodeNumber) {
        setEpisodeNumber("1");
      }
    }

    return () => {};
  }, [isDub]);

  // request for episode sources
  createEffect(async () => {
    setIsLoading(true);
    setError("");
    const selectedInfo: EpisodeVariables = {
      showId: currentTitle()?._id || "",
      episodeString: episodeNumber() || "1",
      translationType: lang(),
    };
    try {
      setUrls(await getUrls(selectedInfo));
      setError("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [episodeNumber, isDub, lang]);

  // reload the content when the page reloads
  onMount(async () => {
    if (param.showId || currentTitle()?._id) {
      let showId: string;
      if (param.showId) {
        showId = param.showId;
      } else {
        showId = currentTitle()?._id as string;
      }
      setMode(Mode.episode);
      setIsLoading(true);
      try {
        const { query, variables } = getShow(showId);
        const { data: response } = await client
          .query(query, variables)
          .toPromise();
        const showData = response.show;
        if (!showData) {
          throw new Error("No search results.");
        }
        setCurrentTitle(showData);
        setUrls(
          await getUrls({
            showId: currentTitle()?._id || "",
            episodeString: episodeNumber() || "1",
            translationType: lang(),
          })
        );
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (!currentTitle()) {
      setMode(Mode.none);
    }
  });

  return (
    <Show when={mode() === Mode.episode}>
      <div class="viewer-container">
        <div class="controls">
          <h1 class="show-title">
            {currentTitle()?.englishName || currentTitle()?.name}
          </h1>
          <div class="video-container">
            <Show when={!error()} fallback={<div class="error">{error()}</div>}>
              <Show when={!isLoading()} fallback={<div class="loader"></div>}>
                <Video poster={currentTitle()?.thumbnail} urls={urls} />
              </Show>
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
                    class={episodeNumber() == episode ? "selected" : ""}
                    onClick={() => setEpisodeNumber(episode)}
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
