import { Accessor } from "solid-js";
import {Title} from "./titles";

export interface Settings { 
    mode: Accessor<Mode>, 
    setMode: (arg: Mode) => void,
    titles: Accessor<Title[]>, 
    setTitles: (arg: Title[]) => void,
    currentTitle: Accessor<Title | undefined>,
    setCurrentTitle: (arg: Title | undefined) => void,
    isDub: Accessor<boolean>
    setIsDub: (arg: boolean) => void
    episodeNumber: Accessor<string>,
    setEpisodeNumber: (arg: string) => void
}

export enum Mode {
    none = "none",
    title = "title",
    episode = "episode"
}