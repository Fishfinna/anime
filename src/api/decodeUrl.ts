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

// mirrors ani-cli get_links() for wixmp/repackager URLs
async function handleWixmp(episodeLink: string): Promise<url[]> {
  // extract the video ID and resolutions from the urlset format
  // e.g. repackager.wixmp.com/video.wixstatic.com/video/ID/,1080p,720p,480p,/mp4/file.mp4
  const idMatch = episodeLink.match(/video\/([^/]+)\/,([^/]+),\/mp4/);
  if (!idMatch) return [];

  const videoId = idMatch[1];
  const resolutions = idMatch[2].split(",").filter(Boolean);

  return resolutions.map((res) => {
    const fullUrl = `https://video.wixstatic.com/video/${videoId}/${res}/mp4/file.mp4`;
    const link = import.meta.env.DEV
      ? `/wixstatic/video/${videoId}/${res}/mp4/file.mp4`
      : fullUrl;
    return { link, resolution: res };
  });
}

// mirrors ani-cli get_links() for m3u8 URLs
async function handleM3u8(
  episodeLink: string,
  referer?: string,
): Promise<url[]> {
  const results: url[] = [];
  try {
    const headers: Record<string, string> = {};
    if (referer) headers["Referer"] = referer;

    const { data } = await axios.get(episodeLink, { headers });

    if (!data.includes("#EXTM3U"))
      return [{ link: episodeLink, resolution: "unknown" }];

    const lines = data.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith("#EXT-X-STREAM-INF")) {
        // extract resolution
        const resMatch = line.match(/RESOLUTION=\d+x(\d+)/);
        const res = resMatch ? `${resMatch[1]}p` : "unknown";
        const urlLine = lines[i + 1]?.trim();
        if (urlLine && !urlLine.startsWith("#")) {
          const baseUrl = episodeLink.replace(/[^/]+$/, "");
          const fullUrl = urlLine.startsWith("http")
            ? urlLine
            : `${baseUrl}${urlLine}`;
          results.push({ link: fullUrl, resolution: res });
        }
      }
    }
  } catch (err) {
    // if we can't fetch m3u8, just pass the URL directly
    results.push({ link: episodeLink, resolution: "unknown" });
  }

  return results.length
    ? results
    : [{ link: episodeLink, resolution: "unknown" }];
}

// mirrors ani-cli get_links() for vipanicdn/anifastcdn
async function handleVipani(episodeLink: string): Promise<url[]> {
  if (episodeLink.includes("original.m3u")) {
    return [{ link: episodeLink, resolution: "unknown" }];
  }

  const relativeLink = episodeLink.replace(/[^/]+$/, "");
  try {
    const { data } = await axios.get(episodeLink);
    const lines = data
      .split("\n")
      .filter((l: string) => !l.startsWith("#"))
      .map((l: string) => l.trim())
      .filter((l: string) => l)
      .sort((a: string, b: string) => b.localeCompare(a));

    return lines.map((line: string) => ({
      link: `${relativeLink}${line}`,
      resolution: "",
    }));
  } catch {
    return [{ link: episodeLink, resolution: "unknown" }];
  }
}

// mirrors ani-cli get_links() - processes a single video link
async function processEpisodeLink(
  link: string,
  referer?: string,
): Promise<url[]> {
  if (link.includes("repackager.wixmp.com")) {
    return handleWixmp(link);
  }
  if (link.includes("vipanicdn") || link.includes("anifastcdn")) {
    return handleVipani(link);
  }
  if (link.includes("master.m3u8") || link.endsWith(".m3u8")) {
    return handleM3u8(link, referer);
  }
  if (link.includes("workfields.maverickki.lol")) {
    return [];
  }
  return [{ link, resolution: "unknown" }];
}

const PROXY = "https://heavy-eel-56.fishfinna.deno.net";

// mirrors ani-cli generate_link() + get_links()
async function resolveSourceUrl(sourceUrl: string): Promise<url[]> {
  if (sourceUrl.startsWith("--")) {
    sourceUrl = sourceUrl.substring(2);
    sourceUrl = decode(sourceUrl);
  }

  console.log("resolving:", sourceUrl);

  // fast4speed - ani-cli passes these directly to mpv with allanime referer
  if (sourceUrl.includes("tools.fast4speed.rsvp")) {
    const fetchUrl = import.meta.env.DEV
      ? sourceUrl.replace("https://tools.fast4speed.rsvp", "/fast4speed")
      : `${PROXY}?url=${encodeURIComponent(sourceUrl)}`;
    return [{ link: fetchUrl, resolution: "unknown" }];
  }

  if (!sourceUrl.startsWith("/")) return [];

  // fetch from allanime CDN - mirrors ani-cli's curl call with allanime_refr
  const proxyUrl = import.meta.env.DEV
    ? `/allanime${sourceUrl}`
    : `${PROXY}?url=${encodeURIComponent(`https://allanime.day${sourceUrl}`)}`;

  try {
    const { data } = await axios.get(proxyUrl, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("allanime response:", JSON.stringify(data));

    if (!data?.links?.length) return [];

    // filter out links with no URL - mirrors ani-cli skipping empty providers
    const validLinks = data.links.filter((l: Link) => l.link && l.link.trim());
    if (!validLinks.length) {
      console.log("no valid links in response");
      return [];
    }

    // get referer if present in response (for m3u8 streams)
    const referer = data.links.find((l: Link) => l.src)?.src;

    const results: url[] = [];
    for (const { link } of validLinks) {
      const processed = await processEpisodeLink(link, referer);
      results.push(...processed);
    }
    return results;
  } catch (error: any) {
    console.log("allanime fetch error:", error.message);
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

  const final = results.filter(Boolean).sort((a: url, b: url) => {
    const aIsM3u8 = a?.link.endsWith("m3u8");
    const bIsM3u8 = b?.link.endsWith("m3u8");
    if (aIsM3u8 && !bIsM3u8) return -1;
    if (!aIsM3u8 && bIsM3u8) return 1;
    return 0;
  });

  console.log("Final URLs going to player:", final);
  return final;
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
