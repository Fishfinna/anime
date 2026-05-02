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
  return encoding
    .replace(/../g, "$&\n")
    .replace(/^79$/gm, "A")
    .replace(/^7a$/gm, "B")
    .replace(/^7b$/gm, "C")
    .replace(/^7c$/gm, "D")
    .replace(/^7d$/gm, "E")
    .replace(/^7e$/gm, "F")
    .replace(/^7f$/gm, "G")
    .replace(/^70$/gm, "H")
    .replace(/^71$/gm, "I")
    .replace(/^72$/gm, "J")
    .replace(/^73$/gm, "K")
    .replace(/^74$/gm, "L")
    .replace(/^75$/gm, "M")
    .replace(/^76$/gm, "N")
    .replace(/^77$/gm, "O")
    .replace(/^68$/gm, "P")
    .replace(/^69$/gm, "Q")
    .replace(/^6a$/gm, "R")
    .replace(/^6b$/gm, "S")
    .replace(/^6c$/gm, "T")
    .replace(/^6d$/gm, "U")
    .replace(/^6e$/gm, "V")
    .replace(/^6f$/gm, "W")
    .replace(/^60$/gm, "X")
    .replace(/^61$/gm, "Y")
    .replace(/^62$/gm, "Z")
    .replace(/^59$/gm, "a")
    .replace(/^5a$/gm, "b")
    .replace(/^5b$/gm, "c")
    .replace(/^5c$/gm, "d")
    .replace(/^5d$/gm, "e")
    .replace(/^5e$/gm, "f")
    .replace(/^5f$/gm, "g")
    .replace(/^50$/gm, "h")
    .replace(/^51$/gm, "i")
    .replace(/^52$/gm, "j")
    .replace(/^53$/gm, "k")
    .replace(/^54$/gm, "l")
    .replace(/^55$/gm, "m")
    .replace(/^56$/gm, "n")
    .replace(/^57$/gm, "o")
    .replace(/^48$/gm, "p")
    .replace(/^49$/gm, "q")
    .replace(/^4a$/gm, "r")
    .replace(/^4b$/gm, "s")
    .replace(/^4c$/gm, "t")
    .replace(/^4d$/gm, "u")
    .replace(/^4e$/gm, "v")
    .replace(/^4f$/gm, "w")
    .replace(/^40$/gm, "x")
    .replace(/^41$/gm, "y")
    .replace(/^42$/gm, "z")
    .replace(/^08$/gm, "0")
    .replace(/^09$/gm, "1")
    .replace(/^0a$/gm, "2")
    .replace(/^0b$/gm, "3")
    .replace(/^0c$/gm, "4")
    .replace(/^0d$/gm, "5")
    .replace(/^0e$/gm, "6")
    .replace(/^0f$/gm, "7")
    .replace(/^00$/gm, "8")
    .replace(/^01$/gm, "9")
    .replace(/^15$/gm, "-")
    .replace(/^16$/gm, ".")
    .replace(/^67$/gm, "_")
    .replace(/^46$/gm, "~")
    .replace(/^02$/gm, ":")
    .replace(/^17$/gm, "/")
    .replace(/^07$/gm, "?")
    .replace(/^1b$/gm, "#")
    .replace(/^63$/gm, "[")
    .replace(/^65$/gm, "]")
    .replace(/^78$/gm, "@")
    .replace(/^19$/gm, "!")
    .replace(/^1c$/gm, "$")
    .replace(/^1e$/gm, "&")
    .replace(/^10$/gm, "(")
    .replace(/^11$/gm, ")")
    .replace(/^12$/gm, "*")
    .replace(/^13$/gm, "+")
    .replace(/^14$/gm, ",")
    .replace(/^03$/gm, ";")
    .replace(/^05$/gm, "=")
    .replace(/^1d$/gm, "%")
    .replace(/\n/g, "")
    .replace(/\/clock/g, "/clock.json");
}

async function extractMp4FromEpisodeLink(episodeLink: string): Promise<url[]> {
  const mp4Links: url[] = [];

  try {
    if (episodeLink.includes("repackager.wixmp.com")) {
      const cleanLink = episodeLink.replace(
        /^https?:\/\/repackager\.wixmp\.com\/https?:\/\/repackager\.wixmp\.com\//,
        "https://repackager.wixmp.com/",
      );
      const extractLink = cleanLink.replace(/\.urlset.*/, "");
      try {
        const { data } = await axios.get(extractLink);
        const lines = data.split("\n");
        lines.forEach((line: string) => {
          if (line.includes(".mp4")) {
            mp4Links.push({ link: line.trim(), resolution: "unknown" });
          }
        });
      } catch (error) {}
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

    if (
      episodeLink.trim() &&
      !episodeLink.includes("workfields.maverickki.lol")
    ) {
      mp4Links.push({ link: episodeLink, resolution: "unknown" });
    }
  } catch (error) {}

  return mp4Links;
}

async function resolveSourceUrl(sourceUrl: string): Promise<url[]> {
  if (sourceUrl.startsWith("--")) {
    sourceUrl = sourceUrl.substring(2);
    sourceUrl = decode(sourceUrl);
  }

  // clock.json endpoints 500 from browser, skip them
  if (sourceUrl.includes("clock.json")) return [];

  // fast4speed URLs are direct video links, pass straight to player
  if (sourceUrl.includes("tools.fast4speed.rsvp")) {
    const proxiedUrl = import.meta.env.DEV
      ? sourceUrl.replace("https://tools.fast4speed.rsvp", "/fast4speed")
      : sourceUrl;
    return [{ link: proxiedUrl, resolution: "unknown" }];
  }

  // relative paths go through the allanime proxy
  if (!sourceUrl.startsWith("/")) return [];

  const proxyUrl = import.meta.env.DEV
    ? `/allanime${sourceUrl}`
    : `https://allanime.day${sourceUrl}`;

  try {
    const { data } = await axios.get(proxyUrl, {
      headers: { "Content-Type": "application/json" },
    });

    const links: url[] = data.links
      .sort((a: Link, b: Link) => a.priority - b.priority)
      .map(
        ({ link, resolutionStr }: { link: string; resolutionStr: string }) => ({
          link,
          resolution: resolutionStr,
        }),
      );

    let results: url[] = [];
    for (const { link } of links) {
      results = results.concat(await extractMp4FromEpisodeLink(link));
    }
    return results;
  } catch (error) {
    return [];
  }
}

export async function convertUrlsToProperLinks(
  sourceUrls: SourceUrl[],
): Promise<url[]> {
  const results: url[] = [];

  for (const { sourceUrl } of sourceUrls) {
    try {
      const resolved = await resolveSourceUrl(sourceUrl);
      results.push(...resolved);
    } catch (error) {
      continue;
    }
  }

  return results.filter(Boolean).sort((a: url, b: url) => {
    const aIsM3u8 = a?.link.endsWith("m3u8");
    const bIsM3u8 = b?.link.endsWith("m3u8");
    if (aIsM3u8 && !bIsM3u8) return -1;
    if (!aIsM3u8 && bIsM3u8) return 1;
    return 0;
  });
}

const ALLANIME_KEY = "Xot36i3lK3:v1";

async function getAllanimeKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(ALLANIME_KEY);
  const hashBuffer = await crypto.subtle.digest("SHA-256", keyData);
  return crypto.subtle.importKey(
    "raw",
    hashBuffer,
    { name: "AES-CTR" },
    false,
    ["decrypt"],
  );
}

export async function decodeTobeparsed(
  tobeparsed: string,
): Promise<SourceUrl[]> {
  const binary = Uint8Array.from(atob(tobeparsed), (c) => c.charCodeAt(0));

  const ivBytes = binary.slice(1, 13);
  const ivHex = Array.from(ivBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const counterHex = ivHex + "00000002";
  const counterBlock = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    counterBlock[i] = parseInt(counterHex.slice(i * 2, i * 2 + 2), 16);
  }

  const ctLen = binary.length - 13 - 16;
  const ciphertext = binary.slice(13, 13 + ctLen);

  const key = await getAllanimeKey();
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-CTR", counter: counterBlock, length: 64 },
    key,
    ciphertext,
  );

  const plain = new TextDecoder().decode(decrypted);

  return plain.split(/[{}]/).flatMap((chunk) => {
    const urlMatch = chunk.match(/"sourceUrl":"--([^"]+)"/);
    const nameMatch = chunk.match(/"sourceName":"([^"]+)"/);
    if (urlMatch && nameMatch) {
      return [
        {
          sourceUrl: "--" + urlMatch[1],
          sourceName: nameMatch[1],
          priority: 0,
          type: "",
          className: "",
          streamerId: "",
        } as SourceUrl,
      ];
    }
    return [];
  });
}
