# @motemen/pokemon-data

A comprehensive dataset integrating Pokémon and item data from multiple sources, providing ID mappings and localized names.

## Available Data

### Pokémon Data

- [POKEMON_ALL.tsv](./POKEMON_ALL.tsv) - Tab-separated values format
- [POKEMON_ALL.json](./POKEMON_ALL.json) - JSON format
- [index.d.ts](./index.d.ts) - TypeScript type definitions

### Item Data

- [ITEM_ALL.tsv](./ITEM_ALL.tsv) - Tab-separated values format
- [ITEM_ALL.json](./ITEM_ALL.json) - JSON format

## Data Schema

### Pokémon Data Fields

- **National Pokédex**

  - `national_pokedex_number` - National Pokédex number

- **PokéAPI Integration**

  - `pokeapi_species_id` / `pokeapi_species_id_name` - Species ID and name
  - `pokeapi_pokemon_id` / `pokeapi_pokemon_id_name` - Pokémon ID and name
  - `pokeapi_form_id` / `pokeapi_form_id_name` - Form ID and name
  - `pokeapi_form_order` - Form ordering number
  - `pokeapi_form_name` - Form name (English)
  - `pokeapi_species_name_ja` / `pokeapi_species_name_en` - Species names (Japanese/English)
  - `pokeapi_form_name_ja` / `pokeapi_form_name_en` - Form names (Japanese/English)

- **PKMN Showdown Integration**

  - `pkmn_form_order` - PKMN form order
  - `pkmn_name` / `pkmn_id_name` - PKMN name and ID
  - `pkmn_base_species` / `pkmn_forme` - Base species and forme

- **Yakkun.com Integration**
  - `yakkuncom_id` - Yakkun.com Pokémon ID (e.g., "n25")
  - `yakkuncom_name` - Pokémon name on Yakkun.com
  - `yakkuncom_form_name` - Form name on Yakkun.com

### Item Data Fields

- `name_ja` - Japanese item name
- `name_en` - English item name
- `pokeapi_id` - PokéAPI item ID
- `bulbapedia_id` - Bulbapedia item ID (nullable)

## Data Sources

### Pokémon Data

- **[PokéAPI][]** - Comprehensive Pokémon API with form data
- **[pkmn Project][]** - Competitive Pokémon data
- **[ポケモン徹底攻略][]** - Japanese Pokémon database

### Item Data

- **[PokéAPI]** - Item names in multiple languages
- **[Bulbapedia](https://bulbapedia.bulbagarden.net/)** - Generation IX item indices
- **[PokeDB Tokyo](https://sv.pokedb.tokyo/)** - Additional item mappings

[PokéAPI]: https://pokeapi.co/
[pkmn Project]: https://pkmn.cc/
[ポケモン徹底攻略]: https://yakkun.com/

## Data Processing Pipeline

### Pokémon Data

1. **Data Acquisition**

   - PokéAPI: GraphQL query → `source/pokeapi-allpokemons.json`
   - Yakkun.com: HTML scraping → `source/yakkuncom-zukan.html`
   - PKMN: Generated from `@pkmn/dex` → `data/pkmn.tsv`

2. **Data Processing**

   - Parse and normalize form names with `extend-yakkuncom.py`
   - Merge PokéAPI and PKMN data with `merge-pokeapi-pkmn.py`
   - Merge PokéAPI and Yakkun data with `merge-pokeapi-yakkuncom.py`
   - Final integration with `merge-pokemon-all.py`

3. **Output Generation**
   - `POKEMON_ALL.json` / `POKEMON_ALL.tsv`
   - TypeScript definitions via `create-dts.ts`

### Item Data

1. **Data Acquisition**

   - PokéAPI: CSV download → `source/pokeapi-item_names.csv`
   - Bulbapedia: HTML scraping → `source/bulbapedia-items-gen9.html`
   - PokeDB Tokyo: Manual mapping → `source/pokedbtokyo-item-names.json`

2. **Data Processing**

   - Parse Bulbapedia HTML with `parse-bulbapedia-items.py`
   - Merge all sources with `merge-items.py`

3. **Output Generation**
   - `ITEM_ALL.json` / `ITEM_ALL.tsv`

## Development

### Build Commands

```bash
make all        # Generate all data files
make pokemon    # Generate Pokémon data only
make items      # Generate item data only
make clean      # Remove generated files
make distclean  # Remove all generated and downloaded files
make test       # Run validation tests
```

### Dependencies

- **Python**: `uv` with pandas for data processing
- **Node.js**: `pnpm` for TypeScript compilation and testing
- **External APIs**: PokéAPI GraphQL, web scraping for Yakkun/Bulbapedia

## Type Safety

This package provides full TypeScript support with:

- Runtime validation using Zod schemas
- Auto-generated type definitions
- Vitest-based schema validation tests
