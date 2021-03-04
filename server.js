// ====================
// Modules
// ====================

// NPM Modules
const express = require('express'); // Web Server Framework
const cors = require('cors'); // Cross-origin Access
const cookieParser = require('cookie-parser'); // Headers Cookies
const path = require('path');
const cp = require('child_process');

// ====================
// Start Express Server
// ====================

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8888;

app.use(express.static(path.join(__dirname, 'public')))
    .use(cors())
    .use(cookieParser())
    .use(express.urlencoded({ extended: true, limit: '20mb' }))
    .use(express.json({ limit: '20mb' }));

// Set the view engine to ejs
app.set('view engine', 'ejs');

const server = app.listen(port, () => {
    require('dns').lookup(require('os').hostname(), function (err, ipv4) { // Log the URL to the host
        err ? console.log(err) : console.log(
            'Hosting Locally  @ http://localhost' + ':' + port + '\nHosting Remotely @ http://' + ipv4 + ':' + port
        );
    });
    require("./src/scripts/routes/routes")(app);

    // Start WebSocket
    const io = require('socket.io')(server);
    const webSocket = require('./src/scripts/webSocket');
    webSocket.init(io);
});