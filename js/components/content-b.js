const ContentBSwiper = new Swiper(".content-b-style", {
  //   slidesPerView: "auto",
  slidesPerView: 1.5,
  spaceBetween: 10,
  centeredSlides: true,
  loop: true,
  grabCursor: false,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});
