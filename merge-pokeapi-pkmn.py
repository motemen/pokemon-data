import pandas as pd

# Input:
# - ./data/pokeapi.tsv
# - ./data/pkmn.tsv
# Output:
# - ./data/merged/pokeapi_pkmn.tsv

df_pokeapi = pd.read_csv("./data/pokeapi.tsv", sep="\t")
df_pkmn = pd.read_csv("./data/pkmn.tsv", sep="\t")

df_pokeapi["_is_gmax"] = df_pokeapi["form_name"] == "gmax"
df_pkmn["_is_gmax"] = (df_pkmn["forme"] == "Gmax") | (
    df_pkmn["forme"].str.endswith("-Gmax")
)

# Create _crafted_form_order from form_order
df_pokeapi["_crafted_form_order"] = df_pokeapi["form_order"]
# Map maushold form_order based on form_name for robust handling
maushold_mask = df_pokeapi["national_pokedex_number"] == 925
df_pokeapi.loc[maushold_mask, "_crafted_form_order"] = df_pokeapi.loc[
    maushold_mask, "form_name"
].map({"family-of-four": 2, "family-of-three": 1})

# Pikachu
#  formeOrder: [
#    'Pikachu',           'Pikachu-Original',
#    'Pikachu-Hoenn',     'Pikachu-Sinnoh',
#    'Pikachu-Unova',     'Pikachu-Kalos',
#    'Pikachu-Alola',     'Pikachu-Partner',
#    'Pikachu-Starter',   'Pikachu-World',
#    'Pikachu-Rock-Star', 'Pikachu-Belle',
#    'Pikachu-Pop-Star',  'Pikachu-PhD',
#    'Pikachu-Libre',     'Pikachu-Cosplay'
#  ],
# Fix Pikachu form_order to match the specified formeOrder
pikachu_forme_order = [
    "",
    "original-cap",
    "hoenn-cap",
    "sinnoh-cap",
    "unova-cap",
    "kalos-cap",
    "alola-cap",
    "partner-cap",
    "starter",
    "world-cap",
    "rock-star",
    "belle",
    "pop-star",
    "phd",
    "libre",
    "cosplay",
]
pikachu_mask = df_pokeapi["national_pokedex_number"] == 25
for i, forme in enumerate(pikachu_forme_order, 1):
    mask = pikachu_mask & (df_pokeapi["form_name"].str.lower() == forme.lower())
    df_pokeapi.loc[mask, "_crafted_form_order"] = i

# Create _crafted_form_order for pkmn data
df_pkmn["_crafted_form_order"] = df_pkmn["form_order"]
# Fix flabebe, floette, florges form_order to [red, yellow, orange, blue, white, eternal]
flabebe_family = df_pkmn["national_pokedex_number"].isin(
    [669, 670, 671]
)  # flabebe, floette, florges
flabebe_forme_order_mapping = ["Red", "Yellow", "Orange", "Blue", "White", "Eternal"]
for i, forme in enumerate(flabebe_forme_order_mapping, 1):
    mask = flabebe_family & (df_pkmn["forme"] == forme)
    df_pkmn.loc[mask, "_crafted_form_order"] = i

# 892 (Urshifu) Gmax Rapid: _crafted_form_order = 2 if form includes "rapid" (case-insensitive)
urshifu_gmax_rapid_mask_pokeapi = (
    (df_pokeapi["national_pokedex_number"] == 892)
    & df_pokeapi["_is_gmax"]
    & (df_pokeapi["form_id_name"] == "urshifu-rapid-strike-gmax")
)
df_pokeapi.loc[urshifu_gmax_rapid_mask_pokeapi, "_crafted_form_order"] = 2

urshifu_gmax_rapid_mask_pkmn = (
    (df_pkmn["national_pokedex_number"] == 892)
    & df_pkmn["_is_gmax"]
    & (df_pkmn["forme"] == "Rapid-Strike-Gmax")
)
df_pkmn.loc[urshifu_gmax_rapid_mask_pkmn, "_crafted_form_order"] = 2

# 849 (Toxtricity) Gmax Low-Key: _crafted_form_order = 2 if form includes "low-key" (case-insensitive)
toxtricity_gmax_lowkey_mask_pokeapi = (
    (df_pokeapi["national_pokedex_number"] == 849)
    & df_pokeapi["_is_gmax"]
    & (df_pokeapi["form_id_name"] == "toxtricity-low-key-gmax")
)
df_pokeapi.loc[toxtricity_gmax_lowkey_mask_pokeapi, "_crafted_form_order"] = 2

toxtricity_gmax_lowkey_mask_pkmn = (
    (df_pkmn["national_pokedex_number"] == 849)
    & df_pkmn["_is_gmax"]
    & (df_pkmn["forme"] == "Low-Key-Gmax")
)
df_pkmn.loc[toxtricity_gmax_lowkey_mask_pkmn, "_crafted_form_order"] = 2


def rename_pokeapi_column(name: str) -> str:
    if name == "national_pokedex_number":
        return name
    if name.startswith("_"):
        return name
    return f"pokeapi_{name}"


df_pokeapi.rename(columns=rename_pokeapi_column, inplace=True)


def rename_pkmn_column(name: str) -> str:
    if name == "national_pokedex_number":
        return name
    if name.startswith("_"):
        return name
    return f"pkmn_{name}"


df_pkmn.rename(columns=rename_pkmn_column, inplace=True)

df_merged = pd.merge(
    df_pokeapi,
    df_pkmn,
    how="left",
    left_on=["national_pokedex_number", "_is_gmax", "_crafted_form_order"],
    right_on=["national_pokedex_number", "_is_gmax", "_crafted_form_order"],
)

# df_pkmn にあって df_merged にない行をチェックする
# id_name でチェック
df_pkmn_missing = df_pkmn[
    ~df_pkmn["pkmn_id_name"].isin(df_merged["pkmn_id_name"])
]
if not df_pkmn_missing.empty:
    print("Warning: Some entries in pkmn.tsv are missing in the merged result:")
    print(df_pkmn_missing)

df_merged.drop(columns=["_is_gmax", "_crafted_form_order"], inplace=True)


# Convert form_order to int in pkmn data
df_merged["pkmn_form_order"] = df_merged["pkmn_form_order"].astype("Int64")


df_merged.to_csv(
    "./data/merged/pokeapi_pkmn.tsv",
    sep="\t",
    index=False,
)

# Sanity check: maushold form names should match
maushold_merged = df_merged[df_merged["national_pokedex_number"] == 925]
for _, row in maushold_merged.iterrows():
    pokeapi_form = row["pokeapi_form_name"]
    pkmn_form = row["pkmn_forme"]

    expected_mapping = {"family-of-four": "Four", "family-of-three": "Three"}

    if pokeapi_form in expected_mapping:
        expected_pkmn = expected_mapping[pokeapi_form]
        if pkmn_form != expected_pkmn:
            print(
                f"Warning: Maushold form mismatch - PokéAPI: {pokeapi_form}, PKMN: {pkmn_form} (expected: {expected_pkmn})"
            )
        else:
            print(f"OK: Maushold {pokeapi_form} -> {pkmn_form}")
    else:
        print(f"Warning: Unknown maushold form in PokéAPI: {pokeapi_form}")

# Sanity check: flabebe family form names should match expected order
flabebe_family_merged = df_merged[
    df_merged["national_pokedex_number"].isin([669, 670, 671])
]

for _, row in flabebe_family_merged.iterrows():
    if pd.notna(row["pkmn_forme"]):  # Skip rows where pkmn data is missing
        pokeapi_form = row["pokeapi_form_name"]
        pkmn_form = row["pkmn_forme"]

        if pokeapi_form.lower() == pkmn_form.lower():
            print(f"OK: {row['pkmn_name']} {pokeapi_form} -> {pkmn_form}")
        else:
            print(
                f"Warning: {row['pkmn_name']} form mismatch - PokéAPI: {pokeapi_form}, PKMN: {pkmn_form}"
            )
    else:
        print(
            f"Info: Flabebe family PokéAPI form {row['pokeapi_form_name']} has no PKMN match"
        )
