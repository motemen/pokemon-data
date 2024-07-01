import { PokemonDataAll } from "./schema";
import { zodToTs, printNode } from "zod-to-ts";

const { node } = zodToTs(PokemonDataAll);

const indented = (s: string) =>
  s
    .split("\n")
    .map((l, i) => (i === 0 ? l : "  " + l))
    .join("\n");

console.log(
  `
declare module "@motemen/pokemon-data" {
  const POKEMON_ALL: ${indented(printNode(node))};
  export default POKEMON_ALL;
}`.trim()
);
