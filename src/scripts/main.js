// Import our styles
import './../styles/main.scss';
const firebase = require('firebase'); // FireBase Functions

// Theme Scripts
var $ = require('jquery');

// Expose Jquery to window
window.$ = window.jQuery = $;

const Spotify = require('./modules/Spotify')

// Gloabl Logic here
$(document).ready(function() {
    Spotify.init();
});
