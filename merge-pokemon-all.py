#!/usr/bin/env python3
"""
ポケモン統合データ作成スクリプト
data/merged/pokeapi_showdown.tsv と data/merged/pokeapi_yakkuncom.tsv を
pokeapi_form_id をプライマリキーにしてJOINし、POKEMON_ALL.tsv と POKEMON_ALL.json を生成する
"""

import argparse
import sys
import pandas as pd


def main():
    parser = argparse.ArgumentParser(description="Merge Pokemon data files")
    parser.add_argument("--out-tsv", default="POKEMON_ALL.tsv", help="Output TSV file")
    parser.add_argument(
        "--out-json", default="POKEMON_ALL.json", help="Output JSON file"
    )
    parser.add_argument(
        "--repl", action="store_true", help="Start REPL after processing"
    )
    args = parser.parse_args()

    # データファイルを読み込み
    print("Loading data files...", file=sys.stderr)
    df_showdown = pd.read_csv("data/merged/pokeapi_showdown.tsv", sep="\t")
    df_yakkuncom = pd.read_csv("data/merged/pokeapi_yakkuncom.tsv", sep="\t")

    print(f"Loaded {len(df_showdown)} rows from pokeapi_showdown.tsv", file=sys.stderr)
    print(
        f"Loaded {len(df_yakkuncom)} rows from pokeapi_yakkuncom.tsv", file=sys.stderr
    )

    # pokeapi_*カラムが同一であることを確認
    pokeapi_columns = ["national_pokedex_number"] + [col for col in df_showdown.columns if col.startswith("pokeapi_")]

    print("Checking if pokeapi_* columns match...", file=sys.stderr)
    for col in pokeapi_columns:
        if col not in df_yakkuncom.columns:
            print(f"ERROR: Column {col} missing in yakkuncom file", file=sys.stderr)
            sys.exit(1)

    # pokeapi_form_idをキーにしてマージ
    print("Merging on pokeapi_form_id...", file=sys.stderr)

    # showdownファイルからpokeapi_*カラムとshowdown_*カラムを取得
    showdown_columns = pokeapi_columns + [
        col for col in df_showdown.columns if col.startswith("showdown_")
    ]
    df_showdown_subset = df_showdown[showdown_columns]

    # yakkuncomファイルからyakkuncom_*カラムを取得（pokeapi_form_idは両方にある）
    yakkuncom_columns = ["pokeapi_form_id"] + [
        col for col in df_yakkuncom.columns if col.startswith("yakkuncom_")
    ]
    df_yakkuncom_subset = df_yakkuncom[yakkuncom_columns]

    # pokeapi_form_idをキーにしてOUTER JOIN
    df_merged = pd.merge(
        df_showdown_subset,
        df_yakkuncom_subset,
        on="pokeapi_form_id",
        how="outer",
        suffixes=("", "_duplicate"),
    )

    print(f"Merged result: {len(df_merged)} rows", file=sys.stderr)

    # カラム順序を整理
    column_order = []
    # pokeapi_* カラム
    column_order.extend(pokeapi_columns)
    # showdown_* カラム
    column_order.extend(
        [col for col in df_merged.columns if col.startswith("showdown_")]
    )
    # yakkuncom_* カラム
    column_order.extend(
        [col for col in df_merged.columns if col.startswith("yakkuncom_")]
    )

    df_merged = df_merged.reindex(columns=column_order)

    # マッチしなかった行を報告
    no_showdown_match = df_merged[df_merged["showdown_name"].isnull()]
    no_yakkuncom_match = df_merged[df_merged["yakkuncom_name"].isnull()]

    if len(no_showdown_match) > 0:
        print(
            f"WARNING: {len(no_showdown_match)} rows have no Showdown match",
            file=sys.stderr,
        )

    if len(no_yakkuncom_match) > 0:
        print(
            f"WARNING: {len(no_yakkuncom_match)} rows have no yakkuncom match",
            file=sys.stderr,
        )

    if args.repl:
        import code

        code.interact(local=locals())

    # ファイル出力
    print(f"Writing {args.out_tsv}...", file=sys.stderr)
    df_merged.to_csv(args.out_tsv, sep="\t", index=False)

    print(f"Writing {args.out_json}...", file=sys.stderr)
    df_merged.to_json(args.out_json, orient="records", indent=2, force_ascii=False)

    print("Done!", file=sys.stderr)


if __name__ == "__main__":
    main()
