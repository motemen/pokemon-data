#!/usr/bin/env tsx
/**
 * @pkmn/dataを使用してPokéAPIのIDからPokemon ShowdownのIDへのマッピングファイルを生成
 */

import { readFileSync, writeFileSync } from 'fs';
import { Generations } from '@pkmn/data';
import { Dex } from '@pkmn/dex';

// Dexインスタンスを作成してGenerationsに渡す
const generations = new Generations(Dex);
// 最新世代のデータを取得
const gen = generations.get(9);

interface PokemonEntry {
  pokeapi_id: number;
  pokeapi_name: string;
  pokeapi_form_name_ja: string | null;
}

interface PkmnMapping {
  pokeapi_id: number;
  pkmn_id: string | null;
  pkmn_name: string | null;
}

/**
 * PokéAPIのフォルム名からPokemon Showdownのフォルム接尾辞へのマッピング
 */
const FORM_MAPPING: Record<string, string> = {
  // リージョンフォーム
  "アローラのすがた": "alola",
  "ガラルのすがた": "galar", 
  "ヒスイのすがた": "hisui",
  "パルデアのすがた": "paldea",
  
  // メガシンカ
  "メガフシギバナ": "mega",
  "メガリザードンＸ": "megax",
  "メガリザードンＹ": "megay",
  "メガカメックス": "mega",
  "メガスピアー": "mega",
  "メガピジョット": "mega",
  "メガフーディン": "mega",
  "メガヤドラン": "mega",
  "メガゲンガー": "mega",
  "メガガルーラ": "mega",
  "メガカイロス": "mega",
  "メガギャラドス": "mega",
  "メガプテラ": "mega",
  "メガミュウツーＸ": "megax",
  "メガミュウツーＹ": "megay",
  "メガデンリュウ": "mega",
  "メガハガネール": "mega",
  "メガハッサム": "mega",
  "メガヘラクロス": "mega",
  "メガヘルガー": "mega",
  "メガバンギラス": "mega",
  "メガジュカイン": "mega",
  "メガバシャーモ": "mega",
  "メガラグラージ": "mega",
  "メガサーナイト": "mega",
  "メガヤミラミ": "mega",
  "メガクチート": "mega",
  "メガボスゴドラ": "mega",
  "メガチャーレム": "mega",
  "メガライボルト": "mega",
  "メガサメハダー": "mega",
  "メガバクーダ": "mega",
  "メガチルタリス": "mega",
  "メガジュペッタ": "mega",
  "メガアブソル": "mega",
  "メガオニゴーリ": "mega",
  "メガボーマンダ": "mega",
  "メガメタグロス": "mega",
  "メガラティアス": "mega",
  "メガラティオス": "mega",
  "メガレックウザ": "mega",
  "メガミミロップ": "mega",
  "メガガブリアス": "mega",
  "メガルカリオ": "mega",
  "メガユキノオー": "mega",
  "メガエルレイド": "mega",
  "メガタブンネ": "mega",
  "メガディアンシー": "mega",
  
  // ゲンシカイキ
  "ゲンシカイキのすがた": "primal",
  
  // その他特殊フォーム
  "ムゲンダイマックス": "eternamax",
  
  // ピカチュウキャップシリーズ
  "オリジナルキャップ": "original",
  "ホウエンキャップ": "hoenn",
  "シンオウキャップ": "sinnoh",
  "イッシュキャップ": "unova",
  "カロスキャップ": "kalos",
  "アローラキャップ": "alola",
  "キミにきめたキャップ": "partner",
  "ワールドキャップ": "world",
  
  // コスプレピカチュウ
  "おきがえピカチュウ": "cosplay",
  "ハードロック・ピカチュウ": "rockstar",
  "アイドル・ピカチュウ": "popstar",
  "マダム・ピカチュウ": "belle",
  "ドクター・ピカチュウ": "phd",
  "マスクド・ピカチュウ": "libre",
  
  // ロトムフォルム
  "ヒートロトム": "heat",
  "ウォッシュロトム": "wash",
  "フロストロトム": "frost",
  "スピンロトム": "fan",
  "カットロトム": "mow",
  
  // デオキシスフォルム
  "アタックフォルム": "attack",
  "ディフェンスフォルム": "defense", 
  "スピードフォルム": "speed",
  
  // その他のフォルム
  "オスのすがた": "m",
  "メスのすがた": "f",
  "シールドフォルム": "shield",
  "ブレードフォルム": "blade",
  "ちいさいサイズ": "small",
  "ふつうのサイズ": "average",
  "おおきいサイズ": "large",
  "とくだいサイズ": "super",
  "１０％フォルム": "10",
  "５０％フォルム": "50",
  "パーフェクトフォルム": "complete",
  "いましめられしフーパ": "confined",
  "ときはなたれしフーパ": "unbound",
  "めらめらスタイル": "baile",
  "ぱちぱちスタイル": "pompom",
  "ふらふらスタイル": "pau",
  "まいまいスタイル": "sensu",
  "まひるのすがた": "midday",
  "まよなかのすがた": "midnight",
  "たそがれのすがた": "dusk",
  "たんどくのすがた": "solo",
  "むれたすがた": "school",
  "ばけたすがた": "disguised",
  "ばれたすがた": "busted",
  "ハイなすがた": "amped",
  "ローなすがた": "lowkey",
  "アイスフェイス": "ice",
  "ナイスフェイス": "noice",
  "まんぷくもよう": "fullbelly",
  "はらぺこもよう": "hangry",
  "れきせんのゆうしゃ": "hero",
  "けんのおう": "crowned",
  "たてのおう": "crowned",
  "いちげきのかた": "singlestrike",
  "れんげきのかた": "rapidstrike",
  "とうちゃん": "dada",
  "こくばじょうのすがた": "shadow",
  "はくばじょうのすがた": "ice",
  "アカツキ": "bloodmoon",
  "４ひきかぞく": "fourthreesome", 
  "３びきかぞく": "threesome",
  "グリーンフェザー": "green",
  "ブルーフェザー": "blue",
  "ホワイトフェザー": "white", 
  "イエローフェザー": "yellow",
  "ナイーブフォルム": "zero",
  "マイティフォルム": "hero",
  "そったすがた": "curly",
  "たれたすがた": "droopy",
  "のびたすがた": "stretchy",
  "ふたふしフォルム": "twosegment",
  "みつふしフォルム": "threesegment",
  "はこフォルム": "chest",
  "とほフォルム": "roaming",
  "せいげんけいたい": "limited",
  "しっそうけいたい": "sprinting",
  "ゆうえいけいたい": "swimming",
  "かっくうけいたい": "gliding",
  "リミテッドモード": "lowpower",
  "ドライブモード": "drive",
  "フロートモード": "aquatic",
  "グライドモード": "glide",
  "マガイモノのすがた": "unremarkable",
  "ボンサクのすがた": "masterpiece",
  "みどりのめん": "tealmask",
  "いしずえのめん": "cornerstonemask",
  "いどのめん": "wellspringmask", 
  "かまどのめん": "hearthflamemask",
  "テラスタルフォルム": "terastal",
  "ステラフォルム": "stellar",
};

/**
 * PokéAPIの名前とフォルムからPokemon ShowdownのIDを生成
 */
function generatePkmnId(pokeapiName: string, formNameJa: string | null): string {
  if (!formNameJa) {
    return pokeapiName;
  }
  
  // 完全一致を先に確認
  if (formNameJa in FORM_MAPPING) {
    const formSuffix = FORM_MAPPING[formNameJa];
    return `${pokeapiName}${formSuffix}`;
  }
  
  // 部分一致で推測
  if (formNameJa.includes("メガ")) {
    if (formNameJa.includes("Ｘ") || formNameJa.includes("X")) {
      return `${pokeapiName}megax`;
    } else if (formNameJa.includes("Ｙ") || formNameJa.includes("Y")) {
      return `${pokeapiName}megay`;
    } else {
      return `${pokeapiName}mega`;
    }
  } else if (formNameJa.includes("ゲンシカイキ")) {
    return `${pokeapiName}primal`;
  } else if (formNameJa.includes("アローラ")) {
    return `${pokeapiName}alola`;
  } else if (formNameJa.includes("ガラル")) {
    return `${pokeapiName}galar`;
  } else if (formNameJa.includes("ヒスイ")) {
    return `${pokeapiName}hisui`;
  } else if (formNameJa.includes("パルデア")) {
    return `${pokeapiName}paldea`;
  }
  
  // 不明なフォルムは基本形を返す
  return pokeapiName;
}

/**
 * メイン関数
 */
function main() {
  // コマンドライン引数からファイル名を取得（デフォルトはPOKEMON_ALL.json）
  const inputFile = process.argv[2] || 'POKEMON_ALL.json';
  
  // 既存のPOKEMON_ALL.jsonからPokéAPIのエントリを読み込み
  const pokemonAllJson = readFileSync(inputFile, 'utf-8');
  const pokemonAll: PokemonEntry[] = JSON.parse(pokemonAllJson);
  
  console.log(`Loaded ${pokemonAll.length} Pokemon entries from ${inputFile}`);
  
  // マッピングを生成
  const mappings: PkmnMapping[] = [];
  let successCount = 0;
  
  for (const entry of pokemonAll) {
    const pkmnId = generatePkmnId(entry.pokeapi_name, entry.pokeapi_form_name_ja);
    
    // Pokemon Showdownにそのポケモンが存在するかチェック
    let pkmnName: string | null = null;
    try {
      const species = gen.species.get(pkmnId);
      if (species) {
        pkmnName = species.name;
        successCount++;
      }
    } catch (error) {
      // ポケモンが見つからない場合は無視
    }
    
    mappings.push({
      pokeapi_id: entry.pokeapi_id,
      pkmn_id: pkmnName ? pkmnId : null,
      pkmn_name: pkmnName,
    });
  }
  
  console.log(`Successfully mapped ${successCount}/${pokemonAll.length} entries`);
  
  // TSVファイルとして出力
  const tsvLines = [
    'pokeapi_id\tpkmn_id\tpkmn_name', // ヘッダー
    ...mappings.map(m => `${m.pokeapi_id}\t${m.pkmn_id || ''}\t${m.pkmn_name || ''}`)
  ];
  
  const tsvContent = tsvLines.join('\n');
  writeFileSync('pkmn-mapping.tsv', tsvContent, 'utf-8');
  
  console.log('Generated pkmn-mapping.tsv');
  console.log(`Sample entries:`);
  mappings.filter(m => m.pkmn_name).slice(0, 10).forEach(m => {
    console.log(`  ${m.pokeapi_id} → ${m.pkmn_id} (${m.pkmn_name})`);
  });
}

if (require.main === module) {
  main();
}