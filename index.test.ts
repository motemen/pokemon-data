import { describe, it } from "vitest";
import { PokemonDataAll } from "./schema";
import POKEMON_ALL from "./POKEMON_ALL.json";

describe("POKEMON_ALL.json", () => {
  it("conforms to schema", () => {
    PokemonDataAll.parse(POKEMON_ALL);
  });
});
