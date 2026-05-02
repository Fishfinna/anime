import { gql } from "@urql/core";
import { decodeTobeparsed } from "./decodeUrl";

const defaultLimit = 6;

export interface EpisodeVariables {
  showId: string;
  episodeString: string;
  translationType: string;
}

export interface SourceUrl {
  sourceUrl: string;
  priority: number;
  sourceName: string;
  type: string;
  className: string;
  streamerId: string;
  sandbox?: string;
  downloads?: {
    sourceName: string;
    downloadUrl: string;
  };
}

const AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0";
const ALLANIME_API = import.meta.env.DEV
  ? "/api"
  : "https://api.allanime.day/api";
const EPISODE_QUERY_HASH =
  "d405d0edd690624b66baba3068e0edc3ac90f1597d898a1ec8db4e5c43c00fec";

export async function fetchEpisodeUrls(
  episodeVariables: EpisodeVariables,
): Promise<SourceUrl[]> {
  const variables = JSON.stringify({
    showId: episodeVariables.showId,
    translationType: episodeVariables.translationType,
    episodeString: episodeVariables.episodeString,
  });

  const extensions = JSON.stringify({
    persistedQuery: { version: 1, sha256Hash: EPISODE_QUERY_HASH },
  });

  const params = new URLSearchParams({ variables, extensions });
  const response = await fetch(`${ALLANIME_API}?${params}`, {
    headers: {
      "User-Agent": AGENT,
      Referer: "https://youtu-chan.com",
      Origin: "https://youtu-chan.com",
    },
  });

  const json = await response.json();

  if (json?.data?.tobeparsed) {
    return await decodeTobeparsed(json.data.tobeparsed);
  }

  if (json?.data?.episode?.sourceUrls?.length) {
    return json.data.episode.sourceUrls as SourceUrl[];
  }

  // fallback POST
  const fallback = await fetch(ALLANIME_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": AGENT,
      Referer: "https://allmanga.to",
      Origin: "https://allmanga.to",
    },
    body: JSON.stringify({
      variables: {
        showId: episodeVariables.showId,
        translationType: episodeVariables.translationType,
        episodeString: episodeVariables.episodeString,
      },
      query: `query ($showId: String!, $translationType: VaildTranslationTypeEnumType!, $episodeString: String!) {
        episode(showId: $showId translationType: $translationType episodeString: $episodeString) {
          episodeString sourceUrls
        }
      }`,
    }),
  });

  const fallbackJson = await fallback.json();

  if (fallbackJson?.data?.tobeparsed) {
    return await decodeTobeparsed(fallbackJson.data.tobeparsed);
  }

  return fallbackJson?.data?.episode?.sourceUrls ?? [];
}

export function searchQuery(
  query: string,
  page: number = 1,
  limit: number = defaultLimit,
) {
  return {
    query: gql`
      query SearchAnime(
        $search: SearchInput
        $limit: Int
        $page: Int
        $countryOrigin: VaildCountryOriginEnumType
      ) {
        shows(
          search: $search
          limit: $limit
          page: $page
          countryOrigin: $countryOrigin
        ) {
          edges {
            _id
            englishName
            name
            thumbnail
            __typename
            availableEpisodesDetail
            lastEpisodeTimestamp
          }
        }
      }
    `,
    variables: {
      search: { allowAdult: false, allowUnknown: false, query },
      limit,
      page,
      countryOrigin: "ALL",
    },
  };
}

export function popularQuery(page: number = 1, limit: number = defaultLimit) {
  return {
    query: gql`
      query SearchAnime(
        $limit: Int
        $page: Int
        $countryOrigin: VaildCountryOriginEnumType
      ) {
        shows(
          search: { sortBy: Top }
          limit: $limit
          page: $page
          countryOrigin: $countryOrigin
        ) {
          edges {
            _id
            englishName
            name
            thumbnail
            __typename
            availableEpisodesDetail
            lastEpisodeTimestamp
          }
        }
      }
    `,
    variables: {
      search: { allowAdult: false, allowUnknown: false },
      limit,
      page,
      countryOrigin: "ALL",
    },
  };
}

export function newQuery(page: number = 1, limit: number = defaultLimit) {
  return {
    query: gql`
      query SearchAnime(
        $limit: Int
        $page: Int
        $countryOrigin: VaildCountryOriginEnumType
      ) {
        shows(
          search: { sortBy: Recent }
          limit: $limit
          page: $page
          countryOrigin: $countryOrigin
        ) {
          edges {
            _id
            englishName
            name
            thumbnail
            __typename
            availableEpisodesDetail
            lastEpisodeTimestamp
          }
        }
      }
    `,
    variables: {
      search: { allowAdult: false, allowUnknown: false },
      limit,
      page,
      countryOrigin: "ALL",
    },
  };
}

export function getShow(showId: string) {
  return {
    query: gql`
      query Show($showId: String!) {
        show(_id: $showId) {
          _id
          name
          englishName
          lastEpisodeTimestamp
          thumbnail
          nextAiringEpisode
          availableEpisodesDetail
        }
      }
    `,
    variables: { showId },
  };
}
