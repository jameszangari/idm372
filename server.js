// ====================
// Modules
// ====================

// NPM Modules
const express = require('express'); // Web Server Framework
const session = require('express-session');
const request = require('request'); // "Request" library
const cors = require('cors'); // Cross-origin Access
const cookieParser = require('cookie-parser'); // Headers Cookies
const path = require('path');

// // Our Modules
const config = require('./secret/config'); // Secret Keys
// ====================
// Start Express Server
// ====================

const app = express();
const port = 8888;

app.use(express.static(path.join(__dirname, 'public')))
    .use(cors())
    .use(cookieParser())
    .use(express.urlencoded({ extended: true })); 
// set the view engine to ejs
app.set('view engine', 'ejs');

app.listen(port);
console.log('Server started at localhost:' + port);
// use res.render to load up an ejs view file
require("./src/scripts/routes/routes")(app);
