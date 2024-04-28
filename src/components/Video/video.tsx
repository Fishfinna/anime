import { onMount, onCleanup, Accessor } from "solid-js";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./video.scss";

interface VideoProps {
  poster?: string;
  urls: Accessor<{ link: string }[]>;
}

export function Video({ poster, urls }: VideoProps) {
  let videoRef: HTMLVideoElement | null = null;
  let player: videojs.Player | null = null;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!player) return;

    e.preventDefault();
    switch (e.key) {
      case " ":
        player.paused() ? player.play() : player.pause();
        break;
      case "f":
        player.isFullscreen()
          ? player.exitFullscreen()
          : player.requestFullscreen();
        break;
      case "esc":
        player.exitFullscreen();
        break;
      case "ArrowUp":
        player.volume(Math.min(player.volume() + 0.1, 1));
        break;
      case "ArrowDown":
        player.volume(Math.max(player.volume() - 0.1, 0));
        break;
      case "ArrowRight":
        player.currentTime(player.currentTime() + 10);
        break;
      case "ArrowLeft":
        player.currentTime(player.currentTime() - 10);
        break;
      case "m":
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

    if (urls()) {
      const sources = urls().map((url) => ({
        type: "application/x-mpegURL",
        src: url.link,
      }));
      player.src(sources);
    }
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
      class="video-js video-display dark-theme"
    >
      Your browser does not support the video tag.
    </video>
  );
}
