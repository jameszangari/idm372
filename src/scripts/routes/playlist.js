module.exports = function (req, res) {
	const
		request = require("request"),
		options = {
			url: `https://api.spotify.com/v1/playlists/${req.query.playlist}`,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${req.query.access_token}`
			}
		};

	function callback(error, response, body) {
		if (!error && response.statusCode == 200) {
			obj = JSON.parse(body);
			res.send(obj.tracks);
		} else if (error) {
			console.log(error);
		} else {
			console.error(response.statusCode);
		}
	}

	request(options, callback);
}