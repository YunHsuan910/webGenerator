const listItems = document.querySelectorAll(".list-item");
function footerA() {
  if (!listItems) return;
  listItems.forEach((listItem) => {
    listItem.addEventListener("click", () => {
      const dropDown = listItem.querySelector(".drop-down");
      if (!dropDown) return;
      const activeItem = listItem.classList.contains("active");
      if (!activeItem) {
        resetListItem();
      }
      listItem.classList.add("active");
      listItem.classList.toggle("list-item-show");
    });
  });
}
function resetListItem() {
  listItems.forEach((listItem) => {
    listItem.classList.remove("active");
    listItem.classList.remove("list-item-show");
  });
}
$(document).ready(function () {
  footerA();
});
