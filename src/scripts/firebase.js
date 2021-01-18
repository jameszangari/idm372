const { credential } = require('firebase-admin');
const firebaseAdmin = require('firebase-admin'); // FireBase Functions
const config = require('../../secret/config'); // Secret Keys
module.exports = {
  init: function () {
    firebaseAdmin.initializeApp({ // Init Admin SDK w/ Keys
      // credential: firebaseAdmin.credential.cert(config)
      credential: firebaseAdmin.credential.cert({
        private_key: process.env.SECRET_FIREBASE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  },
  db: function () {
    return firebaseAdmin.firestore();
  }
}
