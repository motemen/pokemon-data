# manual:
# - yakkuncom-zukan.html

yakkuncom.tsv: source/yakkuncom-zukan.html
	echo "全国図鑑No	ID	名前	変種" > $@
	cat $< | iconv -f euc-jp -t utf8 | perl -nle 'm#li .*?data-no="([0-9]+)"[^>]+>.*?<a href="/sv/zukan/([^"]+)">.*?</i>(.+?)(?:<span>\((.+?)\)</span>)?</a></li># and print join "\t", $$1, $$2, $$3, $$4' | sort -n >> $@

pokeapi.tsv: source/pokeapi-allpokemons.json
	npx tsx mangle-pokeapi-allpokemons.ts $< > $@

source/pokeapi-allpokemons.json: pokeapi.allpokemons.graphql.postcontent
	curl https://beta.pokeapi.co/graphql/v1beta --data @$< | jq . > $@

