#!/bin/bash

# ヘッダー行を出力
# ヘッダー行を1カラム1行で定義し、タブ区切りで出力
header_cols=(
  # Primary key
  "form_id"
  "form_id_name" # human-readable form ID

  # Foreign keys to join with other datasets
  "national_pokedex_number"
  "form_order"
  "form_name"

  # Additional information
  "species_id"
  "species_id_name"
  "pokemon_id"
  "pokemon_id_name"

  # Names in different languages
  "species_name_ja"
  "form_name_ja"
  
  "species_name_en"
  "form_name_en"
)
(IFS=$'\t'; echo "${header_cols[*]}")

# jqでデータを変換
jq -r '
.data.pokemonspeciesname[] |
. as $root |
.pokemonspecy.pokemons[] |
. as $pokemon |
.pokemonforms[] |
[
  .id,
  .id_name,
  
  $root.pokemonspecy.pokedex_number[0].pokedex_number,
  .form_order,
  .form_name,

  $root.pokemonspecy.id,
  $root.pokemonspecy.id_name,
  $pokemon.id,
  $pokemon.id_name,

  $root.name_ja,
  (.name_ja[0].name // ""),
  $root.pokemonspecy.name_en[0].name,
  (.name_en[0].name // "")
] | @tsv
' "$1"
