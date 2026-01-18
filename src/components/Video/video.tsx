import { onMount, onCleanup, Accessor, For, createEffect } from "solid-js";
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

  const isTouch = window.matchMedia(
    "(hover: none) and (pointer: coarse)",
  ).matches;

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
    if (activeElement && isFocusableElement(activeElement)) return;

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
      case "Tab":
        e.preventDefault();
        const controlBar = player.getChild("controlBar");
        const playButton = controlBar?.getChild("playToggle");
        if (document.activeElement === videoRef) {
          (playButton?.el() as HTMLElement)?.focus();
        } else {
          (videoRef as HTMLElement)?.focus();
        }
        break;
      default:
        break;
    }
  };

  const updateTimestamp = () => {
    if (player) setTimestamp(Number(player.currentTime().toFixed(2)));
  };

  onMount(() => {
    if (!videoRef) return;

    const overrideNative = true;

    player = videojs(videoRef, {
      html5: {
        hls: { overrideNative },
        nativeVideoTracks: !overrideNative,
        nativeAudioTracks: !overrideNative,
        nativeTextTracks: !overrideNative,
      },
      playsinline: true,
      controls: true,
      preload: "auto",
      fluid: true,
      aspectRatio: "16:9",
      inactivityTimeout: isTouch ? 2000 : 0,
      controlBar: {
        volumePanel: !isTouch,
        pictureInPictureToggle: !isTouch,
        fullscreenToggle: true,
      },
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
          player.currentTime(ts);
          timestampSet = true;
        }
      }
    });

    const saveInterval = setInterval(() => {
      if (player && !player.paused()) updateTimestamp();
    }, 10000);

    ["play", "pause", "seeked"].forEach((action) =>
      player.on(action, updateTimestamp),
    );

    document.addEventListener("keydown", handleKeyDown);

    if (isTouch) {
      let lastTap = 0;
      const DOUBLE_TAP_DELAY = 300;

      player.el().addEventListener("touchend", (e: TouchEvent) => {
        const now = Date.now();
        const delta = now - lastTap;
        lastTap = now;

        const touch = e.changedTouches[0];
        const rect = videoRef!.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const third = rect.width / 3;

        // Single tap or double tap: tell Video.js user is active so controls show
        player.userActive(true);

        if (delta < DOUBLE_TAP_DELAY) {
          // Double tap → seek
          if (x < third)
            player.currentTime(Math.max(player.currentTime() - 10, 0));
          else if (x > third * 2)
            player.currentTime(
              Math.min(player.currentTime() + 10, player.duration()),
            );
        } else {
          // Single tap → toggle play/pause
          if (player.paused()) player.play();
          else player.pause();

          // Ensure controls show after play/pause
          player.userActive(true);
        }
      });
    }

    onCleanup(() => {
      document.removeEventListener("keydown", handleKeyDown);
      clearInterval(saveInterval);
      if (player) player.dispose();
    });
  });

  createEffect(() => {
    if (player && player.readyState() >= 2) {
      const ts = timestamp?.();
      if (ts && !isNaN(ts) && ts > 0) {
        const currentTime = player.currentTime();
        if (Math.abs(currentTime - ts) > 5) player.currentTime(ts);
      }
    }
  });

  return (
    <video
      ref={(el) => (videoRef = el)}
      poster={poster}
      class="video-js vjs-fluid vjs-theme-city"
      tabIndex={0}
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
