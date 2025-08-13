import { Dex } from "@pkmn/dex";

console.log(
  [
    "national_pokedex_number",
    "form_order",
    "name",
    "id_name",
    "base_species",
    "forme",
  ].join("\t")
);

Dex.species.all().forEach((spec) => {
  if (["CAP", "Pokestar", "Custom"].includes(spec.isNonstandard!)) {
    return;
  }
  if (spec.baseSpecies !== spec.name && !/Gmax/.test(spec.forme)) {
    return;
  }

  (spec.formeOrder?.map((f) => Dex.species.get(f)) ?? [spec]).forEach(
    (spec, formOrder) => {
      console.log(
        [
          spec.num,
          formOrder + 1,
          spec.name,
          spec.id,
          spec.baseSpecies,
          spec.forme || spec.baseForme,
        ].join("\t")
      );
    }
  );
});
