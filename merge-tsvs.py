import re
import sys

import pandas as pd

# Read in the first file
df_yakkun = pd.read_csv(sys.argv[1], sep="\t")
df_pokeapi = pd.read_csv(sys.argv[2], sep="\t")

## Cleanup Yakkun

# ポワルンは同じIDで複数回出現する（フォルム違い）ので落とす
df_yakkun = df_yakkun.drop(
    df_yakkun[
        (df_yakkun["name_ja"] == "ポワルン") & (df_yakkun["variant"].notna())
    ].index
)
# モルペコなど
df_yakkun = df_yakkun.drop_duplicates()


# 名前から変種を生成
def yakkun_row_to_normalized_variant(row):
    if not pd.isna(row["variant"]):
        return row["variant"]

    PATTERNS = [
        re.compile(r)
        for r in [
            r"^(メガ)(?!ニウム|ヤンマ).*?([XY])?$",
            r"^(ゲンシ)",
            r"^(.+)ロトム$",
            r"^(.+)キュレム$",
            r"^(サトシ)ゲッコウガ$",
            r"^(ウルトラ)ネクロズマ$",
            r"(?<!ニドラン)([♀♂])$",
        ]
    ]

    for pattern in PATTERNS:
        match = pattern.search(row["name_ja"])
        if match:
            return match.group(1) + (
                match.group(2) or "" if len(match.groups()) > 1 else ""
            )

    return None


df_yakkun["normalized_variant"] = df_yakkun.apply(
    yakkun_row_to_normalized_variant, axis="columns"
)


## Cleanup PokeAPI
def pokeapi_row_to_normalized_variant(row):
    POKEMON_EN2JA = {
        None: {
            "alola": "アローラ",
            "galar": "ガラル",
            "hisui": "ヒスイ",
            "male": "♂",
            "female": "♀",
            "incarnate": "化身",
            "therian": "霊獣",
            "mega": "メガ",
            "primal": "ゲンシ",
            "paldea": "パルデア",
            "origin": "オリジン",
            "crowned": "王",
            "black": "ブラック",
            "white": "ホワイト",
            "mega-x": "メガX",
            "mega-y": "メガY",
            "": "",
        },
        "バドレックス": {
            "ice": "はくば",
            "shadow": "こくば",
        },
        "オーガポン": {
            "wellspring-mask": "いど",
            "hearthflame-mask": "かまど",
            "cornerstone-mask": "いしずえ",
        },
        "イルカマン": {
            "": "ナイーブ",
            "hero": "マイティ",
        },
        "ウーラオス": {
            "single": "いちげき",
            "rapid": "れんげき",
        },
    }

    normalized_variant = None
    if row["name_ja"] in POKEMON_EN2JA:
        normalized_variant = POKEMON_EN2JA[row["name_ja"]].get(row["variant"], None)
    else:
        normalized_variant = POKEMON_EN2JA[None].get(row["variant"], None)

    return normalized_variant or row["variant"]


df_pokeapi["normalized_variant"] = df_pokeapi.apply(
    pokeapi_row_to_normalized_variant, axis="columns"
)

df_merged = pd.merge(
    df_yakkun[
        ["national_pokedex_number", "normalized_variant", "id", "name_ja", "variant"]
    ],
    df_pokeapi[["national_pokedex_number", "normalized_variant", "id", "name_en"]],
    on=["national_pokedex_number", "normalized_variant"],
    how="outer",
    suffixes=("_yakkuncom", "_pokeapi"),
).drop(columns=["normalized_variant"])

df_merged["id_pokeapi"] = df_merged["id_pokeapi"].astype("Int64")

# import code
# code.interact(local=locals())

print(df_merged.to_csv(sep="\t", index=False))
