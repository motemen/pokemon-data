.PHONY: all
all: yakkuncom.tsv pokeapi.tsv source/pokeapi-pokedbtokyo.tsv index.d.ts
	python merge-tsvs.py yakkuncom.tsv pokeapi.tsv source/pokeapi-pokedbtokyo.tsv --out_tsv POKEMON_ALL.tsv --out_json POKEMON_ALL.json

.PHONY: test
test:
	npm test

yakkuncom.tsv: source/yakkuncom-zukan.html
	echo "national_pokedex_number	id	name_ja	variant" > $@
	cat $< | iconv -f euc-jp -t utf8 | perl -nle 'm#li .*?data-no="([0-9]+)"[^>]+>.*?<a href="/sv/zukan/([^"]+)">.*?</i>(.+?)(?:<span>\((.+?)\)</span>)?</a></li># and print join "\t", $$1, $$2, $$3, $$4' | sort -n >> $@

pokeapi.tsv: source/pokeapi-allpokemons.json
	python format-pokeapi-allpokemons.py $< > $@

source/pokeapi-allpokemons.json: pokeapi.allpokemons.graphql.postcontent
	curl --fail https://beta.pokeapi.co/graphql/v1beta --data @$< | jq . > $@

source/pokemondb-pokedex-all.html:
	curl --fail https://pokemondb.net/pokedex/all -o $@

index.d.ts: always
	npm run create-dts

.PHONY: always
always:
	