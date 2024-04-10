export interface Titles {
  _id: string;
  name: string;
  availableEpisodes: {
    sub: number;
    dub: number;
    raw: number;
  };
  thumbnail: string;
  __typename: string;
}