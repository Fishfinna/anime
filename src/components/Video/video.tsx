import { onMount, onCleanup, Accessor, For } from "solid-js";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./video.scss";

interface VideoProps {
  poster?: string;
  urls: Accessor<{ link: string }[]>;
}

export function Video({ poster, urls }: VideoProps) {
  let videoRef: HTMLVideoElement | null = null;
  let player: typeof videojs.players | null = null;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!player) return;
    switch (e.key) {
      case " ":
        e.preventDefault();
        player.paused() ? player.play() : player.pause();
        break;
      case "f":
        e.preventDefault();
        player.isFullscreen()
          ? player.exitFullscreen()
          : player.requestFullscreen();
        break;
      case "esc":
        e.preventDefault();
        player.isFullscreen()
          ? player.exitFullscreen()
          : player.requestFullscreen();
        break;
      case "ArrowUp":
        e.preventDefault();
        player.volume(Math.min(player.volume() + 0.1, 1));
        break;
      case "ArrowDown":
        e.preventDefault();
        player.volume(Math.max(player.volume() - 0.1, 0));
        break;
      case "ArrowRight":
        e.preventDefault();
        player.currentTime(player.currentTime() + 10);
        break;
      case "ArrowLeft":
        e.preventDefault();
        player.currentTime(player.currentTime() - 10);
        break;
      case "m":
        e.preventDefault();
        player.muted(!player.muted());
        break;
    }
  };

  onMount(() => {
    if (!videoRef) return;

    player = videojs(videoRef, {
      controls: true,
      preload: "auto",
      width: 800,
      height: 450,
    });
    document.addEventListener("keydown", handleKeyDown);

    onCleanup(() => {
      document.removeEventListener("keydown", handleKeyDown);
      if (player) {
        player.dispose();
      }
    });
  });

  return (
    <video
      ref={(el) => (videoRef = el)}
      poster={poster}
      class="video-js  vjs-theme-city"
    >
      <For each={urls()}>
        {(url) => (
          <source
            src={url.link}
            type={
              url.link.endsWith("m3u8") ? "application/x-mpegURL" : undefined
            }
          ></source>
        )}
      </For>
      Your browser does not support the video tag.
    </video>
  );
}
