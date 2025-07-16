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
    pkmn_id: z.nullable(z.string()),
    pkmn_name: z.nullable(z.string()),
  })
  .strict();

export const PokemonDataAll = z.array(PokemonDataItem);

export const ItemDataItem = z
  .object({
    name_ja: z.string(),
    name_en: z.string(),
    pokeapi_id: z.number(),
    pokedbtokyo_id: z.number(),
  })
  .strict();

export const ItemDataAll = z.array(ItemDataItem);
