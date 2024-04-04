import { For } from "solid-js";

export function Results({ titles }: { titles: string[] }) {
  return <For each={titles}>{(title) => <p>{title}</p>}</For>;
}
