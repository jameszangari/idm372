var $ = require('jquery');

module.exports = {
    init: function() {

        if (document.querySelector('.o-spotify-select--close') != null) {
            this.SpotifyToggle();
        }

        if (document.querySelector('.c-footer-navigation__group-link') != null) {
            this.ToggleButtonState();
        }

    },
    SpotifyToggle: function() {
        // SPOTIFY SEARCH MODAL
        $('.o-spotify-select--close').on('click', function(e) {
            e.preventDefault();
            $('.o-spotify-select--group').toggleClass("o-spotify-select--group-open");
        });
        $('.o-spotify-select--close').on('click', function(e) {
            e.preventDefault();
            $('.o-spotify-select--close').toggleClass("o-spotify-select--close-open");
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