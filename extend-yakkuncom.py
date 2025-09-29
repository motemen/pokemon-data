import argparse
import re

import numpy as np
import pandas as pd


parser = argparse.ArgumentParser()
parser.add_argument("--repl", action="store_true", default=False)
args = parser.parse_args()

df_yakkuncom = pd.read_csv("./data/yakkuncom.tsv", sep="\t").replace({np.nan: None})


# 名前から変種を生成
def normalize_form_name_ja(row: pd.Series) -> str:
    if not pd.isna(row["form_name_ja"]):
        return row["form_name_ja"]

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

    return ""


df_yakkuncom["form_name_ja"] = df_yakkuncom.apply(
    normalize_form_name_ja, axis="columns"
)


FORM_NAME_YAKKUNCOM_TO_POKEAPI = {
    None: {
        "アローラ": "alola",
        "ガラル": "galar",
        "ヒスイ": "hisui",
        "♂": "male",
        "♀": "female",
        "化身": "incarnate",
        "霊獣": "therian",
        "メガ": "mega",
        "ゲンシ": "primal",
        "パルデア": "paldea",
        "オリジン": "origin",
        "王": "crowned",
        "ブラック": "black",
        "ホワイト": "white",
        "メガX": "mega-x",
        "メガY": "mega-y",
        # ウルトラネクロズマ
        "ウルトラ": "ultra",
        # サトシゲッコウガ
        "サトシ": "ash",
        # ロトム
        "スピン": "fan",
        "フロスト": "frost",
        "ヒート": "heat",
        "カット": "mow",
        "ウォッシュ": "wash",
        "": "",
    },
    "ケンタロス": {
        "パルデア水": "paldea-aqua-breed",
        "パルデア炎": "paldea-blaze-breed",
        "パルデア単": "paldea-combat-breed",
    },
    "デオキシス": {
        "アタック": "attack",
        "ディフェンス": "defense",
        "ノーマル": "normal",
        "スピード": "speed",
    },
    "ミノムッチ": {
        "くさき": "plant",
        "すなち": "sandy",
        "ゴミ": "trash",
    },
    "ミノマダム": {
        "くさき": "plant",
        "すなち": "sandy",
        "ゴミ": "trash",
    },
    "シェイミ": {
        "ランド": "land",
        "スカイ": "sky",
    },
    "ギラティナ": {
        "アナザー": "altered",
        "オリジン": "origin",
    },
    "バスラオ": {
        "青": "blue-striped",
        "赤": "red-striped",
        "白": "white-striped",
    },
    "ヒヒダルマ": {
        "": "standard",
        "ダルマ": "zen",
        "ガラル": "galar-standard",
        "ダルマ・ガラル": "galar-zen",
    },
    "ケルディオ": {
        "いつも": "ordinary",
        "覚悟": "resolute",
    },
    "メロエッタ": {
        "ボイス": "aria",
        "ステップ": "pirouette",
    },
    "ギルガルド": {
        "シールド": "shield",
        "ブレード": "blade",
    },
    "バケッチャ": {
        "普通": "average",
        "小": "small",
        "大": "large",
        "特大": "super",
    },
    "パンプジン": {
        "普通": "average",
        "小": "small",
        "大": "large",
        "特大": "super",
    },
    "ジガルデ": {
        "10%": "10",
        "50%": "50",
        "パーフェクト": "complete",
    },
    "フーパ": {
        "いましめ": "confined",
        "ときはな": "unbound",
    },
    "オドリドリ": {
        "めらめら": "baile",
        "ふらふら": "pau",
        "ぱちぱち": "pom-pom",
        "まいまい": "sensu",
    },
    "ルガルガン": {
        "まひる": "midday",
        "まよなか": "midnight",
        "たそがれ": "dusk",
    },
    "ヨワシ": {
        "群れ": "school",
        "単独": "solo",
    },
    "ミミッキュ": {
        "": "disguised",
    },
    "バドレックス": {
        "はくば": "ice",
        "こくば": "shadow",
    },
    "ネクロズマ": {
        "日食": "dusk",
        "月食": "dawn",
    },
    "ストリンダー": {
        "ハイ": "amped",
        "ロー": "low-key",
    },
    "コオリッポ": {
        "アイス": "ice",
        "ナイス": "noice",
    },
    "ウーラオス": {
        "いちげき": "single-strike",
        "れんげき": "rapid-strike",
    },
    "ムゲンダイナ": {
        "ムゲン": "eternamax",
    },
    "パフュートン": {
        "♂": "male",
        "♀": "female",
    },
    "イルカマン": {
        "ナイーブ": "zero",
        "マイティ": "hero",
    },
    "コレクレー": {
        "とほ": "roaming",
        "はこ": "chest",
    },
    "オーガポン": {
        "いど": "wellspring-mask",
        "かまど": "hearthflame-mask",
        "いしずえ": "cornerstone-mask",
    },
    "ガチグマ": {
        "アカツキ": "bloodmoon",
    },
    "テラパゴス": {
        "テラスタル": "terastal",
        "ステラ": "stellar",
    },
    "メテノ": {
        "コア": "red",
        "流星": "red-meteor",
    },
    "モルペコ": {
        "": "full-belly",
    },
    "イッカネズミ": {
        "": "family-of-four",
    },
    "イキリンコ": {
        "": "green-plumage",
    },
    "シャリタツ": {
        "": "curly",
    },
    "ノココッチ": {
        "": "two-segment",
    },
    "アンノーン": {"": "a"},
    "ガーメイル": {"": "plant"},
    "チェリム": {"": "overcast"},
    "カラナクシ": {"": "west"},
    "トリトドン": {"": "west"},
    "アルセウス": {"": "normal"},
    "シキジカ": {"": "spring"},
    "メブキジカ": {"": "spring"},
    "コフキムシ": {"": "icy-snow"},
    "コフーライ": {"": "icy-snow"},
    "ビビヨン": {"": "meadow"},
    "フラベベ": {"": "red"},
    "フラエッテ": {"": "red"},
    "フラージェス": {"": "red"},
    "トリミアン": {"": "natural"},
    "ゼルネアス": {"": "active"},
    "シルヴァディ": {"": "normal"},
    "ヤバチャ": {"": "phony"},
    "ポットデス": {"": "phony"},
    "マホイップ": {"": "vanilla-cream-strawberry-sweet"},
    "コライドン": {"": "apex-build"},
    "ミライドン": {"": "ultimate-mode"},
    "チャデス": {"": "counterfeit"},
    "ヤバソチャ": {"": "unremarkable"},
}


def translate_form_name_ja(row: pd.Series) -> str:
    if row["name_ja"] in FORM_NAME_YAKKUNCOM_TO_POKEAPI:
        form_name_en = FORM_NAME_YAKKUNCOM_TO_POKEAPI[row["name_ja"]].get(
            row["form_name_ja"], None
        )
        if form_name_en is not None:
            return form_name_en

    if row["form_name_ja"] in FORM_NAME_YAKKUNCOM_TO_POKEAPI[None]:
        return FORM_NAME_YAKKUNCOM_TO_POKEAPI[None].get(row["form_name_ja"], "")

    if row["form_name_ja"]:
        print(
            f"Warning: form_name_ja '{row['form_name_ja']}' for {row['name_ja']} not found in FORM_NAME_YAKKUNCOM_TO_POKEAPI"
        )

    return ""


df_yakkuncom["form_name_en"] = df_yakkuncom.apply(
    translate_form_name_ja, axis="columns"
)


df_yakkuncom.to_csv("./data/yakkuncom_extended.tsv", sep="\t", index=False)
