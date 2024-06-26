import { z } from "zod";

export const PokemonDataItem = z
  .object({
    yakkuncom_id: z.nullable(z.string()),
    yakkuncom_name: z.nullable(z.string()),
    pokeapi_id: z.number(),
    pokeapi_name: z.string(),
    pokeapi_species_name_ja: z.string(),
    pokeapi_form_name_ja: z.nullable(z.string()),
    pokedbtokyo_id: z.nullable(z.string()),
  })
  .strict();

export const PokemonDataAll = z.array(PokemonDataItem);
