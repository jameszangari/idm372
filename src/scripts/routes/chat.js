// Requires
const firebase = require('../firebase'); // FireBase Functions

function getName(uuid) {
    return new Promise(async function (resolve, reject) {
        const docRef = await firebase.db().collection('users').doc(uuid);
        docRef.get().then(function (doc) {
            resolve(doc.data().first_name)
        }).catch(function (error) {
            reject(Error(error));
        });
    });
}

function getMessages(threadId) {
    return new Promise(async function (resolve, reject) {
        const docRef = await firebase.db().collection('chats').doc(threadId).collection('messages')
            .orderBy('when', 'asc');
        docRef.get().then(function (doc) {
            resolve(doc)
        }).catch(function (error) {
            reject(Error(error));
        });
    });
}

function getLastMessage(threadId) {
    threadId = 'thread-gabrielleroseh-zhlwu23ldecrebpglkybysvvf';
    return new Promise(async function (resolve, reject) {
        const docRef = await firebase.db().collection('chats').doc(threadId).collection('messages')
            .orderBy('when', 'desc')
            .limit(1);
        docRef.get().then(function (doc) {
            resolve(doc.docs[0].data())
        }).catch(function (error) {
            reject(Error(error));
        });
    });
}


module.exports = async function (req, res) {
    const reqData = req.query;

    if (reqData.query == 'list-chats') {
        const threads = [];
        // Query
        const docRef = await firebase.db().collection('chats')
            .where("participants", "array-contains", reqData.uuid) // Only threads the user is apart of
            .get();
        let i = 0;
        docRef.forEach((doc) => {
            i++;
            const data = doc.data();
            const thread_id = firebase.getThread(data.participants[0], data.participants[1]);
            let targetUUID;
            data.participants[0] == reqData.uuid ? targetUUID = data.participants[1] : targetUUID = data.participants[0];

            getName(targetUUID).then((targetName) => {
                getLastMessage(thread_id).then((message) => {
                    const thread = {
                        thread_id: thread_id,
                        target_id: targetUUID,
                        last_activity: data.last_activity,
                        target_name: targetName,
                        preview: message.content
                    }
                    console.log('preview: ', message.content);
                    threads.push(thread);
                }, function (err) { // Catch Error
                    console.log(err);
                    res.send(false);
                });
            }, function (err) { // Catch Error
                console.log(err);
                res.send(false);
            });

            if (i != docRef.size) {
            } else { // When done
                function sendThreads() {
                    res.send(threads);
                }
                function checkThreads() { // Check if data is ready
                    console.log('Checking');
                    if (docRef.size == threads.length) {
                        sendThreads();
                    } else {
                        setTimeout(() => {
                            checkThreads();
                        }, 100);
                    }
                }
                checkThreads();
            }
        });

        // Add Chat Browser Front-End Data
        // 1. Last message preview

    } else if (reqData.query == 'get-history') {
        getMessages(reqData.thread).then((messages) => {
            console.log(messages);
            // res.send(messages);
        }, function (err) { // Catch Error
            console.log(err);
            res.send(false);
        });
    }
}