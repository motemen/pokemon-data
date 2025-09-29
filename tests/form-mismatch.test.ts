import { describe, it, expect } from "vitest";
import POKEMON_ALL from "./POKEMON_ALL.json";
import { PokemonDataAll } from "./schema";
import { z } from "zod";

describe("POKEMON_ALL.json フォーム整合性チェック", () => {
  it("pokeapi_form_name と pkmn_forme の実質的な不一致がないことを確認", () => {
    const mismatches: Array<{
      index: number;
      national_pokedex_number: number;
      pokeapi_species_id_name: string;
      pokeapi_form_name: string | null;
      pkmn_forme: string | null;
    }> = [];

    (POKEMON_ALL as z.TypeOf<typeof PokemonDataAll>).forEach(
      (pokemon, index) => {
        // 両方の値が存在する場合のみチェック
        if (!pokemon.pokeapi_form_name || !pokemon.pkmn_forme) {
          return;
        }

        // 正規化: 小文字化、ハイフン削除、シングルクォート削除、スペース削除
        const normalize = (str: string) =>
          str.toLowerCase().replace(/[-'\s]/g, "");

        const pokeapi = normalize(pokemon.pokeapi_form_name);
        const pkmn = normalize(pokemon.pkmn_forme);

        // 既に一致している場合はスキップ
        if (pokeapi === pkmn) {
          return;
        }

        // 性別フォームを無視
        if (
          (pokeapi === "male" && pkmn === "m") ||
          (pokeapi === "female" && pkmn === "f")
        ) {
          return;
        }

        // Totemフォームを無視
        if (pokeapi.includes("totem") || pkmn.includes("totem")) {
          return;
        }

        // ネクロズマ: dusk -> dusk-mane, dawn -> dawn-wings
        if (
          pokemon.pokeapi_species_id_name === "necrozma" &&
          ((pokeapi === "dusk" && pkmn === "duskmane") ||
           (pokeapi === "dawn" && pkmn === "dawnwings"))
        ) {
          return;
        }

        // ゲッコウガ: battle-bond -> bond
        if (
          pokemon.pokeapi_species_id_name === "greninja" &&
          pokeapi === "battlebond" && pkmn === "bond"
        ) {
          return;
        }

        // マウスホールド: family-of-four -> four, family-of-three -> three
        if (
          pokemon.pokeapi_species_id_name === "maushold" &&
          ((pokeapi === "familyoffour" && pkmn === "four") ||
           (pokeapi === "familyofthree" && pkmn === "three"))
        ) {
          return;
        }

        // オーガポン: *-mask -> マスク名
        if (
          pokemon.pokeapi_species_id_name === "ogerpon" &&
          ((pokeapi === "wellspringmask" && pkmn === "wellspring") ||
           (pokeapi === "hearthflamemask" && pkmn === "hearthflame") ||
           (pokeapi === "cornerstonemask" && pkmn === "cornerstone"))
        ) {
          return;
        }

        // タウロス: paldea-*-breed -> paldea-*
        if (
          pokemon.pokeapi_species_id_name === "tauros" &&
          ((pokeapi === "paldeacombatbreed" && pkmn === "paldeacombat") ||
           (pokeapi === "paldeablazebreed" && pkmn === "paldeablaze") ||
           (pokeapi === "paldeaaquabreed" && pkmn === "paldeaaqua"))
        ) {
          return;
        }

        // ヒヒダルマ: galar-standard -> galar
        if (
          pokemon.pokeapi_species_id_name === "darmanitan" &&
          pokeapi === "galarstandard" && pkmn === "galar"
        ) {
          return;
        }

        // アカツキガラス: *-plumage -> 色名
        if (
          pokemon.pokeapi_species_id_name === "squawkabilly" &&
          ((pokeapi === "greenplumage" && pkmn === "green") ||
           (pokeapi === "blueplumage" && pkmn === "blue") ||
           (pokeapi === "yellowplumage" && pkmn === "yellow") ||
           (pokeapi === "whiteplumage" && pkmn === "white"))
        ) {
          return;
        }

        // イワンコ: own-tempo -> dusk
        if (
          pokemon.pokeapi_species_id_name === "rockruff" &&
          pokeapi === "owntempo" && pkmn === "dusk"
        ) {
          return;
        }

        // ジガルデ: パーセント記号とpower-constructパターンのマッチング
        if (
          pokemon.pokeapi_species_id_name === "zygarde" &&
          ((pokeapi === "50" && pkmn === "50%") ||
           (pokeapi === "10powerconstruct" && pkmn === "10%") ||
           (pokeapi === "50powerconstruct" && pkmn === "50%") ||
           (pokeapi === "10" && pkmn === "10%"))
        ) {
          return;
        }

        // メテノ: *meteor -> meteor (一般化)
        if (pokemon.pokeapi_species_id_name === "minior") {
          const pokemonMeteor = pokeapi.replace(/.*meteor/, "meteor");
          if (pokemonMeteor === pkmn && pkmn === "meteor") {
            return;
          }
        }

        // ストリンダー・ウーラオスのGmaxフォーム: gmax -> 特定フォーム
        if (
          (pokemon.pokeapi_pokemon_id_name === "toxtricity-low-key-gmax" &&
            pkmn === "lowkeygmax") ||
          (pokemon.pokeapi_pokemon_id_name === "urshifu-rapid-strike-gmax" &&
            pkmn === "rapidstrikegmax")
        ) {
          return;
        }

        // ピカチュウの帽子フォーム: *-cap を削除してマッチング
        if (pokemon.pokeapi_species_id_name === "pikachu") {
          const pokemonPikachu = pokeapi.replace(/cap$/, "");
          if (
            pokemonPikachu === pkmn &&
            pokemon.national_pokedex_number === 25
          ) {
            return;
          }
        }

        // マホミル: *-strawberry-sweet を削除してマッチング
        if (pokemon.pokeapi_species_id_name === "alcremie") {
          const pokemonAlcremie = pokeapi.replace(/strawberrysweet$/, "");
          if (pokemonAlcremie === pkmn) {
            return;
          }
        }

        // 上記の例外に該当しない実質的な不一致を記録
        mismatches.push({
          index,
          national_pokedex_number: pokemon.national_pokedex_number,
          pokeapi_species_id_name: pokemon.pokeapi_species_id_name,
          pokeapi_form_name: pokemon.pokeapi_form_name,
          pkmn_forme: pokemon.pkmn_forme,
        });
      }
    );

    if (mismatches.length > 0) {
      console.log("フォーム名の不一致が見つかりました:");
      mismatches.forEach((mismatch) => {
        console.log(
          `行${mismatch.index + 1}: #${mismatch.national_pokedex_number} ${
            mismatch.pokeapi_species_id_name
          } - ` +
            `PokéAPI: "${mismatch.pokeapi_form_name}" vs PKMN: "${mismatch.pkmn_forme}"`
        );
      });
    }

    expect(mismatches).toHaveLength(0);
  });
});
