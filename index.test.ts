import { describe, it } from "vitest";
import { PokemonDataAll, ItemDataAll } from "./schema";
import POKEMON_ALL from "./POKEMON_ALL.json";
import ITEM_ALL from "./ITEM_ALL.json";

describe("POKEMON_ALL.json", () => {
  it("conforms to schema", () => {
    PokemonDataAll.parse(POKEMON_ALL);
  });
});

describe("ITEM_ALL.json", () => {
  it("conforms to schema", () => {
    ItemDataAll.parse(ITEM_ALL);
  });
});
