import { Title } from "../../types/titles";
import { For } from "solid-js";

interface RecentTitle extends Title {
  episodeNumber: number;
  watchTime: number;
}

export default function Recent({ titles }: { titles: () => RecentTitle[] }) {
  return (
    <>
      <h3>Recently Watching:</h3>
      <For each={titles()}>{(title) => <p>{title.name}</p>}</For>
    </>
  );
}
