import { Accessor, For } from "solid-js";
import "./video.scss";

export function Video(props: {
  poster: string | undefined;
  urls: Accessor<string[]>;
}) {
  return (
    <>
      <video
        width="800"
        height="450"
        class="video-display"
        controls
        poster={props.poster}
      >
        <For each={props.urls()}>{(url) => <source src={url} />}</For>
        Your browser does not support the video tag.
      </video>
    </>
  );
}
