//runs when user clicks button on initial page href = authorize. sends request to spotify. spotify sends this back to /callback which runs callback.js
const helper = require('../helper')
const querystring = require('querystring'); // Parse and stringify URL query strings
const config = require('../../../secret/config'); // Secret Keys

module.exports = function (req, res) {
  // statekey and state are used to redirect user
  const stateKey = 'spotify_auth_state';
  const state = helper.generateRandomString(16);
  // your application requests authorization
  const scope = 'user-read-private user-read-email user-top-read';

  res.cookie(stateKey, state);
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: config.client_id,
      scope: scope,
      redirect_uri: config.redirect_uri,
      state: state
    }));
}