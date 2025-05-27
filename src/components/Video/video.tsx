import { onMount, onCleanup, Accessor, For, createEffect, on } from "solid-js";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./video.scss";

interface VideoProps {
  poster?: string;
  urls: Accessor<{ link: string }[]>;
  timestamp?: Accessor<number | undefined>;
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

  const updateTimestamp = () => {
    setTimestamp(player.currentTime().toFixed(2));
  };

  onMount(() => {
    if (!videoRef) return;

    const overrideNative = true;

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
      fluid: true,
      aspectRatio: "16:9",
    });

    let firstPlay = true;
    let timestampSet = false;

    player.ready(() => {
      player.one("canplay", () => {
        const ts = timestamp?.();
        if (ts && !isNaN(ts) && ts > 0 && !timestampSet) {
          player.currentTime(ts);
          timestampSet = true;
        }
      });

      player.one("loadeddata", () => {
        setTimeout(() => {
          const ts = timestamp?.();
          if (ts && !isNaN(ts) && ts > 0 && !timestampSet) {
            player.currentTime(ts);
            timestampSet = true;
          }
        }, 500);
      });
    });

    player.on("play", () => {
      if (firstPlay) {
        firstPlay = false;
        const ts = timestamp?.();
        if (ts && !isNaN(ts) && ts > 0 && !timestampSet) {
          console.log("On first play: Setting timestamp to:", ts);
          player.currentTime(ts);
          timestampSet = true;
        }
      }
    });

    const saveInterval = setInterval(() => {
      if (player && !player.paused()) {
        updateTimestamp();
      }
    }, 10000);

    const updateOn = ["play", "pause", "seeked"];
    updateOn.forEach((action) => {
      player.on(action, () => {
        updateTimestamp();
      });
    });

    document.addEventListener("keydown", handleKeyDown);

    onCleanup(() => {
      document.removeEventListener("keydown", handleKeyDown);
      clearInterval(saveInterval);
      if (player) {
        player.dispose();
      }
    });
  });

  createEffect(() => {
    if (player && player.readyState() >= 2) {
      const ts = timestamp?.();
      if (ts && !isNaN(ts) && ts > 0) {
        const currentTime = player.currentTime();
        if (Math.abs(currentTime - ts) > 5) {
          player.currentTime(ts);
        }
      }
    }
  });

  return (
    <video
      ref={(el) => (videoRef = el)}
      poster={poster}
      class="video-js vjs-fluid vjs-theme-city"
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
