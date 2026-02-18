// フィールド長 指示クラス名 決定関数
function classify(value) {
  // 1. null / undefined / 数値 / その他を安全に文字列化
  let text = (value ?? "").toString().trim();

  // 2. 文字数を取得
  let len = text.length;

  // 3. 6分類の閾値で振り分け
  if (len <= 2)  return "minimum";
  if (len <= 4)  return "short";
  if (len <= 8)  return "mediumC";
  if (len <= 16) return "mediumB";
  if (len <= 32) return "long";
  return "free"; // 行占有
}
// クラス名適用 divタグ 応答関数
function renderRow(key, value, headerMap) {
  let label = headerMap[key] ?? key;
  let col_data_length = classify(value);

  return `
    <div class="col_header">${label}</div>
    <div class="col-data ${col_data_length}">${value}</div>
  `;
}
// 行内の全要素がminimumのケースではセルをflex-grow: 1にする
function renderRowAllMinimum(keys, record, dict) {
  return keys.map(key => {
    let label = headerMap[key];
    let value = record[key];

    return `
      <div class="col_header">${label}</div>
      <div class="col-data minimum grow1">${value}</div>
    `;
  }).join("");
}
// SubHTMLのスタイルとタグを記述する。↓はskill一覧表依存、適宜変更する。
// HTML生成関数（スキル用テンプレート）
function generateSubHTML(tsvRecord,jsonfields) {

  let popup_html =`
    <style>
    `;
// モーダル指定によるstyleのケース分け(クラス名を増やしたくない時)
  if (CONFIG.modalSelector==='#recordModal_1'){
      popup_html +=`
      .col-header {
        justify-content: center;
        background-color: #d8d8d8;
      }`
    } else {
      popup_html +=`
      .col-header {
        justify-content: center;
        background-color: #68a8a8;
      }`
    };
  popup_html +=`
    </style>
  `;
  // ここは既存コードの続きとして popup_html += を使う
  popup_html += `
<div class="record-table-wrapper">
  `;
  // ------------------------------------------------------------
  // ① タイトル行（No / Lv / 名称）
  // ------------------------------------------------------------
popup_html += `
  <div class="record-title">
    <div class="col-data_no mediumC">No.${tsvRecord.no}</div>
    <div class="col-data_level">${
      /^\d+$/.test(tsvRecord.level) ? "Lv." + tsvRecord.level : tsvRecord.level
    }</div>
    <div class="col-data_skillname free">${tsvRecord.name}</div>
  </div>
`;
  // ------------------------------------------------------------
  // ② JSON に基づくフィールド表示
  //     domain: skill_domains.json の skill_domain_key に対応
  // ------------------------------------------------------------

// col-data表示編集
const displayMap = {
  // 特殊処理：cls + elf
  cls: (tsvRecord.cls === "妖" && tsvRecord.elf)
    ? `${tsvRecord.cls}（${tsvRecord.elf}）`
    : tsvRecord.cls,
  // 秒やLv.の付与が必要なfield
    duration: /^\d+$/.test(tsvRecord.duration)
    ? `${tsvRecord.duration}秒`
    : tsvRecord.duration,

  interval: /^\d+$/.test(tsvRecord.interval)
    ? `${tsvRecord.interval}秒`
    : tsvRecord.interval,

  acqLv: /^\d+$/.test(tsvRecord.acqLv)
    ? `Lv.${tsvRecord.acqLv}`
    : tsvRecord.acqLv,
};
popup_html += `<div id="(${tsvRecord.name})" class="record-wrapper" data-cls="${tsvRecord.cls}" data-elf="${tsvRecord.elf}">`;

// 職業・活性・種類・性向
let keys;
keys = ["cls", "active", "type", "align"];

// 1. まず classify を全項目に対して実行
let classes = keys.map(key => {
  let value = displayMap[key] ?? tsvRecord[key];
  return classify(value);
});

// 2. 全部 minimum か判定
let allMinimum = classes.every(c => c === "minimum");

//     <div class="col_header">職業</div><div class="col-data free">${clsDisplay}</div>
popup_html += `
  <div class="record-table">
    ${
      allMinimum
        ? renderRowAllMinimum(keys, tsvRecord, headerMap)
        : keys.map(key => {
            let value = displayMap[key] ?? tsvRecord[key];
            return renderRow(key, value, headerMap);
          }).join("")
    }
  </div>
`;
// MP・HP・材料・装備・持続
keys = ["mp", "hp", "material", "gear", "duration"];

classes = keys.map(key => {
  let value = displayMap[key] ?? tsvRecord[key];
  return classify(value);
});
allMinimum = classes.every(c => c === "minimum");

popup_html += `
  <div class="record-table">
    ${
      allMinimum
        ? renderRowAllMinimum(keys, tsvRecord, headerMap)
        : keys.map(key => {
            let value = displayMap[key] ?? tsvRecord[key];
            return renderRow(key, value, headerMap);
          }).join("")
    }
  </div>
`;
// 対象・間隔・効果
keys = ["target", "interval", "effect"];

classes = keys.map(key => {
  let value = displayMap[key] ?? tsvRecord[key];
  return classify(value);
});

allMinimum = classes.every(c => c === "minimum");

popup_html += `
  <div class="record-table">
    ${
      allMinimum
        ? renderRowAllMinimum(keys, tsvRecord, headerMap)
        : keys.map(key => {
            let value = displayMap[key] ?? tsvRecord[key];
            return renderRow(key, value, headerMap);
          }).join("")
    }
  </div>
`;
// 習得・入手・価格
let acqLvDisplay = /^\d+$/.test(tsvRecord.acqLv)
  ? `Lv.${tsvRecord.acqLv}`
  : `${tsvRecord.acqLv}`;

keys = ["acqLv","obtain", "price"];

classes = keys.map(key => {
  let value = displayMap[key] ?? tsvRecord[key];
  return classify(value);
});

allMinimum = classes.every(c => c === "minimum");

popup_html += `
  <div class="record-table">
    ${
      allMinimum
        ? renderRowAllMinimum(keys, tsvRecord, headerMap)
        : keys.map(key => {
            let value = displayMap[key] ?? tsvRecord[key];
            return renderRow(key, value, headerMap);
          }).join("")
    }
  </div>
`;
// Drop
keys = ["Droporigin"];
popup_html += `
  <div class="record-table">
    <div class="col_header">Drop</div><div class="col-data free">${tsvRecord.Droporigin}</div>
  </div>
`;
// 蘇生
popup_html += `
  <div class="record-table">
    <div class="col_header">蘇生</div><div class="col-data free">${tsvRecord.Dropcomp}</div>
  </div>
`;
// 備考
keys = ["note1", "note2"];

classes = keys.map(key => {
  let value = displayMap[key] ?? tsvRecord[key];
  return classify(value);
});

allMinimum = classes.every(c => c === "minimum");

popup_html += `
  <div class="record-table">
    ${
      allMinimum
        ? renderRowAllMinimum(keys, tsvRecord, headerMap)
        : keys.map(key => {
            let value = displayMap[key] ?? tsvRecord[key];
            return renderRow(key, value, headerMap);
          }).join("")
    }
  </div>
`;
// ------------------------------------------------------------
// ③ record-wrapperの閉じ
// ------------------------------------------------------------
popup_html += `</div>`;
// ------------------------------------------------------------
// ④ record-table-wrapperの閉じ
// ------------------------------------------------------------
popup_html += `</div>`;
return popup_html;

}