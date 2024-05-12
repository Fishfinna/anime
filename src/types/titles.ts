export interface EpisodeDetail {
  sub: string[];
  dub: string[];
  raw: string[];
}

export interface LastEpisodeTimestamp {
  sub: number;
  dub: number;
  raw: number;
}

export interface Title {
  _id: string;
  englishName: string;
  name: string;
  thumbnail: string;
  __typename: string;
  availableEpisodesDetail: EpisodeDetail;
  lastEpisodeTimestamp: LastEpisodeTimestamp;
}
