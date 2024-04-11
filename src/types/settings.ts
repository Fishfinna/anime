import { Accessor } from "solid-js";
import {Titles} from "./titles";

export interface Settings { 
    selectMode: Accessor<boolean>, 
    setSelectMode: (arg0: boolean) => void,
    titles: Accessor<Titles[]>, 
    setTitles: (arg: Titles[]) => void
}