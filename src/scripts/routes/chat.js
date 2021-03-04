// Requires
const firebase = require('../firebase'); // FireBase Functions
const helper = require('../helper');

function getMessages(threadId) {
    return new Promise(async function (resolve, reject) {
        const docRef = await firebase.db().collection('chats').doc(threadId).collection('messages')
            .orderBy('when', 'asc');
        docRef.get().then(function (doc) {
            resolve(doc);
        }).catch(function (error) {
            reject(Error(error));
        });
    });
}

function getLastMessage(threadId) {
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
        const threadsArray = [];
        // Query
        const docRef = await firebase.db().collection('chats')
            .where("participants", "array-contains", reqData.uuid) // Only threads the user is apart of
            .orderBy('last_activity', 'desc')
            .get();
        let i = 0;
        if (docRef.size > 0) {
            docRef.forEach((doc) => {
                i++;
                const data = doc.data();
                const thread_id = helper.getThread(data.participants[0], data.participants[1]);
                let targetUUID;
                data.participants[0] == reqData.uuid ? targetUUID = data.participants[1] : targetUUID = data.participants[0];

                firebase.getName(targetUUID).then((targetName) => {
                    getLastMessage(thread_id).then((message) => {
                        const thread = {
                            thread_id: thread_id,
                            target_id: targetUUID,
                            last_activity: data.last_activity,
                            target_name: targetName,
                            preview: message.content
                        }
                        threadsArray.push(thread);
                    }, function (err) { // Catch Error
                        console.log(err);
                        res.send(false);
                    });
                }, function (err) { // Catch Error
                    console.log(err);
                    res.send(false);
                });

                const send = () => { res.send(threadsArray) };

                if (i != docRef.size) {
                } else { // When done
                    function checkArray() { // Check array before sending
                        if (docRef.size == threadsArray.length) {
                            send();
                        } else {
                            if (i > 50) { // Error
                                res.send(false);
                                console.error('Failed to process Threads Array');
                                return;
                            }
                            setTimeout(() => {
                                checkArray();
                            }, 100);
                        }
                    }
                    checkArray();
                }
            });
        } else {
            res.send([]); // Empty Array
        }

    } else if (reqData.query == 'get-history') {
        getMessages(reqData.thread).then((messages) => {
            let messageArray = [];
            let i = 0;
            if (messages.size > 0) {
                messages.docs.forEach(message => {
                    i++;
                    messageArray.push(message.data())
                });

                const send = () => { res.send(messageArray) };

                if (i != messages.size) { // Check array before sending
                } else { // When done
                    function checkArray() { // Check if data is ready
                        if (messages.size == messageArray.length) {
                            send();
                        } else {
                            if (i > 50) { // Error
                                res.send(false);
                                console.error('Failed to process Messages Array');
                                return;
                            }
                            setTimeout(() => {
                                checkArray();
                            }, 100);
                        }
                    }
                    checkArray();
                }
            } else {
                res.send([]) // Empty Array
            }

        }, function (err) { // Catch Error
            console.log(err);
            res.send(false);
        });
    } else if (reqData.query == 'get-target-info') {
        const targetUUID = firebase.getTargetUUID(reqData.thread, reqData.uuid);

        firebase.getName(targetUUID).then((targetName) => {
            res.send({
                uuid: targetUUID,
                name: targetName
            });
        }).catch(function (error) {
            console.log(error);
            res.send('error');
        });
    } else if (reqData.query == 'send-message') {
        // quickRefs
        const threadRef = firebase.db().collection('chats').doc(reqData.thread);
        const docRef = firebase.db().collection('chats').doc(reqData.thread).collection('messages').doc();
        // Create Obj
        const message = {
            from: reqData.uuid,
            content: reqData.content,
            when: firebase.tstamp()
        }
        // Push data to FireStore
        docRef.set(message).then(() => {
            // Set last activity and update participants on thread
            threadRef.set({
                last_activity: firebase.tstamp(),
                participants: [reqData.uuid, firebase.getTargetUUID(reqData.thread, reqData.uuid)]
            }).then(() => {
                res.send(true);
            }).catch(function (error) {
                console.error(error);
                res.send(false);
            });
        }).catch(function (error) {
            console.error(error);
            res.send(false);
        });
    }
}