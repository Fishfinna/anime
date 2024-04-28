import axios from "axios";

interface Link {
  link: string;
  hls: boolean;
  mp4?: boolean;
  resolutionStr: string;
  priority: number;
  fromCache?: string;
  src?: string;
}

function decode(encoding: string): string {
  const result = encoding
    .replace(/../g, "$&\n")
    .replace(/^01$/gm, "9")
    .replace(/^08$/gm, "0")
    .replace(/^05$/gm, "=")
    .replace(/^0a$/gm, "2")
    .replace(/^0b$/gm, "3")
    .replace(/^0c$/gm, "4")
    .replace(/^07$/gm, "?")
    .replace(/^00$/gm, "8")
    .replace(/^5c$/gm, "d")
    .replace(/^0f$/gm, "7")
    .replace(/^5e$/gm, "f")
    .replace(/^17$/gm, "/")
    .replace(/^54$/gm, "l")
    .replace(/^09$/gm, "1")
    .replace(/^48$/gm, "p")
    .replace(/^4f$/gm, "w")
    .replace(/^0e$/gm, "6")
    .replace(/^5b$/gm, "c")
    .replace(/^5d$/gm, "e")
    .replace(/^0d$/gm, "5")
    .replace(/^53$/gm, "k")
    .replace(/^1e$/gm, "&")
    .replace(/^5a$/gm, "b")
    .replace(/^59$/gm, "a")
    .replace(/^4a$/gm, "r")
    .replace(/^4c$/gm, "t")
    .replace(/^4e$/gm, "v")
    .replace(/^57$/gm, "o")
    .replace(/^51$/gm, "i")
    .replace(/\n/g, "")
    .replace(/\/clock/g, "/clock.json");
  return result;
}

async function extractMp4FromEpisodeLink(episodeLink: string): Promise<url[]> {
  const mp4Links: url[] = [];

  try {
    if (episodeLink.includes("repackager.wixmp.com")) {
      const extractLink = episodeLink.replace(/\.urlset.*/, "");
      const baseUrl = "https://repackager.wixmp.com/";
      const { data } = await axios.get(`${baseUrl}${extractLink}`);

      const lines = data.split("\n");
      lines.forEach((line: string) => {
        if (line.includes(".mp4")) {
          mp4Links.push({ link: `${baseUrl}${line}`, resolution: "unknown" });
        }
      });

      return mp4Links;
    }

    if (
      episodeLink.includes("vipanicdn") ||
      episodeLink.includes("anifastcdn")
    ) {
      if (episodeLink.includes("original.m3u")) {
        mp4Links.push({ link: episodeLink, resolution: "unknown" });
      } else {
        const relativeLink = episodeLink.replace(/[^/]+$/, "");
        try {
          const { data } = await axios.get(episodeLink);
          const lines = data
            .split("\n")
            .filter((line: string) => !line.startsWith("#"))
            .map((line: string) => line.trim())
            .filter((line: string) => line)
            .sort((a: string, b: string) => b.localeCompare(a));
          for (const line of lines) {
            mp4Links.push({ link: `${relativeLink}${line}`, resolution: "" });
          }
        } catch (error) {}
      }
    }
    if (episodeLink.trim()) {
      mp4Links.push({ link: episodeLink, resolution: "unknown" });
    }
  } catch (error) {}

  return mp4Links;
}

export async function convertUrlsToProperLinks(sourceUrls: SourceUrl[]) {
  const baseUrl = "https://allanime.day";

  const promises = sourceUrls.map(async ({ sourceUrl }) => {
    if (sourceUrl.startsWith("--")) {
      sourceUrl = sourceUrl.substring(2);
      sourceUrl = decode(sourceUrl);
    }

    if (sourceUrl.startsWith("/")) {
      sourceUrl = baseUrl + sourceUrl;

      try {
        const { data } = await axios.get(sourceUrl, {
          headers: { "Content-Type": "application/json" },
        });
        const links: url[] = data.links
          .sort((a: Link, b: Link) => a.priority - b.priority)
          .map(
            ({
              link,
              resolutionStr,
            }: {
              link: string;
              resolutionStr: string;
            }) => {
              return { link, resolution: resolutionStr };
            }
          );

        let results: url[] = [];
        for (let { link } of links) {
          results = results.concat(await extractMp4FromEpisodeLink(link));
        }

        return results;
      } catch (error) {}
    }
  });

  const links = await Promise.all(promises);
  return links.flat().filter(Boolean);
}
