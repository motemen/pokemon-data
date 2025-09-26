#!/usr/bin/env tsx
/**
 * @pkmn/dataを使用してPokéAPIのIDからPokemon PKMNのIDへのマッピングファイルを生成
 */

import { readFileSync, writeFileSync } from 'fs';
import { Generations } from '@pkmn/data';
import { Dex } from '@pkmn/dex';

// Dexインスタンスを作成してGenerationsに渡す
const generations = new Generations(Dex);
// 全世代のデータを取得（1〜9世代）
const allGens = Array.from({ length: 9 }, (_, i) => generations.get(i + 1));

interface PokemonEntry {
  id: number;
  name_en: string;
}

interface PkmnMapping {
  pokeapi_id: number;
  pkmn_id: string | null;
  pkmn_name: string | null;
}

/**
 * PokéAPIの英語名からPokemon PKMNのIDを生成
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
 * TSVファイルを読み込んでパース
 */
function parseTsv(content: string): PokemonEntry[] {
  const lines = content.trim().split('\n');
  const header = lines[0].split('\t');
  const entries: PokemonEntry[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split('\t');
    const entry: any = {};
    
    for (let j = 0; j < header.length; j++) {
      const key = header[j];
      let value: any = values[j];
      
      // 数値フィールドの変換
      if (key === 'id' || key === 'national_pokedex_number') {
        value = parseInt(value, 10);
      }
      
      entry[key] = value;
    }
    
    entries.push({
      id: entry.id,
      name_en: entry.name_en,
    });
  }
  
  return entries;
}

/**
 * メイン関数
 */
function main() {
  // pokeapi.tsvを読み込み
  const inputFile = 'pokeapi.tsv';
  const pokemonTsv = readFileSync(inputFile, 'utf-8');
  const pokemonAll = parseTsv(pokemonTsv);
  
  console.log(`Loaded ${pokemonAll.length} Pokemon entries from ${inputFile}`);
  
  // マッピングを生成
  const mappings: PkmnMapping[] = [];
  let successCount = 0;
  
  for (const entry of pokemonAll) {
    const pkmnId = generatePkmnId(entry.name_en);
    
    // 全世代でPokemon PKMNにそのポケモンが存在するかチェック
    let pkmnName: string | null = null;
    
    // 各世代を順番にチェック（新しい世代から古い世代へ）
    for (let i = allGens.length - 1; i >= 0; i--) {
      try {
        const species = allGens[i].species.get(pkmnId);
        if (species && species.exists) {
          pkmnName = species.name;
          break; // 見つかったら検索終了
        }
      } catch (error) {
        // この世代にポケモンが見つからない場合は次の世代をチェック
        continue;
      }
    }
    
    if (pkmnName) {
      successCount++;
    }
    
    mappings.push({
      pokeapi_id: entry.id,
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