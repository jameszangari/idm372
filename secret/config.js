require('dotenv').config();

module.exports = config = {

	// SPOTIFY
	client_id: process.env.SECRET_SPOTIFY_CLIENT_ID,
	client_secret: process.env.SECRET_SPOTIFY_CLIENT,
	redirect_uri: process.env.SECRET_SPOTIFY_REDIRECT,

	// FIREBASE
	type: "service_account",
	project_id: "shuffle-devtest",
	private_key_id: process.env.SECRET_FIREBASE_KEY_ID,
	private_key: process.env.SECRET_FIREBASE_KEY,
	// private_key: process.env.SECRET_FIREBASE_KEY.replace(/\\n/g, '\n'),
	// private_key: JSON.parse(process.env.SECRET_FIREBASE_KEY),
	client_email: "firebase-adminsdk-fppxu@shuffle-devtest.iam.gserviceaccount.com",
	firebase_client_id: process.env.SECRET_FIREBASE_CLIENT_ID,
	auth_uri: "https://accounts.google.com/o/oauth2/auth",
	token_uri: "https://oauth2.googleapis.com/token",
	auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
	client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fppxu%40shuffle-devtest.iam.gserviceaccount.com"

}