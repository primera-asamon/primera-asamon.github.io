// document.getElementById('fileInput').addEventListener('change', function(e) {
//スマホでは無理だからTSV選択はさせない。TSVファイル名のハードコーディング。
document.getElementById('loadBtn').addEventListener('click', function() {
  // 英文説明/日本語説明をスクリーンリーダー向けの非表示スタイルを付加
    const info_en = document.getElementById("screenreader-info");
    const info_jp = document.getElementById("screenreader-info_jp");
  // 非表示クラスを付加（すでに付いていなければ）
    if (!info_en.classList.contains("sr-only")) {
        info_en.classList.add("sr-only");
    }
    if (!info_jp.classList.contains("sr-only")) {
        info_jp.classList.add("sr-only");
    }
// url掃除ページロード時をイベントとして処理するのは宿題。今は表示ボタンがトリガー。
   // 表示されていない状態なのに #class=xxx があるならハッシュを消す
    if (!document.getElementById('result').innerHTML && location.hash.includes("class=")) {
        history.replaceState(null, null, location.pathname);
    }
// TSV読み込みと描画 タイムスタンプを附与したリクエストによる強制再読み込みによって、FC2Serverのキャッシュ寿命を回避。
    fetch('LineageREMASTER_skill3.txt?v=' + new Date().getTime())
        .then(response => response.text())
        .then(text => {
    //test用
    // 読み込み成功時の処理
console.log("スクリプト開始");
console.log("DOM読み込み待機中");
//
//document.addEventListener('DOMContentLoaded', () => {
//  console.log("DOM読み込み完了");
//
//  const btn = document.getElementById('loadBtn');
//  if (btn) {
//    console.log("ボタン取得成功");
//    btn.addEventListener('click', () => {
//      console.log("ボタンクリック");
//      fetch('LineageREMASTER_skill3.txt?v=' + new Date().getTime())
//        .then(response => {
//          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//          return response.text();
//        })
//        .then(text => {
//          console.log("読み込み成功");
//          document.getElementById('result').textContent = text;
//        })
//        .catch(error => {
//          console.error("読み込みエラー:", error);
//        });
//    });
//  } else {
//    console.log("loadBtn 見つからず");
//  }
//});
function setup() {
  console.log("setup開始");

  const btn = document.getElementById('loadBtn');
  if (btn) {
    console.log("ボタン取得成功");
    btn.addEventListener('click', () => {
      console.log("ボタンクリック");
      fetch('LineageREMASTER_skill3.txt?v=' + new Date().getTime())
        .then(response => {
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          return response.text();
        })
        .then(text => {
          console.log("読み込み成功");
          document.getElementById('result').textContent = text;
        })
        .catch(error => {
          console.error("読み込みエラー:", error);
        });
    });
  } else {
    console.log("loadBtn 見つからず");
  }
}
// DOMContentLoaded イベントを使用して、DOMの読み込み完了を待つ
if (document.readyState === 'loading') {
  console.log("DOM読み込み待機中");
  document.addEventListener('DOMContentLoaded', setup);
} else {
  console.log("DOMすでに構築済み、即時実行");
  setup();
}

            // Windowサイズによって表示を切り替える
window.addEventListener('DOMContentLoaded', function() {
  if (window.innerWidth <= 398) {
    document.querySelectorAll('.record-table table').forEach(table => {
      table.querySelectorAll('tr').forEach(tr => {
        const cells = Array.from(tr.children);
        if (cells.length > 2) {
          let newRows = [];
          for (let i = 0; i < cells.length; i += 2) {
            let newTr = document.createElement('tr');
            if (cells[i]) newTr.appendChild(cells[i].cloneNode(true));
            if (cells[i+1]) newTr.appendChild(cells[i+1].cloneNode(true));
            newRows.push(newTr);
          }
          let parent = tr.parentNode;
          parent.insertBefore(newRows[0], tr);
          for (let i = 1; i < newRows.length; i++) {
            parent.insertBefore(newRows[i], newRows[i-1].nextSibling);
          }
          parent.removeChild(tr);
        }
      });
    });
  }
});
// 必要ならここでparseTSV(text)などの処理を呼び出す
// document.getElementById('submitBtn').addEventListener('click', function() {
//     const text = document.getElementById('textInput').value;
//     parseTSV(text);
// });
// function parseTSV(text) {
// ここにTSVパース＆表示処理を書く
//    const reader = new FileReader();
//     reader.onload = function() {
        const lines = text.trim().split('\n');
        let html = `<table>`;
        for (const line of lines) {
            const fields = line.split('\t');
            console.log(`フィールド数(${line}):`, fields.length); // フィールド数を確認

            if (fields.length < 24) {
                console.warn("データ不足:", fields);
                continue; // フィールド数が不足している場合スキップ
            }
            const [no,img,level,name,cls,elf,active,type,align,mp,hp,material,duration,target,reuse,effect,acqLv,obtain,price,Droporigin,Dropcomp,note1,note2,EOR] = line.split('\t');

            // 各フィールドをTAB分割 EOR(End Of Record)を無視
            // imgは画像のURLだが、ここでは使用しないので無視。値は"全角Space"
            // EORは行の終わりを示すが、ここでは使用しないので無視。値は"■"
            // clsとelfのまとめ表示
            let clsDisplay = cls;
            if (cls === "妖" && elf) {
                clsDisplay += `（${elf}）`;
            }
// 各フィールドの値を変数に格納
            if (window.innerWidth <= 398) {
// #region sauce
//  --- スマホ用テーブル出力 ---
                html += `<tr class="record-table" data-cls="${cls}"><td colspan="2"><table>`;
                html += `<tr><td class="col-data_no">No.${no}</td><td class="col-data_level">${level}</td></tr>`;
                html += `<tr><td class="col-data_skillname" colspan="2">${name}</td></tr>`;
                html += `<tr><th class="col-header">習得クラス</th><td class="col-data">${clsDisplay}</td></tr>`;
                html += `<tr><th class="col-header">活性</th><td class="col-data">${active}</td></tr>`;
                html += `<tr><th class="col-header">種類</th><td class="col-data">${type}</td></tr>`;
                html += `<tr><th class="col-header">性向</th><td class="col-data">${align}</td></tr>`;
                html += `<tr><th class="col-header">消耗MP</th><td class="col-data">${mp}</td></tr>`;
                html += `<tr><th class="col-header">消耗HP</th><td class="col-data">${hp}</td></tr>`;
                html += `<tr><th class="col-header">材料・触媒</th><td class="col-data">${material}</td></tr>`;
                html += `<tr><th class="col-header">持続時間</th><td class="col-data">${duration}</td></tr>`;
                html += `<tr><th class="col-header">対象</th><td class="col-data">${target}</td></tr>`;
                html += `<tr><th class="col-header">再使用時間</th><td class="col-data">${reuse}</td></tr>`;
                html += `<tr><th class="col-header">効果・性能</th><td class="col-data">${effect}</td></tr>`;
                html += `<tr><th class="col-header">習得Lv.</th><td class="col-data">${acqLv}</td></tr>`;
                html += `<tr><th class="col-header">取得方法</th><td class="col-data">${obtain}</td></tr>`;
                html += `<tr><th class="col-header">価格</th><td class="col-data">${price}</td></tr>`;
                html += `<tr><th class="col-header">ドロップ</th><td class="col-data">${Droporigin}</td></tr>`;
                html += `<tr><th class="col-header">【蘇生】</th><td class="col-data">${Dropcomp}</td></tr>`;
                html += `<tr><th class="col-header">備考1</th><td class="col-data">${note1}</td></tr>`;
                html += `<tr><th class="col-header">備考2</th><td class="col-data">${note2}</td></tr>`;
                html += `</table></td></tr>`;
            } else {
// #endregion
//  --- PC用テーブル出力 ---
            html += `<tbody class="record-table" data-cls="${cls}">`
            // No.とLevelとスキル名は「<th>～」を使用しない。
                html += `<tr>
                            <td class="col-data_no">No.${no}</td>`
                // ...existing code...
                // 等級・スキルレベルの出力部分
                            if (/^\d+$/.test(level)) {
                    // 数字のみの場合
                                html += `<td class="col-data_level">Lv.${level}</td>`;
                            } else {
                    // 空または文字列（神話・伝説など）の場合
                                html += `<td class="col-data_level">${level}</td>`;
                            }   
                 //            <th class="col-header" colspan="2">等級・スキルレベル</th><td class="col-data">${level}</td>
                    html += `<td class="col-data_skillname" colspan="9">${name}</td>`
                html += `</tr>`
                html += `<tr>`
                    html += `<th class="col-header">習得クラス</th>`
                    html += `<td class="col-data" colspan="2">${clsDisplay}</td>`
                    html += `<th class="col-header">活性</th><td class="col-data">${active}</td>`
                    html += `<th class="col-header">種類</th><td class="col-data">${type}</td>`
                    html += `<th class="col-header">性向</th><td class="col-data">${align}</td>`
                html += `</tr>`
                html += `<tr>`
                    html += `<th class="col-header">消耗MP</th><td class="col-data">${mp}</td>`
                    html += `<th class="col-header">消耗HP</th><td class="col-data">${hp}</td>`
                    html += `<th class="col-header">材料・触媒</th><td class="col-data"`
                    html += `colspan="3">${material}</td>`
                    html += `<th class="col-header">持続時間</th><td class="col-data"`
                    html += `colspan="3">${duration}</td>`
                html += `</tr>`
                html += `<tr>`
                    html += `<th class="col-header">対象</th><td class="col-data" colspan="2">${target}</td>`
                    html += `<th class="col-header">再使用時間</th><td class="col-data">${reuse}</td>`
                    html += `<th class="col-header">効果・性能</th><td class="col-data"`
                    html += ` colspan="7">${effect}</td>`
                html += `</tr>`
                html += `<tr>`
                    html += `<th class="col-header">習得Lv.</th><td class="col-data">${acqLv}</td>`
                    html += `<th class="col-header">取得方法</th><td class="col-data" colspan="3">${obtain}</td>`
                    html += `<th class="col-header">価格</th><td class="col-data" colspan="5">${price}</td>`
                html += `</tr>`
                html += `<tr>`
                    html += `<th class="col-header">ドロップ</th><td class="col-data" colspan="10">${Droporigin}</td>`
                html += `</tr>`
                html += `<tr>`
                    html += `<th class="col-header">【蘇生】</th><td class="col-data" colspan="10">${Dropcomp}</td>`
                html += `</tr>`
                html += `<tr>`
                    html += `<th class="col-header">備考1</th><td class="col-data" colspan="5">${note1}</td>`
                    html += `<th class="col-header">備考2</th><td class="col-data" colspan="4">${note2}</td>`
                html += `</tr>`
            }
            html +=`</tbody>`;
        }
        html += `</table>`;
        document.getElementById('result').innerHTML = html;
// テーブル描画後
    document.querySelectorAll('.class-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.class-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const selected = this.dataset.cls;
            document.querySelectorAll('.record-table').forEach(tr => {
                if (selected === 'all' || tr.dataset.cls === selected) {
                    tr.style.display = '';
                } else {
                    tr.style.display = 'none';
                }
            });
        });
    });
// クラスコードマップ(url用/数字は公式webページのClassID)
const classCodeMap = {
  "君": "pri",　//0/君主prince・princess
  "騎": "kni",  //1/ナイトknight
  "妖": "elf",  //2/エルフelf
  "魔": "wiz",  //3/ウィザードwizard
  "闇": "dak",  //4/ダークエルフdarkelf
  "竜": "dra",  //5/ドラゴンナイトdragonknight
  "幻": "ill",  //6/イリュージョニストillusionist
  "闘": "war",  //7/ウォリアーwarrior
  "剣": "fen",  //8/フェンサーFencer
  "槍": "lan",  //9/ランサーlancer
  "聖": "Pal"   //10/パラディンPaladin
};
// クラスコード取得関数
function getClassCode(label) {
  return classCodeMap[label] || "etc"; // 未定義なら仮のフォールバック
}// クラスフィルタリング関数
document.querySelectorAll('.class-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const label = this.dataset.cls; // たとえば "聖"
        const code = getClassCode(label); // たとえば "hol"
        history.replaceState(null, null, `#class=${code}`);
        filterByClass(code); // 既存の注出関数
    });
});
    // reader.readAsText(e.target.files[0], 'UTF-8');
    console.log(text); // デバッグ用
        })
        .catch(error => {
            document.getElementById('result').textContent = '読み込み失敗: ' + error;
        });
    // ここでaddEventListenerの関数を閉じる
});