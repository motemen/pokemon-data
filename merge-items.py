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

df_pokeapi = df_pokeapi[df_pokeapi["local_language_id"] == 1]
df_pokeapi = df_pokeapi.rename({"item_id": "pokeapi_id"}, axis="columns")

df_pokedbtokyo = pd.DataFrame(
    [
        {"pokedbtokyo_id": int(item_id), "name": name}
        for item_id, name in pokedbtokyo_item_names.items()
    ]
)

df_merged = pd.merge(
    df_pokedbtokyo[df_pokedbtokyo["name"] != ""],
    df_pokeapi[["pokeapi_id", "name"]],
    how="left",
    on="name",
)

df_merged = df_merged[["name", "pokeapi_id", "pokedbtokyo_id"]]

if args.repl:
    import code

    code.interact(local=locals())

if args.out_tsv:
    df_merged.to_csv(args.out_tsv, sep="\t", index=False)

if args.out_json:
    df_merged.to_json(args.out_json, orient="records", indent=2, force_ascii=False)
