import { onMount, onCleanup, Accessor, For } from "solid-js";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./video.scss";

interface VideoProps {
  poster?: string;
  urls: Accessor<{ link: string }[]>;
  timestamp?: Accessor<number>;
  setTimestamp: (arg: number) => void;
}

export function Video({ poster, urls, timestamp, setTimestamp }: VideoProps) {
  let videoRef: HTMLVideoElement | null = null;
  let player: any | null = null;

  const isFocusableElement = (element: Element | null): boolean => {
    if (!element) return false;
    const focusableElements = ["INPUT", "TEXTAREA", "SELECT", "BUTTON"];
    return (
      focusableElements.includes(element.tagName) ||
      element.getAttribute("contenteditable") === "true"
    );
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!player) return;

    const activeElement = document.activeElement;
    if (activeElement && isFocusableElement(activeElement)) {
      return;
    }
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
      case "Escape":
        e.preventDefault();
        if (player.isFullscreen()) player.exitFullscreen();
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
      default:
        break;
    }
  };

  onMount(() => {
    if (!videoRef) return;
    var overrideNative = true;

    player = videojs(videoRef, {
      html5: {
        hls: {
          overrideNative,
        },
        nativeVideoTracks: !overrideNative,
        nativeAudioTracks: !overrideNative,
        nativeTextTracks: !overrideNative,
      },
      playsinline: true,
      controls: true,
      preload: "auto",
      width: 800,
      height: 450,
    });

    // player.currentTime(timestamp ? timestamp() : 0);

    document.addEventListener("keydown", handleKeyDown);
    onCleanup(() => {
      if (player.currentTime() > 5) {
        let shutOffTime = player.currentTime() - 5;
        shutOffTime = parseFloat(shutOffTime.toFixed(2));
        setTimestamp(shutOffTime);
        console.log("here");
      }
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
      class="video-js vjs-theme-city"
    >
      <For each={urls()}>
        {(url) => (
          <source
            src={url.link}
            type={
              url.link.endsWith(".m3u8") ? "application/x-mpegURL" : "video/mp4"
            }
          />
        )}
      </For>
      Your browser does not support the video tag.
    </video>
  );
}
