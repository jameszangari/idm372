// Import our styles
import './../styles/main.scss';

// Theme Scripts
var $ = require('jquery');

// Expose Jquery to window
window.$ = window.jQuery = $;

// QuickRefs
window.docQ = document.querySelector.bind(document);
window.docQA = document.querySelectorAll.bind(document);

const Spotify = require('./modules/Spotify'),
    Register = require('./modules/Register'),
    Toggle = require('./modules/Toggle'),
    Validate = require('./modules/Validate');

// Global Logic here
$(document).ready(() => {
    Spotify.init();
    Register.init();
    Toggle.init();
});