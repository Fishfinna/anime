import { Accessor } from "solid-js";
import {Titles} from "./titles";

export interface Settings { 
    mode: Accessor<Mode>, 
    setMode: (arg: Mode) => void,
    titles: Accessor<Titles[]>, 
    setTitles: (arg: Titles[]) => void,
    episodes: Accessor<any>,
    setEpisodes: (arg: any) => void
}

export enum Mode {
    none = "none",
    title = "title",
    episode = "episode"
}