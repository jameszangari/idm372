const config = require('../../../secret/config'); // Secret Keys
const request = require("request");

module.exports = function(req, res) {

console.log(req.query.playlist);

	var headers = {
		 'Accept': 'application/json',
		 'Content-Type': 'application/json',
		 'Authorization': `Bearer ${req.query.access_token}`
	};

	var options = {
		 url: `https://api.spotify.com/v1/playlists/${req.query.playlist}`,
		 headers: headers
	};

	function callback(error, response, body) {
		 if (!error && response.statusCode == 200) {
			  obj = JSON.parse(body);
			  console.log(obj.tracks);
			  res.send(obj.tracks);
		 }
		 else if (error) {
			 console.log(error);
			 console.log('error');
		 }
		 else {
			 console.log(response.statusCode);
		 }
	}

	request(options, callback);
}