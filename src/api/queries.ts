import { gql } from "@urql/core";

const defaultLimit = 6;

export interface EpisodeVariables {
  showId: string;
  episodeString: string;
  translationType: string;
}

export function searchQuery(
  query: string,
  page: number = 1,
  limit: number = defaultLimit
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

export function episodeQuery(episodeVariables: EpisodeVariables) {
  return {
    query: gql`
      query GetEpisodeLinks(
        $showId: String!
        $translationType: VaildTranslationTypeEnumType!
        $episodeString: String!
      ) {
        episode(
          showId: $showId
          translationType: $translationType
          episodeString: $episodeString
        ) {
          sourceUrls
        }
      }
    `,
    variables: episodeVariables,
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
    variables: {
      showId,
    },
  };
}
