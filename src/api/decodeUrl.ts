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
    const result = encoding.replace(/../g, '$&\n')
                       .replace(/^01$/gm, '9')
                       .replace(/^08$/gm, '0')
                       .replace(/^05$/gm, '=')
                       .replace(/^0a$/gm, '2')
                       .replace(/^0b$/gm, '3')
                       .replace(/^0c$/gm, '4')
                       .replace(/^07$/gm, '?')
                       .replace(/^00$/gm, '8')
                       .replace(/^5c$/gm, 'd')
                       .replace(/^0f$/gm, '7')
                       .replace(/^5e$/gm, 'f')
                       .replace(/^17$/gm, '/')
                       .replace(/^54$/gm, 'l')
                       .replace(/^09$/gm, '1')
                       .replace(/^48$/gm, 'p')
                       .replace(/^4f$/gm, 'w')
                       .replace(/^0e$/gm, '6')
                       .replace(/^5b$/gm, 'c')
                       .replace(/^5d$/gm, 'e')
                       .replace(/^0d$/gm, '5')
                       .replace(/^53$/gm, 'k')
                       .replace(/^1e$/gm, '&')
                       .replace(/^5a$/gm, 'b')
                       .replace(/^59$/gm, 'a')
                       .replace(/^4a$/gm, 'r')
                       .replace(/^4c$/gm, 't')
                       .replace(/^4e$/gm, 'v')
                       .replace(/^57$/gm, 'o')
                       .replace(/^51$/gm, 'i')
                       .replace(/\n/g, '')
                       .replace(/\/clock/g, '/clock.json');      
    return result;
}

export async function convertUrlsToProperLinks(sourceUrls: SourceUrl[]) {
    const baseUrl = "https://allanime.day";

    const promises = sourceUrls.map(async ({ sourceUrl }) => {
        if (sourceUrl.startsWith("--")) {
            sourceUrl = sourceUrl.substring(2);
            sourceUrl = decode(sourceUrl);
            if (sourceUrl.startsWith("/")) {
                sourceUrl = baseUrl + sourceUrl

            try {
                const { data } = await axios.get(sourceUrl, { headers: { 'Content-Type': "application/json" } });
                const links = data.links.sort((a: Link, b: Link) => a.priority - b.priority).map(({ link }: { link: string }) => link);
                return links;
            } catch (error) {}
            } 
        }
    });

    const results = await Promise.all(promises);
    return results.flat().filter(Boolean);
}
