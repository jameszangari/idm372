const firebaseAdmin = require('firebase-admin'); // FireBase Functions
const config = require('../../secret/config'); // Secret Keys

module.exports = {
  init: function () {
    firebaseAdmin.initializeApp({ // Init Admin SDK w/ Keys
      credential: firebaseAdmin.credential.cert(config)
    });
  },
  db: function () {
    return firebaseAdmin.firestore();
  },
  getThread: function (uuid1, uuid2) {
    // Determines what the thread_id will be based on the two uuid's supplied
    let thread_id;
    uuid1 > uuid2 ? thread_id = uuid1 + '-' + uuid2 : thread_id = uuid2 + '-' + uuid1;
    return 'thread-' + thread_id;
  },
  getName: function (uuid) { // Turns UUID strings into first_name
    const docRef = firebaseAdmin.firestore().collection('users').doc(uuid);
    return docRef.get()
      .then(doc => doc.data().first_name)
      .catch(error => console.log(error));
  }
}