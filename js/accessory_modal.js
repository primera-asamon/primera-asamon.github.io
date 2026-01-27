// 変数規定部（CONFIGオブジェクトのプロパティとして。必要に応じて変更。）
const CONFIG = {
 // モーダル構成(html末尾)div ID指定(recordModal_1…,recordDetailContainer_1…)
  modalSelector: '#recordModal_1',
  containerSelector: '#recordDetailContainer_1', 
  closeButtonSelector: '.close-button'
};
// popup表示data 外部化(Pop-upRecordDataSource.html)修正部2025-12-20
  async function loadPopupTable() {
    const res = await fetch('/partials/Pop-upRecordDataSource.html');
    return await res.text();
  }
// 全部のフィルター後HTML生成関数
  async function generateSubHTML_all(key) {
  const tableHTML = await loadPopupTable();

  return `
    <h3 class="lineage_accessory_popup_title">${key}<span class="style_regular">の性能</span></h3>
    <span class="lineage_accessory_popup_subtitle">強化値による性能変化一覧</span><br>
    <table class="lineage_accessory_popup_table">
      <thead>
        <tr><th>項目</th><th>強化0</th><th>強化1</th><th>強化2</th><th>強化3</th><th>強化4</th><th>強化5</th><th>強化6</th><th>強化7</th><th>強化8</th></tr>
      </thead>
    ${tableHTML}
  `;
}
// リンククリックイベント
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('record-link')) {
    e.preventDefault();
    const key = e.target.dataset.key;
    showModal(key, generateSubHTML_all);
  }
});
function filterModalRows(key) {
  const container = document.querySelector(CONFIG.containerSelector);
  const rows = container.querySelectorAll('.modal_selection tr');
  console.log(`Filtering for key: "${key}"`);
  rows.forEach(row => {
    console.log(`row.className: [${row.className}]`);
    row.style.display = row.classList.contains(key) ? 'table-row' : 'none';
  });
}
// モーダル表示関数（filterModalRowsを呼び出し、表示対象のみ可視化）
async function showModal(key) {
  console.log(`Container: "${CONFIG.containerSelector}"`);
  const modal = document.querySelector(CONFIG.modalSelector);
  const container = document.querySelector(CONFIG.containerSelector);
  const closeBtn = document.querySelector(CONFIG.closeButtonSelector);
  container.innerHTML = await generateSubHTML_all(key); // 全体HTMLを挿入 awaite追加2025-12-20
  // setTimeout(() => filterModalRows(key), 0); // 非同期で行フィルタリング＊遅延実行
  console.log(container.innerHTML); // 「<tbody class="modal_selection">」が存在するか確認
  filterModalRows(key);                 // 表示対象のみ可視化
  modal.style.display = 'block';

  closeBtn.onclick = () => modal.style.display = 'none';
  window.onclick = (event) => {
    if (event.target === modal) modal.style.display = 'none';
  };
}