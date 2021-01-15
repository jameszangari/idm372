const firebaseAdmin = require('firebase-admin'); // FireBase Functions
const serviceAccount = require('../../secret/serviceAccountKey.json');
module.exports = {
  init: function () {
    firebaseAdmin.initializeApp({ // Init Admin SDK w/ Keys
      credential: firebaseAdmin.credential.cert(serviceAccount)
    });
  },
  db: function() {
    return firebaseAdmin.firestore();
  }
}
