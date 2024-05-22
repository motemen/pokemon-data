import json
import re
import sys
import unicodedata

with open(sys.argv[1], "r") as file:
    data = json.load(file)


def must_drop_prefix(s, prefix):
    if s == prefix:
        return ""
    if not s.startswith(f"{prefix}-"):
        raise ValueError(f"Expected {s} to start with {prefix}-")
    return s[len(prefix) + 1 :]


output = []
output.append(
    [
        "national_pokedex_number",
        "id",
        "name_ja",
        "name_en",
        "variant",
        "is_default",
        "is_gen9",
    ]
)

for item in data["data"]["species_names"]:
    name_ja = item["name_ja"]
    species = item["species"]
    national_pokedex_number = species["pokedex_numbers"][0]["pokedex_number"]
    is_gen9 = species["gen9_pokedex_aggregate"]["aggregate"]["count"] > 0

    name_root = (
        species["name_en"][0]["name"]
        .lower()
        .replace(" ", "-")
        .replace("♀", "-f")
        .replace("♂", "-m")
    )
    name_root = re.sub("[^a-z0-9-]", "", unicodedata.normalize("NFKD", name_root))

    for pokemon in species["pokemons"]:
        output.append(
            [
                national_pokedex_number,
                pokemon["pokeapi_id"],
                name_ja,
                pokemon["name_en"],
                must_drop_prefix(pokemon["name_en"], name_root),
                1 if pokemon["is_default"] else "",
                1 if is_gen9 else "",
            ]
        )

for line in output:
    print("\t".join(str(x) for x in line))
