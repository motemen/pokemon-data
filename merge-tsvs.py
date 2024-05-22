import argparse
import re
import sys

import pandas as pd


parser = argparse.ArgumentParser()
parser.add_argument("--repl", action="store_true", default=False)
parser.add_argument("yakkuncom_tsv")
parser.add_argument("pokeapi_tsv")
args = parser.parse_args()

# Read in the first file
df_yakkun = pd.read_csv(args.yakkuncom_tsv, sep="\t")
df_pokeapi = pd.read_csv(args.pokeapi_tsv, sep="\t")

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
).fillna("")


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
        "ケンタロス": {
            "paldea-aqua-breed": "パルデア水",
            "paldea-blaze-breed": "パルデア炎",
            "paldea-combat-breed": "パルデア単",
        },
        "デオキシス": {
            "attack": "アタック",
            "defense": "ディフェンス",
            "normal": "ノーマル",
            "speed": "スピード",
        },
        "ミノマダム": {
            "plant": "くさき",
            "sandy": "すなち",
            "trash": "ゴミ",
        },
        "ロトム": {
            "fan": "スピン",
            "frost": "フロスト",
            "heat": "ヒート",
            "mow": "カット",
            "wash": "ウォッシュ",
        },
        "シェイミ": {
            "land": "ランド",
            "sky": "スカイ",
        },
        "ギラティナ": {
            "altered": "アナザー",
            "origin": "オリジン",
        },
        "バスラオ": {
            "blue-striped": "青",
            "red-striped": "赤",
            "white-striped": "白",
        },
        "ヒヒダルマ": {
            "standard": "",
            "zen": "ダルマ",
            "galar-standard": "ガラル",
            "galar-zen": "ダルマ・ガラル",
        },
        "ケルディオ": {
            "ordinary": "いつも",
            "resolute": "覚悟",
        },
        "メロエッタ": {
            "aria": "ボイス",
            "pirouette": "ステップ",
        },
        "ゲッコウガ": {
            "ash": "サトシ",
        },
        "ギルガルド": {
            "shield": "シールド",
            "blade": "ブレード",
        },
        "バケッチャ": {
            "average": "普通",
            "small": "小",
            "large": "大",
            "super": "特大",
        },
        "パンプジン": {
            "average": "普通",
            "small": "小",
            "large": "大",
            "super": "特大",
        },
        "ジガルデ": {
            "10": "10%",
            "50": "50%",
            "complete": "パーフェクト",
        },
        "フーパ": {
            "": "いましめ",
            "unbound": "ときはな",
        },
        "オドリドリ": {
            "baile": "めらめら",
            "pau": "ふらふら",
            "pom-pom": "ぱちぱち",
            "sensu": "まいまい",
        },
        "ルガルガン": {
            "midday": "まひる",
            "midnight": "まよなか",
            "dusk": "たそがれ",
        },
        "ヨワシ": {"school": "群れ", "solo": "単独"},
        "ミミッキュ": {
            "disguised": "",
        },
        "バドレックス": {
            "ice": "はくば",
            "shadow": "こくば",
        },
        "ネクロズマ": {
            "dusk": "日食",
            "dawn": "月食",
            "ultra": "ウルトラ",
        },
        "ストリンダー": {
            "amped": "ハイ",
            "low-key": "ロー",
        },
        "コオリッポ": {
            "ice": "アイス",
            "noice": "ナイス",
        },
        "ウーラオス": {
            "single-strike": "いちげき",
            "rapid-strike": "れんげき",
        },
        "ムゲンダイナ": {
            "eternamax": "ムゲン",
        },
        "パフュートン": {
            "": "♂",
            "female": "♀",
        },
        "イルカマン": {
            "": "ナイーブ",
            "hero": "マイティ",
        },
        "コレクレー": {"roaming": "とほ", "": "はこ"},
        "オーガポン": {
            "wellspring-mask": "いど",
            "hearthflame-mask": "かまど",
            "cornerstone-mask": "いしずえ",
        },
        "ガチグマ": {"bloodmoon": "アカツキ"},
        "テラパゴス": {
            "terastal": "テラスタル",
            "stellar": "ステラ",
        },
        "メテノ": {
            "red": "コア",
            "red-meteor": "流星",
        },
        "モルペコ": {
            "full-belly": "",
        },
    }

    normalized_variant = None
    if row["name_ja"] in POKEMON_EN2JA:
        normalized_variant = POKEMON_EN2JA[row["name_ja"]].get(row["variant"], None)
    else:
        normalized_variant = POKEMON_EN2JA[None].get(row["variant"], None)

    if normalized_variant is None:
        return row["variant"]
    return normalized_variant


df_pokeapi["variant"] = df_pokeapi["variant"].fillna("")

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
)

df_merged["id_pokeapi"] = df_merged["id_pokeapi"].astype("Int64")

if args.repl:
    import code

    code.interact(local=locals())


def combine_yakkuncom_name(row):
    if pd.isna(row["name_ja"]):
        return ""
    if pd.isna(row["variant"]):
        return row["name_ja"]
    return f"{row["name_ja"]}({row["variant"]})"


df_merged["yakkuncom_name"] = df_merged.apply(combine_yakkuncom_name, axis="columns")
df_merged = df_merged.drop(columns=["normalized_variant", "name_ja", "variant"])
df_merged.rename(
    {
        "id_yakkuncom": "yakkuncom_id",
        "id_pokeapi": "pokeapi_id",
        "name_en": "pokeapi_name",
    },
    axis="columns",
    inplace=True,
)
df_merged = df_merged.reindex(
    columns=["yakkuncom_id", "yakkuncom_name", "pokeapi_id", "pokeapi_name"]
)


# Output each row to stderr
for index, row in df_merged[df_merged["pokeapi_id"].isnull()].iterrows():
    print(f"no match in pokeapi: {row["yakkuncom_name"]}", file=sys.stderr)


print(df_merged.to_csv(sep="\t", index=False), end="")
