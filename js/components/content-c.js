function contentC() {
  const showAllProduct = document.getElementById("all-product-show-btn");
  const closeAllProduct = document.getElementById("close-all-product-btn");
  const productWrap = document.getElementById("content-c-product-wrap");
  if (!showAllProduct || !closeAllProduct) return;
  //展開所有商品
  showAllProduct.addEventListener("click", () => {
    productWrap.classList.add("product-show-all");
  });
  closeAllProduct.addEventListener("click", () => {
    productWrap.classList.remove("product-show-all");
  });
}

$(document).ready(function () {
  contentC();
});
