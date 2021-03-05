module.exports = function (req, res) {
  const
    config = require('../../../secret/config'),
    request = require('request'),
    authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 'Authorization': 'Basic ' + (Buffer.from(config.client_id + ':' + config.client_secret).toString('base64')) },
      form: {
        grant_type: 'refresh_token',
        refresh_token: req.query.refresh_token
      },
      json: true
    };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send({ access_token: body.access_token });
    } else {
      console.error('Error getting refresh token: ' + response.statusCode);
    }
  });
};