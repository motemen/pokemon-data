import { readFileSync } from "node:fs";

interface AllPokemonData {
  data: {
    species_names: {
      name_ja: string;
      species: {
        name_en: { name: string }[];
        pokedex_numbers: {
          pokedex_number: number;
        }[];
        pokemons: {
          name_en: string;
          pokeapi_id: 1;
          is_default: boolean;
        }[];
      };
    }[];
  };
}

const data = JSON.parse(
  readFileSync(process.argv[2], "utf-8")
) as AllPokemonData;

function mustDropPrefix(s: string, prefix: string): string {
  if (s === prefix) {
    return "";
  }

  if (!s.startsWith(`${prefix}-`)) {
    throw new Error(`Expected ${s} to start with ${prefix}-`);
  }

  return s.slice(prefix.length + 1);
}

console.log(["全国図鑑No", "ID", "名前", "名前(en)", "変種(en)"].join("\t"));

for (const { name_ja, species } of data.data.species_names) {
  const pokedex_number = species.pokedex_numbers[0].pokedex_number;

  const name_root = species.name_en[0].name
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/♀/g, "-f")
    .replace(/♂/g, "-m")
    .normalize("NFKD")
    .replace(/[^a-z0-9-]+/g, "");

  for (const pokemon of species.pokemons) {
    console.log(
      [
        pokedex_number,
        pokemon.pokeapi_id,
        name_ja,
        pokemon.name_en,
        mustDropPrefix(pokemon.name_en, name_root),
      ].join("\t")
    );
  }
}
