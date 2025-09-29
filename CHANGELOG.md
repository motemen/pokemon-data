## 9.5.0 (2025-09-29)

- BREAKING: Mass refactor
  - modified schema
  - import pkmn data
  - removed pokedbtokyo data from pokemon dataset, as it should be able to be derived from national_pokedex_number and form_order.

## 9.4.0 (2025-07-16)

- BREAKING: removed pokedbtokyo_id from ITEM_ALL
- Added bulbapedia_id to ITEM_ALL

## <small>9.3.1 (2025-07-16)</small>

* Added type definition for ITEM_ALL.json

## 9.3.0 (2025-07-16)

- BREAKING: Added english support for items
  - "name" field was renamed to "name_ja"

## [9.2.0] - 2025-07-14

- Added support for `@pkmn/data`

## [9.1.0] - 2025-07-14

- Added ITEM_ALL.json

## [9.0.0] - 2024-07-01

- Initial release

[9.1.0]: https://github.com/motemen/pokemon-data/compare/v9.0.0..v9.1.0
[9.2.0]: https://github.com/motemen/pokemon-data/compare/v9.1.0..v9.2.0
