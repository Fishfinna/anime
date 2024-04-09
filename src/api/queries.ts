import { gql } from '@urql/core';

export function titlesQuery(query: string, isSub: boolean = false) {
    const lang = isSub ? "sub" : "dub";
    
    return ({
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
    variables:  {
        search: { allowAdult: false, allowUnknown: false, query},
        limit: 5,
        page: 1,
        translationType: lang,
        countryOrigin: "ALL",
    }
    });
}
