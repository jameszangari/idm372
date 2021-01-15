// Import our styles
import './../styles/main.scss';
const firebase = require('firebase'); // FireBase Functions

// Theme Scripts
var $ = require('jquery');

// Expose Jquery to window
window.$ = window.jQuery = $;

// QuickRefs
window.docQ = document.querySelector.bind(document);
window.docQA = document.querySelectorAll.bind(document);

const Spotify = require('./modules/Spotify');
const Register = require('./modules/Register');

// Global Logic here
$(document).ready(() => {
    Spotify.init();
    Register.init();
});