var $ = require('jquery');

module.exports = {
    init: function() {

        if (document.querySelector('.o-modal--close') != null) {
            this.SpotifyToggle();
        }

        if (document.querySelector('.c-footer-navigation__group-link') != null) {
            this.ToggleButtonState();
        }

        if (document.querySelector('#js-textarea') != null) {
            this.maxCharacters();
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
    },
    maxCharacters: function() {
        $(document).ready(function() {
          var text_max = 500;
          $('#js-characters').html(0 + '/500' + ' characters remaining');
    
          $('#js-textarea').keyup(function() {
              var text_length = $('#js-textarea').val().length;
              var text_remaining = 0 + text_length;
    
              $('#js-characters').html(text_remaining + '/500' + ' characters remaining');
          });
        });
      },
}