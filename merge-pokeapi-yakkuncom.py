import pandas as pd

# Input:
# - ./data/pokeapi.tsv
# - ./data/yakkuncom_extended.tsv
# Output:
# - ./data/merged/pokeapi_yakkuncom.tsv

# Read in the first file
df_pokeapi = pd.read_csv("./data/pokeapi.tsv", sep="\t")
df_yakkuncom = pd.read_csv("./data/yakkuncom_extended.tsv", sep="\t")


def rename_pokeapi_column(name: str) -> str:
    if name == "national_pokedex_number":
        return name
    return f"pokeapi_{name}"


df_pokeapi.rename(columns=rename_pokeapi_column, inplace=True)

df_yakkuncom.rename(
    columns={
        "id": "yakkuncom_id",
        "name_ja": "yakkuncom_name",
        "form_name_ja": "yakkuncom_form_name",
        "form_name_en": "_yakkuncom_form_name_en",  # transient
    },
    inplace=True,
)

df_merged = pd.merge(
    df_pokeapi,
    df_yakkuncom,
    how="left",
    left_on=["national_pokedex_number", "pokeapi_form_name"],
    right_on=["national_pokedex_number", "_yakkuncom_form_name_en"],
)

df_merged.drop(columns=["_yakkuncom_form_name_en"], inplace=True)

# df_yakkuncom にあって、df_merged にない行をチェックする
# yakkuncom_id (id) でチェック
df_yakkuncom_missing = df_yakkuncom[
    ~df_yakkuncom["yakkuncom_id"].isin(df_merged["yakkuncom_id"])
]
if not df_yakkuncom_missing.empty:
    df_pokeapi_missing = df_pokeapi[
        df_pokeapi["national_pokedex_number"].isin(
            df_yakkuncom_missing["national_pokedex_number"]
        )
    ]
    df_missing_merged = pd.merge(
        df_yakkuncom_missing,
        df_pokeapi_missing.groupby("national_pokedex_number").agg(
            {"pokeapi_form_name": lambda x: x.iloc[0]}
        ),
        how="left",
        left_on=["national_pokedex_number"],
        right_on=["national_pokedex_number"],
    )
    print("Merged data for missing entries:")
    print(df_missing_merged[["yakkuncom_name", "pokeapi_form_name"]])

df_merged.to_csv(
    "./data/merged/pokeapi_yakkuncom.tsv",
    sep="\t",
    index=False,
)
