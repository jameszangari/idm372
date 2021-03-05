// Import our styles
import './../styles/main.scss';

// Theme Scripts
var $ = require('jquery');

// Expose Jquery to window
window.$ = window.jQuery = $;

// QuickRefs
window.docQ = document.querySelector.bind(document);
window.docQA = document.querySelectorAll.bind(document);

const
    AddToHome = require('./modules/AddToHome'),
    Spotify = require('./modules/Spotify'),
    Register = require('./modules/Register'),
    Toggle = require('./modules/Toggle'),
    Validate = require('./modules/Validate'),
    Browse = require('./modules/Browse'),
    Connected = require('./modules/Connected'),
    Images = require('./modules/Images'),
    webSocket = require('./modules/WebSocket'),
    Edit = require('./modules/Edit'),
    RefreshToken = require('./modules/RefreshToken'),
    Chat = require('./modules/Chat'),
    Settings = require('./modules/Settings'),
    Sort = require('./modules/Drag');
// Global Logic here
$(document).ready(() => {
    AddToHome.init();
    if (document.body.className === 'l-grid--login') {
        addToHomescreen();
    }
    Spotify.init();
    Browse.init();
    Register.init();
    Toggle.init();
});