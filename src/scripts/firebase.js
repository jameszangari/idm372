const { credential } = require('firebase-admin');
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
  }
}
