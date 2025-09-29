import { z } from "zod";

export const PokemonDataItem = z
  .object({
    national_pokedex_number: z.number(),
    pokeapi_form_order: z.number(),
    pokeapi_form_name: z.nullable(z.string()),
    pokeapi_species_id: z.number(),
    pokeapi_species_id_name: z.string(),
    pokeapi_pokemon_id: z.number(),
    pokeapi_pokemon_id_name: z.string(),
    pokeapi_form_id: z.number(),
    pokeapi_form_id_name: z.string(),
    pokeapi_species_name_ja: z.string(),
    pokeapi_form_name_ja: z.nullable(z.string()),
    pokeapi_species_name_en: z.string(),
    pokeapi_form_name_en: z.nullable(z.string()),
    pkmn_form_order: z.nullable(z.number()),
    pkmn_name: z.nullable(z.string()),
    pkmn_id_name: z.nullable(z.string()),
    pkmn_base_species: z.nullable(z.string()),
    pkmn_forme: z.nullable(z.string()),
    yakkuncom_id: z.nullable(z.string()),
    yakkuncom_name: z.nullable(z.string()),
    yakkuncom_form_name: z.nullable(z.string()),
  })
  .strict();

export const PokemonDataAll = z.array(PokemonDataItem);

export const ItemDataItem = z
  .object({
    name_ja: z.string(),
    name_en: z.string(),
    pokeapi_id: z.number(),
    bulbapedia_id: z.nullable(z.number()),
  })
  .strict();

export const ItemDataAll = z.array(ItemDataItem);
