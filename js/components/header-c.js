function headerC() {
  const search = document.getElementById("search");
  const cancel = document.getElementById("cancel");
  if (!search || !cancel) return;
  //點擊搜尋
  search.addEventListener("click", () => {
    search.classList.add("search-open");
  });
  //關閉搜尋
  cancel.addEventListener("click", (e) => {
    e.stopPropagation();
    search.classList.remove("search-open");
  });
  const menuOpen = document.getElementById("menu-open");
  const sideMenu = document.getElementById("side-menu");
  const nav = document.getElementById("nav");
  const sideNav = nav.cloneNode(true);
  sideNav.id = "side-nav";
  const mask = document.getElementById("mask");
  const menuClose = document.getElementById("menu-close");
  const listItemWraps = sideNav.querySelectorAll(".list-item-wrap");
  //開啟側邊選單
  menuOpen.addEventListener("click", () => {
    sideMenu.appendChild(sideNav);
    sideNav.classList.add("nav-side");
    sideMenu.classList.add("side-menu-show");
    mask.classList.add("mask-show");
  });
  //關閉側邊選單
  menuClose.addEventListener("click", () => {
    sideNav.classList.remove("nav-side");
    sideMenu.classList.remove("side-menu-show");
    mask.classList.remove("mask-show");
    $("*").removeClass("sub-nav-show", "product-wrap-show");
  });
  listItemWraps.forEach((listItemWrap) => {
    const listItem = listItemWrap.querySelector(".list-item");
    const subNav = listItemWrap.querySelector(".dropdown-sub-nav");
    const backToAll = subNav.querySelector(".back");
    const subItems = subNav.querySelectorAll(".sub-item");
    //開啟項目選單
    listItem.addEventListener("click", () => {
      subNav.classList.add("sub-nav-show");
    });
    //回到所有項目選單
    backToAll.addEventListener("click", () => {
      subNav.classList.remove("sub-nav-show");
    });
    subItems.forEach((subItem) => {
      const subItemTitle = subItem.querySelector(".title");
      const products = subItem.querySelector(".product-wrap");
      const backToItems = products.querySelector(".back");
      //展開子項目選單
      subItemTitle.addEventListener("click", () => {
        products.classList.add("product-wrap-show");
      });
      //回到項目選單
      backToItems.addEventListener("click", () => {
        products.classList.remove("product-wrap-show");
      });
    });
  });

  // window.addEventListener("resize", () => {
  //   nav.classList.remove("nav-side");
  // });
}

$(document).ready(function () {
  headerC();
});
