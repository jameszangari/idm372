const io = require('socket.io-client');

module.exports = {
    socket: io.io({ transports: ['websocket'], upgrade: false })
}