var $ = require('jquery');

module.exports = {
    init: function() {

        if (document.querySelector('.o-modal--close') != null) {
            this.SpotifyToggle();
        }

        if (document.querySelector('.c-footer-navigation__group-link') != null) {
            this.ToggleButtonState();
        }

    },
    SpotifyToggle: function() {
        // SPOTIFY SEARCH MODAL
        $('.o-modal--close').on('click', function(e) {
            e.preventDefault();
            $('.o-modal--group').toggleClass("o-modal--group-open");
        });
        $('.o-modal--close').on('click', function(e) {
            e.preventDefault();
            $('.o-modal--close').toggleClass("o-modal--close-open");
        });
    },
    ToggleButtonState: function() {
        switch (window.location.pathname) {
            case '/browse':
                $('.c-footer-navigation__group-link--home').addClass('c-footer-navigation__group-link__selected');
                break;
            case '/chat/browse':
                $('.c-footer-navigation__group-link--chat').addClass('c-footer-navigation__group-link__selected');
                break;
            case '/chat/view':
                $('.c-footer-navigation__group-link--chat').addClass('c-footer-navigation__group-link__selected');
                break;
            default: 
        }
    }
}