# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This project is an npm package that creates and provides datasets integrating IDs from multiple Pokémon databases. Main deliverables:
- `POKEMON_ALL.json/tsv` - Pokémon ID mapping between yakkun.com, PokéAPI, and pokedb.tokyo
- `ITEM_ALL.json/tsv` - Item data mapping between PokéAPI and Bulbapedia
- `@motemen/pokemon-data` - Published as an npm package

## Development Commands

### Build & Data Generation
```bash
make all        # Generate all data (Pokémon, items, TypeScript definitions)
make pokemon    # Generate Pokémon data only
make items      # Generate item data only
make test       # Run tests
```

### Testing
```bash
pnpm test       # Run Vitest schema validation tests
```

### Viewer Application Development
```bash
cd viewer
pnpm dev        # Start development server
pnpm build      # Build
pnpm lint       # Run ESLint
```

## Architecture

### Data Processing Pipeline

#### Pokémon Data
1. **Data Acquisition**: Fetch data from source sites using Makefile
2. **Data Transformation**: Unify formats using Python scripts
3. **Data Integration**: Merge multiple sources with `merge-pokemon-all.py`
4. **Type Definition Generation**: Auto-generate TypeScript definitions with `create-dts.ts`
5. **Validation**: Runtime type validation using Zod schemas

#### Item Data
1. **Data Acquisition**:
   - Download CSV files from PokéAPI
   - Download Generation IX item pages from Bulbapedia
   - Manual mapping files from pokedb.tokyo (JSON)
2. **Data Transformation**:
   - Convert Bulbapedia HTML tables to TSV with `parse-bulbapedia-items.py`
3. **Data Integration**:
   - Merge PokéAPI, Bulbapedia, and pokedb.tokyo data with `merge-items.py`
   - Match using Japanese and English names
4. **Type Definition Generation**: Auto-generate TypeScript definitions with `create-dts.ts`
5. **Validation**: Runtime type validation using Zod schemas

### Key File Structure
- `/source/` - Raw data fetched from each data source
- `merge-*.py` - Python scripts for data integration (using pandas)
- `parse-bulbapedia-items.py` - Convert Bulbapedia HTML to TSV (uv script format)
- `schema.ts` - Data schema definitions using Zod
- `/viewer/` - React-based data viewer (Vite + Tailwind CSS)
- `/tests/` - Vitest test files for schema validation

### Data Sources

#### Pokémon Data
- **yakkun.com**: HTML scraping (Perl processing in Makefile)
- **PokéAPI**: JSON API
- **pokedb.tokyo**: Manual mapping files (TSV)

#### Item Data
- **PokéAPI**: Item name CSV (Japanese & English)
- **Bulbapedia**: Generation IX item pages (HTML)
- **pokedb.tokyo**: Manual mapping files (JSON)

## Development Notes

- Use uv for Python environment (configured in pyproject.toml)
- Use pnpm (v9.14.4) for Node.js package management
- Run `make all` to regenerate everything when updating data
- Schema updates and type definition regeneration are required when adding new data sources
- Item data uses Bulbapedia IDs (migrated from pokedb.tokyo IDs)
- Execute all Python commands with `uv run python`