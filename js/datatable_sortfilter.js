/* ── ルートオブジェクト ── */
const tblcontrol = new Object();

/* ── スタイルシート ── */
//─] オブジェクト
tblcontrol.stylesheet = document
  .querySelector("head")
  .appendChild(document.createElement("style")).sheet;
//─] 関数
tblcontrol.css = (selector, style) => {
  const sheet = tblcontrol.stylesheet;
  sheet.insertRule(`${selector} { ${style} }`, sheet.cssRules.length);
};
//─] 設定
//─]─] コントロール
tblcontrol.css(
  "th[ data-control ] .tbl-control",
  `
position: relative;
text-align: center;
`,
);
tblcontrol.css(
  "th[ data-control ] .tbl-control > button",
  `
width: 15px;
height: 15px;
padding: 0px;
margin: 2px;
border: solid 1px #ccc;
background: #eee;
cursor: pointer;
outline: none !important;
`,
);
tblcontrol.css(
  "th[ data-control ] .tbl-control > button:hover",
  `
border-color: #666;
`,
);
tblcontrol.css(
  "th[ data-control ] .tbl-control > button:active",
  `
background: #fff;
`,
);
tblcontrol.css(
  "th[ data-control ] .tbl-control button.filter",
  `
border-color: #fc6;
background: #ffc;
`,
);
tblcontrol.css(
  "th[ data-control ] .tbl-control button img",
  `
width: 100%; height: 100%;
border: none;
pointer-events: none;
`,
);
//─]─] フィルター
tblcontrol.css(
  "th[ data-control ] .tbl-filter",
  `
position: absolute; left: 0px; top: 100%; z-index: 100;
display: none;
box-sizing: border-box;
width: 200px;
padding: 4px;
margin: 0px;
border: solid 1px #ccc;
background: #ffe;
`,
);
tblcontrol.css(
  "th[ data-control ] .tbl-filter.open",
  `
display: block;
`,
);
tblcontrol.css(
  "th[ data-control ] .tbl-filter label",
  `
display: block;
text-align: left;
`,
);
tblcontrol.css(
  "th[ data-control ] .tbl-filter-inventory",
  `
max-height: 200px;
overflow: auto;
`,
);
tblcontrol.css(
  "th[ data-control ] .tbl-filter-keyword",
  `
margin: 4px auto;
`,
);
tblcontrol.css(
  "th[ data-control ] .tbl-filter-buttons input",
  `
box-sizing: border-box;
width: 164px;
margin: 2px;
`,
);
tblcontrol.css(
  `
th[ data-control ] .tbl-filter-buttons input[ value="絞込み" ],
th[ data-control ] .tbl-filter-buttons input[ value="クリア" ],
th[ data-control ] .tbl-filter-range input[ name="min" ],
th[ data-control ] .tbl-filter-range input[ name="max" ]
`,
  `
width: 80px;
margin: 2px;
`,
);

/* ── ボタンアイコン ── 
2026-01-29外部ライブラリ参照は廃止されました。自作svgへ移行しています。
*/
tblcontrol.btnicon = new Object();
//─] ソート：昇順
tblcontrol.btnicon.ascend = new Image();
tblcontrol.btnicon.ascend.src = "../picture/icons/sort_up.svg";
/* tblcontrol.btnicon.ascend.src = `data:image/svg+xml;charset=utf-8,
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
<polygon fill="%23666" stroke="none" points="8,3 3,11 13,11" />
</svg>`;*/
//─] ソート：降順
tblcontrol.btnicon.descend = new Image();
tblcontrol.btnicon.descend.src = "../picture/icons/sort_down.svg";
/* tblcontrol.btnicon.descend.src = `data:image/svg+xml;charset=utf-8,
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
<polygon fill="%23666" stroke="none" points="8,13 3,5 13,5" />
</svg>`; */
//─] 絞込み
tblcontrol.btnicon.refine = new Image();
tblcontrol.btnicon.refine.src = "../picture/icons/filterfunnel.svg";
/* tblcontrol.btnicon.refine.src = `data:image/svg+xml;charset=utf-8,
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
<polygon fill="%23666" stroke="none" points="8,11 3,3 13,3" />
<rect fill="%23666" stroke="none" x="6" y="6" width="4" height="6" />
</svg>`; */
/* ── 関数：初期化 ── */
tblcontrol.init = () => {
  //─] コントロール追加
  document.querySelectorAll("thead th[ data-control ]").forEach((th) => {
    //─]─] 取得
    const index = th.cellIndex;
    const table = th.closest("table");
    const tbody = table.querySelector("tbody");

    //─]─] コントロール
    const control = th.appendChild(document.createElement("div"));
    control.classList.add("tbl-control");

    //─]─]─] ソート
    if (/sort/.test(th.dataset.control)) {
      //─]─]─]─] 昇順ボタン
      const ascend = control.appendChild(document.createElement("button"));
      ascend.dataset.type = "sort-ascend";
      ascend.appendChild(tblcontrol.btnicon.ascend.cloneNode(true));
      //─]─]─]─] 降順ボタン
      const descend = control.appendChild(document.createElement("button"));
      descend.dataset.type = "sort-descend";
      descend.appendChild(tblcontrol.btnicon.descend.cloneNode(true));
      //─]─]─]─] イベントハンドラ
      ascend.onclick = descend.onclick = tblcontrol.sort;
    }

    //─]─]─] 絞込み
    if (/refine/.test(th.dataset.control)) {
      //─]─]─]─] ボタン
      const refine = control.appendChild(document.createElement("button"));
      refine.dataset.type = "refine";
      refine.appendChild(tblcontrol.btnicon.refine.cloneNode(true));
      refine.onclick = tblcontrol.toggleFilter;

      //─]─]─]─] フィルター
      const filter = control.appendChild(document.createElement("form"));
      filter.classList.add("tbl-filter");
      filter.onsubmit = tblcontrol.refine;
      filter.onreset = tblcontrol.unrefine;

      //─]─]─]─]─] 全選択
      let div = filter.appendChild(document.createElement("div"));
      div.classList.add("tbl-filter-all");
      let label = div.appendChild(document.createElement("label"));
      let input = label.appendChild(document.createElement("input"));
      input.name = "filter_all";
      input.type = "checkbox";
      input.checked = true;
      input.onchange = tblcontrol.checkAll;
      label.appendChild(document.createTextNode("すべて"));

      // index: フィルター対象列のインデックス
      // th: index番目のth要素
      const th = table.querySelectorAll("th")[index];
      const controlValue = th.dataset.control || "";

      // checklistが含まれているか判定
      const isChecklist = controlValue.split(/\s+/).includes("checklist");

      //─]─]─]─]─] キーアイテム
      div = filter.appendChild(document.createElement("div"));
      div.classList.add("tbl-filter-inventory");
      if (isChecklist) {
        div.style.display = "block";
      } else {
        div.style.display = "none";
      }
      const list = [].reduce.call(
        tbody.rows,
        (arr, row) => {
          const text = row.cells[index].textContent;
          if (!arr.includes(text)) {
            arr.push(text);
          }
          return arr;
        },
        [],
      );
      list.forEach((text) => {
        label = div.appendChild(document.createElement("label"));
        input = label.appendChild(document.createElement("input"));
        input.name = "filter_item";
        input.type = "checkbox";
        input.value = text;
        input.checked = true;
        input.onchange = tblcontrol.checkAll;
        label.appendChild(document.createTextNode(text));
      });
      filter.dataset.keyitem = JSON.stringify(list);

      //─]─]─]─]─] キーワード
      div = filter.appendChild(document.createElement("div"));
      div.classList.add("tbl-filter-keyword");
      input = div.appendChild(document.createElement("input"));
      input.name = "filter_keyword";
      input.type = "text";
      input.placeholder = "絞込みワード";
      input.style.width = "160px";
      filter.dataset.keyword = "";

      /* ↓　textbox → min/max 2025-08-17*/

      //─]─]─]─]─] min/max（数値列のみ）
      if (/number/.test(th.dataset.control)) {
        div = filter.appendChild(document.createElement("div"));
        div.classList.add("tbl-filter-range");

        input = div.appendChild(document.createElement("input"));
        input.name = "min";
        input.type = "number";
        input.placeholder = "最小";
        input.style.width = "72px";
        input.className = "tbl-filter-minmax";

        input = div.appendChild(document.createElement("input"));
        input.name = "max";
        input.type = "number";
        input.placeholder = "最大";
        input.style.width = "72px";
        input.className = "tbl-filter-minmax";
      }

      /* ↑　textbox → min/max */

      //─]─]─]─]─] 各ボタン
      div = filter.appendChild(document.createElement("div"));
      div.classList.add("tbl-filter-buttons");

      input = div.appendChild(document.createElement("input"));
      input.type = "submit";
      input.value = "絞込み";

      input = div.appendChild(document.createElement("input"));
      input.type = "reset";
      input.value = "クリア";

      input = div.appendChild(document.createElement("input"));
      input.type = "button";
      input.value = "メニュー閉じる";
      input.onclick = tblcontrol.toggleFilter;
    }
  });
};

/* ── 関数：並び替え ── */
tblcontrol.sort = (evt) => {
  //─] HTML 要素
  const target = evt.target;
  const thead = target.closest("thead");
  const th = target.closest("th");
  const tbody = target.closest("table").querySelector("tbody");
  //─] 列番号
  const index = th.cellIndex;
  //─] ソート方法
  const type = target.dataset.type;
  const numsort = /number/.test(th.dataset.control);
  //─] ソート
  Array.from(tbody.rows)
    .sort((row1, row2) => {
      const [a, b] = [
        row1.cells[index].textContent,
        row2.cells[index].textContent,
      ].map((value) => (numsort ? Number(value) : value));
      return a == b
        ? 0
        : type == "sort-ascend"
          ? a > b
            ? 1
            : -1
          : a > b
            ? -1
            : 1;
    })
    .forEach((row) => tbody.appendChild(row));
  //─] ボタンの色
  thead
    .querySelectorAll("button[ data-type|='sort' ]")
    .forEach((button) =>
      button.classList[button == target ? "add" : "remove"]("filter"),
    );
};

/* ── 関数：フィルター開閉 ── */
tblcontrol.toggleFilter = (evt) => {
  //─] HTML 要素
  const target = evt.target
    .closest(".tbl-control")
    .querySelector(".tbl-filter");
  const filters = target.closest("thead").querySelectorAll(".tbl-filter");
  //─] 開閉フラグ
  const open = !target.classList.contains("open");
  //─] すべてのフィルターを閉じる
  filters.forEach((filter) => {
    //──] リセット：キーアイテム
    const keyitem = JSON.parse(filter.dataset.keyitem);
    filter.filter_item.forEach(
      (item) => (item.checked = keyitem.includes(item.value)),
    );
    filter.filter_all.checked = Array.from(filter.filter_item).every(
      (item) => item.checked,
    );
    //──] リセット：キーワード
    const keyword = (filter.filter_keyword.value = filter.dataset.keyword);
    //──] ボタンの色
    filter
      .closest("th")
      .querySelector("button[ data-type='refine' ]")
      .classList[
        !keyword && filter.filter_all.checked ? "remove" : "add"
      ]("filter");
    //──] 閉じる
    filter.classList.remove("open");
  });
  //─] フィルターを開く
  if (open) target.classList.add("open");
};

/* ── 関数：全選択 ── */
tblcontrol.checkAll = (evt) => {
  const target = evt.target;
  const filter = target.form;
  target.name == "filter_all"
    ? Array.from(filter.filter_item).forEach(
        (item) => (item.checked = target.checked),
      )
    : (filter.filter_all.checked = Array.from(filter.filter_item).every(
        (item) => item.checked,
      ));
};

/* ── 関数：絞込み ── */
/* ↓　textbox → min/max */

//-] 関数数値範囲での絞り込み

tblcontrol.refine = function (event) {
  event.preventDefault();

  const form = event.target;
  const th = form.closest("th");
  const colIndex = th.cellIndex;
  const rows = th.closest("table").tBodies[0].rows;

  // 絞り込み条件取得（意味保証された属性から）
  const controlValue = th.dataset.control ?? "";
  const isNumber = controlValue.split(/\s+/).includes("number");
  console.log(controlValue, isNumber, th.dataset.control); // ← デバッグ用

  const min = isNumber ? parseFloat(form.min?.value) : undefined;
  const max = isNumber ? parseFloat(form.max?.value) : undefined;
  const keyword = form.filter_keyword?.value?.trim();

  // keyitem（チェックボックス）取得
  const keyitem = form.filter_item
    ? Array.from(form.filter_item)
        .filter((input) => input.checked)
        .map((input) => input.value)
    : [];
  form.dataset.keyitem = JSON.stringify(keyitem);

  // 行ごとに絞り込み判定
  for (const row of rows) {
    const cell = row.cells[colIndex];
    const text = cell.textContent.trim();
    let show = true;

    // チェックボックスによる絞り込み
    if (keyitem.length > 0 && !keyitem.includes(text)) {
      show = false;
    }

    if (isNumber) {
      const value = parseFloat(text);
      if (!isNaN(min) && value < min) show = false;
      if (!isNaN(max) && value >= max) show = false;

      // キーワードでの数値絞り込み完全一致
      if (keyword && text !== keyword) show = false;
    } else {
      // キーワードでの文字列絞り込み部分一致
      if (keyword && !text.includes(keyword)) show = false;
    }

    row.style.display = show ? "" : "none";
  }
};

/* ── 関数：絞込み解除 ── */
tblcontrol.unrefine = (evt) => {
  const filter = evt.target;
  filter.filter_all.checked = true;
  Array.from(filter.filter_item).forEach((item) => (item.checked = true));
  filter.filter_keyword.value = "";

  /* ↓　textbox → min/max 2025-08-17*/
  filter.min.value = "";
  filter.max.value = "";
  /* ↑　textbox → min/max */

  tblcontrol.refine(evt);
};

/* ── 実装 ── */
window.addEventListener("DOMContentLoaded", tblcontrol.init, false);
