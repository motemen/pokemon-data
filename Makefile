.PHONY: all
all: pokemon items index.d.ts

.PHONY: clean
clean:
	rm -f POKEMON_ALL.json POKEMON_ALL.tsv

.PHONY: pokemon
pokemon: data/merged/pokeapi_showdown.tsv data/merged/pokeapi_yakkuncom.tsv
	uv run python merge-pokemon-all.py

POKEMON_ALL.json: pokemon

POKEMON_ALL.tsv: pokemon

.PHONY: items
items: source/pokeapi-item_names.csv source/pokedbtokyo-item-names.json bulbapedia-items.tsv
	uv run python merge-items.py source/pokeapi-item_names.csv source/pokedbtokyo-item-names.json bulbapedia-items.tsv --out_tsv ITEM_ALL.tsv --out_json ITEM_ALL.json

bulbapedia-items.tsv: source/bulbapedia-items-gen9.html
	uv run parse-bulbapedia-items.py $< > $@

.PHONY: test
test:
	pnpm test

data/yakkuncom.tsv: source/yakkuncom-zukan.html
	echo "national_pokedex_number	id	name_ja	form_name_ja" > $@
	cat $< | iconv -f euc-jp -t utf8 | perl -nle 'm#li .*?data-no="([0-9]+)"[^>]+>.*?<a href="/sv/zukan/([^"]+)">.*?</i>(.+?)(?:<span>\((.+?)\)</span>)?</a></li># and print join "\t", $$1, $$2, $$3, $$4' | sort -n >> $@

data/pokeapi.tsv: source/pokeapi-allpokemons.json parse-pokeapi-allpokemons.sh
	./parse-pokeapi-allpokemons.sh $< > $@

data/showdown.tsv: create-showdown.ts
	pnpm tsx create-showdown.ts > $@

data/yakkuncom_extended.tsv: data/yakkuncom.tsv
	uv run python extend-yakkuncom.py

data/merged/pokeapi_yakkuncom.tsv: merge-pokeapi-yakkuncom.py data/pokeapi.tsv data/yakkuncom_extended.tsv
	uv run python merge-pokeapi-yakkuncom.py

data/merged/pokeapi_showdown.tsv: merge-pokeapi-showdown.py data/pokeapi.tsv data/showdown.tsv
	uv run python merge-pokeapi-showdown.py

source/pokeapi-allpokemons.json: pokeapi.allpokemons.graphql
	cat $< | jq -Rs '{query:.}' | curl --fail 'https://graphql.pokeapi.co/v1beta2' -d @- | jq . > $@

source/pokeapi-item_names.csv:
	curl --fail -L https://github.com/PokeAPI/pokeapi/raw/refs/heads/master/data/v2/csv/item_names.csv -o $@

source/pokemondb-pokedex-all.html:
	curl --fail https://pokemondb.net/pokedex/all -o $@

source/yakkuncom-zukan.html:
	curl --fail https://yakkun.com/sv/zukan/ -o $@ -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"

source/yakkuncom-item.html:
	curl --fail https://yakkun.com/sv/item.htm -o $@ -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/13.0.0.0 Safari/537.36"

source/bulbapedia-items-gen9.html:
	curl --fail https://bulbapedia.bulbagarden.net/wiki/List_of_items_by_index_number_in_Generation_IX -o $@

index.d.ts: always
	pnpm run create-dts

.PHONY: always
always:
	
