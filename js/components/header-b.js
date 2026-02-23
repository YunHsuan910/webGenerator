function headerB() {
  const headerMode = document.getElementById("header-b");
  const menu = document.getElementById("header-b-menu");
  const headerWrap = document.getElementById("header-b-wrap");
  const listItems = document.querySelectorAll(".list-item");
  const darkLogo = document.getElementById("logo-dark");
  const lightLogo = document.getElementById("logo-light");

  window.addEventListener("resize", () => {
    menu.classList.remove("cross");
    headerWrap.classList.remove("list-show");
    headerMode.classList.remove("header-light-mode");
    darkLogo.style.display = "none";
    lightLogo.style.display = "block";
  });
  menu.addEventListener("click", () => {
    menu.classList.toggle("cross");
    headerWrap.classList.toggle("list-show");
    headerMode.classList.toggle("header-light-mode");
    if (darkLogo.style.display === "none") {
      darkLogo.style.display = "block";
      lightLogo.style.display = "none";
    } else {
      darkLogo.style.display = "none";
      lightLogo.style.display = "block";
    }
  });

  listItems.forEach((item) => {
    item.addEventListener("click", () => {
      const SubNav = item.querySelector(".sub-nav");
      const Dropdown = item.querySelector(".drop-down");
      if (!SubNav || !Dropdown) return;
      SubNav.classList.toggle("sub-nav-show");
      Dropdown.classList.toggle("up");
    });
  });
}
$(document).ready(function () {
  headerB();
});
