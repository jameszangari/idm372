module.exports = function (req, res) {
	res.clearCookie('shuffle');
	const
		config = require('../../../secret/config'),
		querystring = require('querystring'),
		request = require('request'),
		firebase = require('../firebase'),
		endpoints = require('../config/endpoints.json'),
		stateKey = 'spotify_auth_state',
		code = req.query.code || null,
		state = req.query.state || null,
		storedState = req.cookies ? req.cookies[stateKey] : null;

	if (state === null || state !== storedState) {
		res.redirect('/#' + querystring.stringify({ error: 'state_mismatch' }));
	} else {
		res.clearCookie(stateKey);
		const authOptions = {
			url: 'https://accounts.spotify.com/api/token',
			form: {
				code: code,
				redirect_uri: config.redirect_uri,
				grant_type: 'authorization_code'
			},
			headers: {
				'Authorization': 'Basic ' + (Buffer.from(config.client_id + ':' + config.client_secret).toString('base64'))
			},
			json: true
		};

		request.post(authOptions, function (error, response, body) {
			if (!error && response.statusCode === 200) {
				let
					access_token = body.access_token,
					refresh_token = body.refresh_token,
					options = {
						url: 'https://api.spotify.com/v1/me',
						headers: { 'Authorization': 'Bearer ' + access_token },
						json: true
					};

				// ===== SEND INFO FROM RESPONSE BACK TO FIREBASE =====
				request.get(options, function (error, response, body) {
					getDialogue(body).then(userObj => {
						redirect_to_shuffle(res, {
							uuid: body.id,
							email: userObj.email,
							access_token: access_token,
							refresh_token: refresh_token
						});
					}).catch((error) => {
						console.error(error);
					});
				});
			} else {
				console.error(error);
				res.redirect('/#' + querystring.stringify({ error: 'invalid_token' }));
			}
		});
	}

	function getDialogue(body) {
		return new Promise(function (resolve, reject) {
			resolve({
				"email": body.email
			});
		})
	}

	function redirect_to_shuffle(res, spotifyData) {
		res.cookie('shuffle', JSON.stringify({
			uuid: spotifyData.uuid,
			access_token: spotifyData.access_token,
			refresh_token: spotifyData.refresh_token
		}));

		const docRef = firebase.db().collection('users').doc(spotifyData.uuid);
		docRef.get().then((doc) => {
			const docData = doc.data();

			let method;
			doc.exists ? method = 'update' : method = 'set';

			let profileComplete;
			(docData.profileComplete == true || docData.profileComplete == 'true') ? profileComplete = true : profileComplete = false;

			docRef[method]({
				email: spotifyData.email,
				profileComplete: profileComplete
			}).then(() => {
				let redirect;
				profileComplete ? redirect = endpoints.pages.browse.url : redirect = endpoints.pages.registerProfile.url;
				return res.redirect(redirect);
			}).catch((error) => {
				console.error(error);
			});
		});
	}
}