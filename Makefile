POKEMON_ALL.tsv: yakkuncom.tsv pokeapi.tsv
	python merge-tsvs.py yakkuncom.tsv pokeapi.tsv > $@

yakkuncom.tsv: source/yakkuncom-zukan.html
	echo "national_pokedex_number	id	name_ja	variant" > $@
	cat $< | iconv -f euc-jp -t utf8 | perl -nle 'm#li .*?data-no="([0-9]+)"[^>]+>.*?<a href="/sv/zukan/([^"]+)">.*?</i>(.+?)(?:<span>\((.+?)\)</span>)?</a></li># and print join "\t", $$1, $$2, $$3, $$4' | sort -n >> $@

pokeapi.tsv: source/pokeapi-allpokemons.json
	python format-pokeapi-allpokemons.py $< > $@

source/pokeapi-allpokemons.json: pokeapi.allpokemons.graphql.postcontent
	curl https://beta.pokeapi.co/graphql/v1beta --data @$< | jq . > $@
