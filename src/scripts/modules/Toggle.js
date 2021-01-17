var $ = require('jquery');

module.exports = {
    init: function() {
        $('.o-spotify-select--close').on('click', function(e) {
            e.preventDefault();
            $('.o-spotify-select--group').toggleClass("o-spotify-select--group-open");
        });
    },
}