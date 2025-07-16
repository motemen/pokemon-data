import argparse
import json

import pandas as pd

parser = argparse.ArgumentParser()
parser.add_argument("--repl", action="store_true", default=False)
parser.add_argument("pokeapi_item_csv")
parser.add_argument("pokedbtokyo_item_json")
parser.add_argument("--out_tsv")
parser.add_argument("--out_json")
args = parser.parse_args()

df_pokeapi = pd.read_csv(args.pokeapi_item_csv)
pokedbtokyo_item_names = json.load(open(args.pokedbtokyo_item_json))

# 日本語名（local_language_id=1）と英語名（local_language_id=9）を取得
df_pokeapi_ja = df_pokeapi[df_pokeapi["local_language_id"] == 1].copy()
df_pokeapi_ja = df_pokeapi_ja.rename({"item_id": "pokeapi_id", "name": "name_ja"}, axis="columns")

df_pokeapi_en = df_pokeapi[df_pokeapi["local_language_id"] == 9].copy()
df_pokeapi_en = df_pokeapi_en.rename({"item_id": "pokeapi_id", "name": "name_en"}, axis="columns")

# 日本語と英語名をpokeapi_idで結合
df_pokeapi_merged = pd.merge(
    df_pokeapi_ja[["pokeapi_id", "name_ja"]],
    df_pokeapi_en[["pokeapi_id", "name_en"]],
    on="pokeapi_id",
    how="left"
)

df_pokedbtokyo = pd.DataFrame(
    [
        {"pokedbtokyo_id": int(item_id), "name_ja": name}
        for item_id, name in pokedbtokyo_item_names.items()
    ]
)

df_merged = pd.merge(
    df_pokedbtokyo[df_pokedbtokyo["name_ja"] != ""],
    df_pokeapi_merged,
    how="left",
    on="name_ja",
)

df_merged = df_merged[["name_ja", "name_en", "pokeapi_id", "pokedbtokyo_id"]]

if args.repl:
    import code

    code.interact(local=locals())

if args.out_tsv:
    df_merged.to_csv(args.out_tsv, sep="\t", index=False)

if args.out_json:
    df_merged.to_json(args.out_json, orient="records", indent=2, force_ascii=False)
