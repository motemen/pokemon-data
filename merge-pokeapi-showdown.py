import pandas as pd

# Input:
# - ./data/pokeapi.tsv
# - ./data/showdown.tsv
# Output:
# - ./data/merged/pokeapi_showdown.tsv

df_pokeapi = pd.read_csv("./data/pokeapi.tsv", sep="\t")
df_showdown = pd.read_csv("./data/showdown.tsv", sep="\t")

# Convert form_order to int in showdown data
df_showdown["form_order"] = df_showdown["form_order"].astype(int)

df_pokeapi["_is_gmax"] = df_pokeapi["form_name"] == "gmax"
df_showdown["_is_gmax"] = df_showdown["forme"] == "Gmax"

# Create _crafted_form_order from form_order
df_pokeapi["_crafted_form_order"] = df_pokeapi["form_order"]
# Reverse form_order for maushold
maushold_mask = df_pokeapi["national_pokedex_number"] == 925
df_pokeapi.loc[maushold_mask, "_crafted_form_order"] = (
    3 - df_pokeapi.loc[maushold_mask, "form_order"]
)

# TODO:
# - pikachu
# - flabebe, floette, florges: fix showdown
#   form order: [red, yellow, orange, blue, white, (eternal)]
# - maushold: fix pokeapi
#   1: family-of-3
#   2: family-of-4

df_merged = pd.merge(
    df_pokeapi,
    df_showdown,
    how="left",
    left_on=["national_pokedex_number", "_is_gmax", "_crafted_form_order"],
    right_on=["national_pokedex_number", "_is_gmax", "form_order"],
)

# df_showdown にあって df_merged にない行をチェックする
# id_name でチェック
df_showdown_missing = df_showdown[~df_showdown["id_name"].isin(df_merged["id_name"])]
if not df_showdown_missing.empty:
    print("Warning: Some entries in showdown.tsv are missing in the merged result:")
    print(df_showdown_missing)

df_merged.drop(columns=["_is_gmax", "_crafted_form_order"], inplace=True)

df_merged.to_csv(
    "./data/merged/pokeapi_showdown.tsv",
    sep="\t",
    index=False,
)

# Sanity check: maushold form names should match
maushold_merged = df_merged[df_merged["national_pokedex_number"] == 925]
for _, row in maushold_merged.iterrows():
    pokeapi_form = row["form_name"]
    showdown_form = row["forme"]

    expected_mapping = {"family-of-four": "Four", "family-of-three": "Three"}

    if pokeapi_form in expected_mapping:
        expected_showdown = expected_mapping[pokeapi_form]
        if showdown_form != expected_showdown:
            print(
                f"Warning: Maushold form mismatch - PokéAPI: {pokeapi_form}, Showdown: {showdown_form} (expected: {expected_showdown})"
            )
        else:
            print(f"OK: Maushold {pokeapi_form} -> {showdown_form}")
    else:
        print(f"Warning: Unknown maushold form in PokéAPI: {pokeapi_form}")
