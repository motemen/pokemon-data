#!/usr/bin/perl
use strict;
use warnings;

# pokeapi_form_name と showdown_forme の実質的な不一致を検出するスクリプト
# 大文字小文字、ハイフン、性別、Totem、および既知のパターンを無視

while (<>) {
    chomp;
    my @F = split /\t/;
    next if $. == 1;  # ヘッダー行をスキップ
    next unless $F[2] && $F[17];  # 空の値をスキップ
    
    my $pokeapi = lc($F[2]);
    my $showdown = lc($F[17]);
    $pokeapi =~ s/-//g;
    $showdown =~ s/-//g;
    
    # 性別フォームを無視
    next if ($pokeapi eq "male" && $showdown eq "m");
    next if ($pokeapi eq "female" && $showdown eq "f");
    
    # Totemフォームを無視
    next if ($pokeapi =~ /totem/ || $showdown =~ /totem/);
    
    # オドリドリ: pau -> pa'u
    next if ($pokeapi eq "pau" && $showdown eq "pa'u");
    
    # ネクロズマ: dusk -> dusk-mane, dawn -> dawn-wings
    next if ($pokeapi eq "dusk" && $showdown eq "duskmane");
    next if ($pokeapi eq "dawn" && $showdown eq "dawnwings");
    
    # ゲッコウガ: battle-bond -> bond
    next if ($pokeapi eq "battlebond" && $showdown eq "bond");
    
    # マウスホールド: family-of-four -> four, family-of-three -> three
    next if ($pokeapi eq "familyoffour" && $showdown eq "four");
    next if ($pokeapi eq "familyofthree" && $showdown eq "three");
    
    # オーガポン: *-mask -> マスク名
    next if ($pokeapi eq "wellspringmask" && $showdown eq "wellspring");
    next if ($pokeapi eq "hearthflamemask" && $showdown eq "hearthflame");
    next if ($pokeapi eq "cornerstonemask" && $showdown eq "cornerstone");
    
    # タウロス: paldea-*-breed -> paldea-*
    next if ($pokeapi eq "paldeacombatbreed" && $showdown eq "paldeacombat");
    next if ($pokeapi eq "paldeablazebreed" && $showdown eq "paldeablaze");
    next if ($pokeapi eq "paldeaaquabreed" && $showdown eq "paldeaaqua");
    
    # ヒヒダルマ: galar-standard -> galar
    next if ($pokeapi eq "galarstandard" && $showdown eq "galar");
    
    # トリミアン: la-reine -> la reine
    next if ($pokeapi eq "lareine" && $showdown eq "lareine");
    
    # アカツキガラス: *-plumage -> 色名
    next if ($pokeapi eq "greenplumage" && $showdown eq "green");
    next if ($pokeapi eq "blueplumage" && $showdown eq "blue");
    next if ($pokeapi eq "yellowplumage" && $showdown eq "yellow");
    next if ($pokeapi eq "whiteplumage" && $showdown eq "white");
    
    # イワンコ: own-tempo -> dusk
    next if ($pokeapi eq "owntempo" && $showdown eq "dusk");
    
    # ジガルデ: パーセント記号とpower-constructパターンのマッチング
    next if ($pokeapi eq "50" && $showdown eq "50%");
    next if ($pokeapi eq "10powerconstruct" && $showdown eq "10%");
    next if ($pokeapi eq "50powerconstruct" && $showdown eq "50%");
    next if ($pokeapi eq "10" && $showdown eq "10%");
    
    # メテノ: *meteor -> meteor (一般化)
    my $pokeapi_meteor = $pokeapi;
    $pokeapi_meteor =~ s/.*(meteor)/$1/;
    next if ($pokeapi_meteor eq $showdown && $showdown eq "meteor");
    
    # ストリンダー・ウーラオスのGmaxフォーム: gmax -> 特定フォーム
    next if ($pokeapi eq "gmax" && $showdown eq "lowkeygmax");
    next if ($pokeapi eq "gmax" && $showdown eq "rapidstrikegmax");
    
    # ピカチュウの帽子フォーム: *-cap を削除してマッチング
    my $pokeapi_pikachu = $pokeapi;
    $pokeapi_pikachu =~ s/cap$//;
    next if ($pokeapi_pikachu eq $showdown && $F[0] == 25);  # 図鑑番号25はピカチュウ
    
    # マホミル: *-strawberry-sweet を削除してマッチング
    my $pokeapi_alcremie = $pokeapi;
    my $showdown_alcremie = $showdown;
    $pokeapi_alcremie =~ s/strawberrysweet$//;
    $showdown_alcremie =~ s/\s+//g;  # showdownのスペースも削除
    next if ($pokeapi_alcremie eq lc($showdown_alcremie));
    
    if ($pokeapi ne $showdown) {
        print "$.\t$F[0]\t$F[4]\t$F[2]\t$F[17]\n";
    }
}