import { gql } from "@urql/core";

export interface EpisodeVariables {
  showId: string;
  episodeString: string;
  translationType: string;
}

export function titlesQuery(query: string, page: number = 0) {
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
      limit: 8,
      page: page + 1,
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
          banner
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
