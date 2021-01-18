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

// Our Modules
const config = require('./secret/config'); // Secret Keys

// ====================
// Start Express Server
// ====================
require('dotenv').config();

console.log(process.env);

const app = express();
const port = 8888;

app.use(express.static(path.join(__dirname, 'public')))
    .use(cors())
    .use(cookieParser())
    .use(express.urlencoded({ extended: true }));
// Set the view engine to ejs
app.set('view engine', 'ejs');

app.listen(port);
// Use res.render to load up an ejs view file
require('dns').lookup(require('os').hostname(), function (err, ipv4) { // Log the URL to the host
    err ? console.log(err) : console.log(`Hosting Local Node Server @ http://${ipv4}:${port}`);
});
require("./src/scripts/routes/routes")(app);