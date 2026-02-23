function headerA() {
  const showMenuBtn = document.getElementById("show-menu");
  const menuWrap = document.getElementById("menu-wrap");
  if (!showMenuBtn || !menuWrap) {
    return;
  }
  //展開側邊選單
  showMenuBtn.addEventListener("click", () => {
    menuWrap.classList.add("menu-show");
  });
  const menus = document.querySelectorAll(".menu");
  menus.forEach((menu) =>
    menu.addEventListener("click", (e) => {
      //展開選單內的副項目
      e.stopPropagation();
      if (e.target.tagName !== "SPAN") return;
      const activeMenu = e.target.children[0];
      activeMenu.classList.add("submenu-show");
      //從副項目回到主選單
      const backBtns = document.querySelectorAll(".back-btn");
      backBtns.forEach((btn) =>
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          activeMenu.classList.remove("submenu-show");
        }),
      );
    }),
  );

  //關閉側邊選單
  const closeBtn = document.getElementById("close-btn");
  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    menuWrap.classList.remove("menu-show");
  });
}
$(document).ready(function () {
  headerA();
});
