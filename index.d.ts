declare module "@motemen/pokemon-data" {
  const POKEMON_ALL: {
      yakkuncom_id: string | null;
      yakkuncom_name: string | null;
      pokeapi_id: number;
      pokeapi_name: string;
      pokeapi_species_name_ja: string;
      pokeapi_form_name_ja: string | null;
      pokedbtokyo_id: string | null;
      pkmn_id: string | null;
      pkmn_name: string | null;
  }[];
  export default POKEMON_ALL;
}

declare module "@motemen/pokemon-data/POKEMON_ALL.json" {
  const POKEMON_ALL: {
      yakkuncom_id: string | null;
      yakkuncom_name: string | null;
      pokeapi_id: number;
      pokeapi_name: string;
      pokeapi_species_name_ja: string;
      pokeapi_form_name_ja: string | null;
      pokedbtokyo_id: string | null;
      pkmn_id: string | null;
      pkmn_name: string | null;
  }[];
  export default POKEMON_ALL;
}

declare module "@motemen/pokemon-data/ITEM_ALL.json" {
  const ITEM_ALL: {
      name_ja: string;
      name_en: string;
      pokeapi_id: number;
      pokedbtokyo_id: number;
  }[];
  export default ITEM_ALL;
}
