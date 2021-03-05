var slick = require('slick-carousel');

module.exports = {
  init: function() {

    if (document.querySelector('.js-slick-carousel') != null) {
        this.profileCarousel();
    }

  },
  profileCarousel() {
    $('.js-slick-carousel').slick({
      infinite: false,
      slidesToShow: 1,
      dots: true,
      arrows: false,
      mobileFirst: true,
      centerMode: false,
      swipeToSlide: true,
    });
  },
}