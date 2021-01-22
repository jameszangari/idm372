var $ = require('jquery');

module.exports = {
    init: function() {
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
}