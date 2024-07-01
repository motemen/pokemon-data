declare module "@motemen/pokemon-data" {
  const POKEMON_ALL: {
    yakkuncom_id: string | null;
    yakkuncom_name: string | null;
    pokeapi_id: number;
    pokeapi_name: string;
    pokeapi_species_name_ja: string;
    pokeapi_form_name_ja: string | null;
    pokedbtokyo_id: string | null;
  }[];
  export default POKEMON_ALL;
}
