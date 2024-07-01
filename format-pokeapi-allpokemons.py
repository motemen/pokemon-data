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
        "species_name_ja",
        "name_en",
        "variant",
        "form_name_ja",
        "is_default",
    ]
)

for item in data["data"]["species_names"]:
    species = item["species"]
    national_pokedex_number = species["pokedex_numbers"][0]["pokedex_number"]

    name_root = (
        species["name"][0]["name"]
        .lower()
        .replace(" ", "-")
        .replace("♀", "-f")
        .replace("♂", "-m")
    )
    name_root = re.sub("[^a-z0-9-]", "", unicodedata.normalize("NFKD", name_root))

    def pokemon_form_name_ja(pokemon):
        d = pokemon
        for key in ["forms", 0, "form_names_ja", 0, "name"]:
            try:
                d = d[key]
            except (KeyError, IndexError):
                d = None
            if d is None:
                return None
        return d

    for pokemon in species["pokemons"]:
        output.append(
            [
                national_pokedex_number,
                pokemon["pokeapi_id"],
                item["species_name_ja"],
                pokemon["name_en"],
                must_drop_prefix(pokemon["name_en"], name_root),
                pokemon_form_name_ja(pokemon) or "",
                1 if pokemon["is_default"] else "",
            ]
        )

for line in output:
    print("\t".join(str(x) for x in line))
