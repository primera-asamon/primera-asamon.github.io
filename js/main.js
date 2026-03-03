// footer以外の高さ制御
// footer_vali_wrapper の padding-bottom 調整
function updateFooterPadding() {
  const footer = document.querySelector("footer");
  const wrapper = document.querySelector(".footer_vali_wrapper");
  const height = footer.classList.contains("open") ? footer.offsetHeight : 0;
  wrapper.style.paddingBottom = height + "px";
}
// 折り畳み表示
const footerToggle = document.querySelector(".footer-toggle");
// 存在チェック
if (footerToggle) {
  footerToggle.addEventListener("click", () => {
    document.querySelector(".footer-collapsible").classList.toggle("open");
    footerToggle.classList.toggle("open");
    updateFooterPadding();
  });
}

const mainToggle = document.querySelector(".main-toggle");
if (mainToggle) {
  mainToggle.addEventListener("click", () => {
    document.querySelector(".main-collapsible").classList.toggle("open");
    mainToggle.classList.toggle("open");
  });
}

const subnavToggle = document.querySelector(".subnav-toggle");
if (subnavToggle) {
  subnavToggle.addEventListener("click", () => {
    document.querySelector(".subnav-collapsible").classList.toggle("open");
    subnavToggle.classList.toggle("open");
  });
}

document.querySelectorAll(".article-toggle").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    toggle.classList.toggle("open");
    toggle.nextElementSibling.classList.toggle("open");
  });
}); // 初期化
window.addEventListener("load", updateFooterPadding);
