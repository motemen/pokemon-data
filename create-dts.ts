import { PokemonDataAll, ItemDataAll } from "./schema";
import { zodToTs, printNode } from "zod-to-ts";

const { node: pokemonNode } = zodToTs(PokemonDataAll);
const { node: itemNode } = zodToTs(ItemDataAll);

const indented = (s: string) =>
  s
    .split("\n")
    .map((l, i) => (i === 0 ? l : "  " + l))
    .join("\n");

const pokemonType = indented(printNode(pokemonNode));
const itemType = indented(printNode(itemNode));

console.log(
  `
declare module "@motemen/pokemon-data" {
  const POKEMON_ALL: ${pokemonType};
  export default POKEMON_ALL;
}

declare module "@motemen/pokemon-data/POKEMON_ALL.json" {
  const POKEMON_ALL: ${pokemonType};
  export default POKEMON_ALL;
}

declare module "@motemen/pokemon-data/ITEM_ALL.json" {
  const ITEM_ALL: ${itemType};
  export default ITEM_ALL;
}`.trim()
);
