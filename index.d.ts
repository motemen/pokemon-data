declare module "@motemen/pokemon-data" {
  const POKEMON_ALL: {
      national_pokedex_number: number;
      pokeapi_form_order: number;
      pokeapi_form_name: string | null;
      pokeapi_species_id: number;
      pokeapi_species_id_name: string;
      pokeapi_pokemon_id: number;
      pokeapi_pokemon_id_name: string;
      pokeapi_form_id: number;
      pokeapi_form_id_name: string;
      pokeapi_species_name_ja: string;
      pokeapi_form_name_ja: string | null;
      pokeapi_species_name_en: string;
      pokeapi_form_name_en: string | null;
      showdown_form_order: number | null;
      showdown_name: string | null;
      showdown_id_name: string | null;
      showdown_base_species: string | null;
      showdown_forme: string | null;
      yakkuncom_id: string | null;
      yakkuncom_name: string | null;
      yakkuncom_form_name: string | null;
  }[];
  export default POKEMON_ALL;
}

declare module "@motemen/pokemon-data/POKEMON_ALL.json" {
  const POKEMON_ALL: {
      national_pokedex_number: number;
      pokeapi_form_order: number;
      pokeapi_form_name: string | null;
      pokeapi_species_id: number;
      pokeapi_species_id_name: string;
      pokeapi_pokemon_id: number;
      pokeapi_pokemon_id_name: string;
      pokeapi_form_id: number;
      pokeapi_form_id_name: string;
      pokeapi_species_name_ja: string;
      pokeapi_form_name_ja: string | null;
      pokeapi_species_name_en: string;
      pokeapi_form_name_en: string | null;
      showdown_form_order: number | null;
      showdown_name: string | null;
      showdown_id_name: string | null;
      showdown_base_species: string | null;
      showdown_forme: string | null;
      yakkuncom_id: string | null;
      yakkuncom_name: string | null;
      yakkuncom_form_name: string | null;
  }[];
  export default POKEMON_ALL;
}

declare module "@motemen/pokemon-data/ITEM_ALL.json" {
  const ITEM_ALL: {
      name_ja: string;
      name_en: string;
      pokeapi_id: number;
      bulbapedia_id: number | null;
  }[];
  export default ITEM_ALL;
}
