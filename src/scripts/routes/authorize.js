// Runs when user clicks button on initial page href = authorize. sends request to spotify. spotify sends this back to /callback which runs callback.js
module.exports = function (req, res) {
	const
		helper = require('../helper'),
		querystring = require('querystring'),
		config = require('../../../secret/config'),
		stateKey = 'spotify_auth_state',
		state = helper.generateRandomString(16),
		scope = 'user-read-private user-read-email user-top-read';

	res.cookie(stateKey, state);
	res.redirect('https://accounts.spotify.com/authorize?' +
		querystring.stringify({
			response_type: 'code',
			client_id: config.client_id,
			scope: scope,
			redirect_uri: config.redirect_uri,
			state: state,
			show_dialog: !!!req.cookies.shuffle
		}));
}