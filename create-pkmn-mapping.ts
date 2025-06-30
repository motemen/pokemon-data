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
 * PokéAPIの英語名からPokemon ShowdownのIDを生成
 * 
 * 基本的にはハイフンを削除するだけで済むが、一部特殊なケースがある
 */
function generatePkmnId(pokeapiName: string): string {
  // 基本的な変換: ハイフンを削除
  let pkmnId = pokeapiName.replace(/-/g, '');

  // 特殊なケースの処理（ハイフン削除だけでは対応できないもの）
  const specialCases: Record<string, string> = {
    'flabebe': 'flabebe', // 'flabébé' → 'flabebe'ではない
    'zygarde10powerconstruct': 'zygarde10',
    'zygarde50powerconstruct': 'zygarde',
    'paldeacombatbreed': 'paldea',
    'paldeaaquabreed': 'paldeaaqua',
    'paldeablazebreed': 'paldeablaze',
  };

  // 特殊なケースをチェック
  if (pkmnId in specialCases) {
    return specialCases[pkmnId];
  }

  // totem形式の処理（例: raticatetotem → raticate）
  if (pkmnId.includes('totem')) {
    pkmnId = pkmnId.replace('totem', '');
  }

  // その他の調整
  pkmnId = pkmnId.replace('starter', '');

  return pkmnId;
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
    const pkmnId = generatePkmnId(entry.pokeapi_name);
    
    // Pokemon Showdownにそのポケモンが存在するかチェック
    let pkmnName: string | null = null;
    try {
      const species = gen.species.get(pkmnId);
      if (species && species.exists) {
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