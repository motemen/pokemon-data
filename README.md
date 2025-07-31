# POKEMON_ALL

A table of Pokémon ID correspondences across multiple sites.

## Available data

- [POKEMON_ALL.tsv](./POKEMON_ALL.tsv)
- [POKEMON_ALL.json](./POKEMON_ALL.json)

## Schema

- `yakkuncom_id`
  - The ID of the Pokémon on [ポケモン徹底攻略][].
- `yakkuncom_name`
  - The name of the Pokémon on [ポケモン徹底攻略][]. (for readability)
- `pokeapi_id`
  - The ID of the Pokémon on [PokéAPI][].
- `pokeapi_name`
  - The name of the Pokémon on [PokéAPI][]. (for readability)
- `pokeapi_species_name_ja`
  - The Japanese name of the species and form of the Pokémon on [PokéAPI][]. (Could be used for presentation)
- `pokeapi_form_name_ja`
  - The Japanese name of the species and form of the Pokémon on [PokéAPI][]. (Could be used for presentation)
- `pokedbtokyo_id`
  - The ID of the Pokémon on [ポケモンバトルデータベース][].

## Supported sites

- [ポケモン徹底攻略][]
- [PokéAPI][]
- [ポケモンバトルデータベース][]
- 

[ポケモン徹底攻略]: https://yakkun.com/
[PokéAPI]: https://pokeapi.co/
[ポケモンバトルデータベース]: https://sv.pokedb.tokyo/

## Data Source

- yakkuncom:
  - [ポケモン徹底攻略 - ポケモン図鑑](https://yakkun.com/pokemon)
  - Primary Key: `id` -- eg. `n25`
  - Unique Key: `national_pokedex_number`, `form_name_ja`
    - References pokeapi(`national_pokedex_number`, `form_name`)
- pokeapi:
  - [PokéAPI - Pokémon](https://pokeapi.co/docs/v2) 
  - Primary Key: [PokemonForm](https://pokeapi.co/docs/v2#pokemonform).id
  - Unique Key: `national_pokedex_number`, `form_number`, `form_name`
- pkmn
  - https://github.com/pkmn/ps
  - Primary Key: `id`
  - Unique Key: `national_pokedex_number`, `form_name`

## Data Flow

- source/yakkuncom-zukan.html (fetched manually) -> data/yakkuncom.tsv
- source/pokeapi-allpokemons.json (form API with pokeapi.allpokemons.graphql) -> data/pokeapi.tsv
- data/pkmn.tsv (generated from dump-pkmn.ts)
