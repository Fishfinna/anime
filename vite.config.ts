import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  base: "/anime",
  plugins: [solid()],
  server: {
    proxy: {
      "/api": {
        target: "https://api.allanime.day",
        changeOrigin: true,
        headers: {
          Referer: "https://youtu-chan.com",
          Origin: "https://youtu-chan.com",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0",
        },
      },
      "/allanime": {
        target: "https://allanime.day",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/allanime/, ""),
        headers: {
          Referer: "https://allmanga.to",
          Origin: "https://allmanga.to",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0",
        },
      },
      "/fast4speed": {
        target: "https://tools.fast4speed.rsvp",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/fast4speed/, ""),
        headers: {
          Referer: "https://allanime.to",
          Origin: "https://allanime.to",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0",
        },
      },
      "/wixmp": {
        target: "https://repackager.wixmp.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/wixmp/, ""),
        headers: {
          Referer: "https://allmanga.to",
          Origin: "https://allmanga.to",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0",
        },
      },
      "/wixstatic": {
        target: "https://video.wixstatic.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/wixstatic/, ""),
        headers: {
          Referer: "https://allmanga.to",
          Origin: "https://allmanga.to",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0",
        },
      },
    },
  },
});
