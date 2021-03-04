const admin = require('firebase-admin'); // FireBase Functions
const config = require('../../secret/config'); // Secret Keys
const moment = require('moment'); // Secret Keys

module.exports = {
	init: function () {
		admin.initializeApp({ // Init Admin SDK w/ Keys
			credential: admin.credential.cert(config),
			databaseURL: 'https://shuffle-devtest.firebaseio.com',
			storageBucket: 'gs://shuffle-devtest.appspot.com'
		});
	},
	db: function () {
		return admin.firestore();
	},
	getTargetUUID: function (threadID, uuid) {
		const array = threadID.split('-');
		let targetUUID;
		array[1] == uuid ? targetUUID = array[2] : targetUUID = array[1];
		return targetUUID;
	},
	getName: function (uuid) { // Turns UUID strings into first_name
		return new Promise(async function (resolve, reject) {
			const docRef = await admin.firestore().collection('users').doc(uuid);
			docRef.get().then(function (doc) {
				resolve(doc.data().first_name)
			}).catch(function (error) {
				reject(Error(error));
			});
		});
	},
	tstamp: function () {
		return admin.firestore.FieldValue.serverTimestamp();
	},
	getStorageURL: (filePath) => {
		return new Promise(async function (resolve, reject) {
			await admin.storage().bucket().file(filePath).getSignedUrl({
				version: 'v2',
				action: 'read',
				expires: moment().add(5, 'y') // 5 years
			}).then(function (resp) {
				resolve(resp);
			}).catch(function (error) {
				reject(Error(error));
			});
		});
	}
}