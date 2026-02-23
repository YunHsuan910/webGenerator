const footerBMenus = document.querySelectorAll(".footer-menu");
function footerB() {
  footerBMenus.forEach((menu) => {
    menu.addEventListener("click", () => {
      const activeItem = menu.classList.contains("active");
      if (!activeItem) {
        resetFooterBListItem();
      }
      menu.classList.add("active");
      menu.classList.toggle("footer-menu-show");
    });
  });
}
function resetFooterBListItem() {
  footerBMenus.forEach((menu) => {
    menu.classList.remove("active");
    menu.classList.remove("footer-menu-show");
  });
}
$(document).ready(function () {
  footerB();
});
