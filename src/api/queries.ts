import { gql } from '@urql/core';

export const titlesQuery = {
    query: gql`
    query SearchAnime(
        $search: SearchInput
        $limit: Int
        $page: Int
        $translationType: VaildTranslationTypeEnumType
        $countryOrigin: VaildCountryOriginEnumType
    ) {
        shows(
        search: $search
        limit: $limit
        page: $page
        translationType: $translationType
        countryOrigin: $countryOrigin
        ) {
        edges {
            _id
            name
            availableEpisodes
            __typename
        }
        }
    }
    `,
    
    variables: (query: string) => {return {
      search: { allowAdult: false, allowUnknown: false, query},
      limit: 12,
      page: 1,
      translationType: "sub",
      countryOrigin: "ALL",
    }}
}