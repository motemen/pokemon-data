import { describe, it, expect } from "vitest";
import POKEMON_ALL from "./POKEMON_ALL.json";
import { PokemonDataAll } from "./schema";
import { z } from "zod";

describe("POKEMON_ALL.json フォーム整合性チェック", () => {
  it("pokeapi_form_name と showdown_forme の実質的な不一致がないことを確認", () => {
    const mismatches: Array<{
      index: number;
      national_pokedex_number: number;
      pokeapi_species_id_name: string;
      pokeapi_form_name: string | null;
      showdown_forme: string | null;
    }> = [];

    (POKEMON_ALL as z.TypeOf<typeof PokemonDataAll>).forEach(
      (pokemon, index) => {
        // 両方の値が存在する場合のみチェック
        if (!pokemon.pokeapi_form_name || !pokemon.showdown_forme) {
          return;
        }

        // 正規化: 小文字化、ハイフン削除、シングルクォート削除、スペース削除
        const normalize = (str: string) =>
          str.toLowerCase().replace(/[-'\s]/g, "");

        const pokeapi = normalize(pokemon.pokeapi_form_name);
        const showdown = normalize(pokemon.showdown_forme);

        // 既に一致している場合はスキップ
        if (pokeapi === showdown) {
          return;
        }

        // 性別フォームを無視
        if (
          (pokeapi === "male" && showdown === "m") ||
          (pokeapi === "female" && showdown === "f")
        ) {
          return;
        }

        // Totemフォームを無視
        if (pokeapi.includes("totem") || showdown.includes("totem")) {
          return;
        }

        // ネクロズマ: dusk -> dusk-mane, dawn -> dawn-wings
        if (
          pokemon.pokeapi_species_id_name === "necrozma" &&
          ((pokeapi === "dusk" && showdown === "duskmane") ||
           (pokeapi === "dawn" && showdown === "dawnwings"))
        ) {
          return;
        }

        // ゲッコウガ: battle-bond -> bond
        if (
          pokemon.pokeapi_species_id_name === "greninja" &&
          pokeapi === "battlebond" && showdown === "bond"
        ) {
          return;
        }

        // マウスホールド: family-of-four -> four, family-of-three -> three
        if (
          pokemon.pokeapi_species_id_name === "maushold" &&
          ((pokeapi === "familyoffour" && showdown === "four") ||
           (pokeapi === "familyofthree" && showdown === "three"))
        ) {
          return;
        }

        // オーガポン: *-mask -> マスク名
        if (
          pokemon.pokeapi_species_id_name === "ogerpon" &&
          ((pokeapi === "wellspringmask" && showdown === "wellspring") ||
           (pokeapi === "hearthflamemask" && showdown === "hearthflame") ||
           (pokeapi === "cornerstonemask" && showdown === "cornerstone"))
        ) {
          return;
        }

        // タウロス: paldea-*-breed -> paldea-*
        if (
          pokemon.pokeapi_species_id_name === "tauros" &&
          ((pokeapi === "paldeacombatbreed" && showdown === "paldeacombat") ||
           (pokeapi === "paldeablazebreed" && showdown === "paldeablaze") ||
           (pokeapi === "paldeaaquabreed" && showdown === "paldeaaqua"))
        ) {
          return;
        }

        // ヒヒダルマ: galar-standard -> galar
        if (
          pokemon.pokeapi_species_id_name === "darmanitan" &&
          pokeapi === "galarstandard" && showdown === "galar"
        ) {
          return;
        }

        // アカツキガラス: *-plumage -> 色名
        if (
          pokemon.pokeapi_species_id_name === "squawkabilly" &&
          ((pokeapi === "greenplumage" && showdown === "green") ||
           (pokeapi === "blueplumage" && showdown === "blue") ||
           (pokeapi === "yellowplumage" && showdown === "yellow") ||
           (pokeapi === "whiteplumage" && showdown === "white"))
        ) {
          return;
        }

        // イワンコ: own-tempo -> dusk
        if (
          pokemon.pokeapi_species_id_name === "rockruff" &&
          pokeapi === "owntempo" && showdown === "dusk"
        ) {
          return;
        }

        // ジガルデ: パーセント記号とpower-constructパターンのマッチング
        if (
          pokemon.pokeapi_species_id_name === "zygarde" &&
          ((pokeapi === "50" && showdown === "50%") ||
           (pokeapi === "10powerconstruct" && showdown === "10%") ||
           (pokeapi === "50powerconstruct" && showdown === "50%") ||
           (pokeapi === "10" && showdown === "10%"))
        ) {
          return;
        }

        // メテノ: *meteor -> meteor (一般化)
        if (pokemon.pokeapi_species_id_name === "minior") {
          const pokemonMeteor = pokeapi.replace(/.*meteor/, "meteor");
          if (pokemonMeteor === showdown && showdown === "meteor") {
            return;
          }
        }

        // ストリンダー・ウーラオスのGmaxフォーム: gmax -> 特定フォーム
        if (
          (pokemon.pokeapi_pokemon_id_name === "toxtricity-low-key-gmax" &&
            showdown === "lowkeygmax") ||
          (pokemon.pokeapi_pokemon_id_name === "urshifu-rapid-strike-gmax" &&
            showdown === "rapidstrikegmax")
        ) {
          return;
        }

        // ピカチュウの帽子フォーム: *-cap を削除してマッチング
        if (pokemon.pokeapi_species_id_name === "pikachu") {
          const pokemonPikachu = pokeapi.replace(/cap$/, "");
          if (
            pokemonPikachu === showdown &&
            pokemon.national_pokedex_number === 25
          ) {
            return;
          }
        }

        // マホミル: *-strawberry-sweet を削除してマッチング
        if (pokemon.pokeapi_species_id_name === "alcremie") {
          const pokemonAlcremie = pokeapi.replace(/strawberrysweet$/, "");
          if (pokemonAlcremie === showdown) {
            return;
          }
        }

        // 上記の例外に該当しない実質的な不一致を記録
        mismatches.push({
          index,
          national_pokedex_number: pokemon.national_pokedex_number,
          pokeapi_species_id_name: pokemon.pokeapi_species_id_name,
          pokeapi_form_name: pokemon.pokeapi_form_name,
          showdown_forme: pokemon.showdown_forme,
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
            `PokéAPI: "${mismatch.pokeapi_form_name}" vs Showdown: "${mismatch.showdown_forme}"`
        );
      });
    }

    expect(mismatches).toHaveLength(0);
  });
});
