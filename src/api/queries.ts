import { gql } from '@urql/core';

export function titlesQuery(query: string) {
    return ({
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
            name
            thumbnail
            __typename
            availableEpisodesDetail
            lastEpisodeTimestamp
            }
        }
    }
    `,    
    variables:  {
        search: { allowAdult: false, allowUnknown: false, query},
        limit: 4,
        page: 1,
        countryOrigin: "ALL",
    }
    });
}
