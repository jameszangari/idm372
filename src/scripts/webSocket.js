const firebase = require('./firebase');

let activeSockets = new Set();
let activeSubs = [];

function unSubAll(socketId) {
    if (activeSubs[socketId]) {
        activeSubs[socketId].subs.forEach(sub => {
            sub();
        });
    }
}

function subToThread(socket, threadId, uuid) {
    let i = 0;
    const docRef = firebase.db().collection('chats').doc(threadId).collection('messages').orderBy('when', 'desc');
    const sub = docRef.onSnapshot(snapshot => { // Observer
        i++;
        if (i > 1 && snapshot.docs[0]) {
            const newMessage = snapshot.docs[0].data();
            newMessage.from != uuid && socket.emit('new-message', newMessage);
        }
    }, err => {
        console.log(`Encountered error: ${err}`);
    });

    // Track User Subs
    activeSubs[socket.id] = { subs: [] };
    activeSubs[socket.id].subs.push(sub);
}

module.exports = {
    init: (io) => {
        io.on('connection', (socket) => {
            activeSockets.add(socket);
            // console.log('Clients: ' + activeSockets.size);

            socket.on('disconnect', () => {
                unSubAll(socket.id);
                activeSockets.delete(socket);
                delete activeSubs[socket.id];
                // console.log('Clients: ' + activeSockets.size);
            });

            socket.on('sub-to-thread', (data) => {
                subToThread(socket, data.thread, data.uuid);
            });
        });
    }
}