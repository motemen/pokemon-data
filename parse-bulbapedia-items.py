#!/usr/bin/env python
# /// script
# requires-python = ">=3.8"
# dependencies = [
#   "beautifulsoup4",
#   "lxml",
# ]
# ///

import sys
from bs4 import BeautifulSoup

def parse_bulbapedia_items(html_path):
    with open(html_path, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'lxml')
    
    # ヘッダーを出力
    print("bulbapedia_id\tname_en")
    
    # sortableクラスのテーブルを探す（Generation IXのアイテムテーブル）
    tables = soup.find_all('table', class_='sortable')
    
    if tables:
        # 最初のsortableテーブルがアイテムテーブル
        table = tables[0]
        rows = table.find_all('tr')[1:]  # ヘッダー行をスキップ
        
        for row in rows:
            cells = row.find_all(['td', 'th'])
            if len(cells) >= 4:
                # 1列目: # (decimal ID)
                # 2列目: Hex (hexadecimal ID)  
                # 3列目: Bag (empty)
                # 4列目: Item (item name)
                dec_id = cells[0].text.strip()
                hex_id = cells[1].text.strip()
                bag = cells[2].text.strip()
                item_name = cells[3].text.strip()
                
                # Decimal IDとアイテム名を出力（空でない場合のみ）
                if dec_id and item_name and dec_id.isdigit():
                    print(f"{dec_id}\t{item_name}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python parse-bulbapedia-items.py <html_file>", file=sys.stderr)
        sys.exit(1)
    
    parse_bulbapedia_items(sys.argv[1])