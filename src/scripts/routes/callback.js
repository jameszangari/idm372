const config = require('../../../secret/config'); // Secret Keys
const querystring = require('querystring'); // Parse and stringify URL query strings
const request = require('request'); // "Request" library
const firebase = require('../firebase'); // FireBase Functions
const endpoints = require('../config/endpoints.json');

module.exports = function(req, res)
{
  res.clearCookie('spotify');
  const stateKey = 'spotify_auth_state';

  // Authorization Check
  // your application requests refresh and access tokens
  // after checking the state parameter
  // first get spotify request's secret keys or set to null
  var code = req.query.code || null;
  var state = req.query.state || null;

  // check if we saved a state (our code for authentication)
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  // if state isnt right we don't take the response
  if (state === null || state !== storedState)
  {
    res.redirect('/#' +
      querystring.stringify(
      {
        error: 'state_mismatch'
      }));
  }
  else
  { // if the state checks out, we go ahead and get the response
    res.clearCookie(stateKey);
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form:
      {
        code: code,
        redirect_uri: config.redirect_uri,
        grant_type: 'authorization_code'
      },
      headers:
      {
        'Authorization': 'Basic ' + (Buffer.from(config.client_id + ':' + config.client_secret).toString('base64'))
      },
      json: true
    };

    // handle the response
    request.post(authOptions, function(error, response, body)
    {
      if (!error && response.statusCode === 200)
      {

        var access_token = body.access_token,
          refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers:
          {
            'Authorization': 'Bearer ' + access_token
          },
          json: true
        };

        // here is where we get the response
        // body is what we want to send
        // use the access token to access the Spotify Web API

        // ===== SEND INFO FROM RESPONSE BACK TO FIREBASE =====
        request.get(options, function(error, response, body)
        {
          getDialogue(body).then(result =>
          {

            const obj = result;
            const user_id = body.id; // Set current user id

            // Now check if user exists already...
            const docRef = firebase.db().collection('users').doc(user_id);
            docRef.get().then(function(doc)
            {
              doc.exists ? user_status = false : user_status = true; // Get new user status
              redirect_to_shuffle(res, docRef, obj, user_id, user_status, access_token, refresh_token, req); // Send data to redirect
            }).catch(function(error)
            {
              console.log(error);
            });

          });
        });

        // we can also pass the token to the browser to make requests from there
        // res.redirect('/#' +
        //   querystring.stringify({
        //     access_token: access_token,
        //     refresh_token: refresh_token
        //   }));

      }
      else
      {
        // TODO send to 400 page and maybe send error to discord or something
        console.log(error);
        res.redirect('/#' +
          querystring.stringify(
          {
            error: 'invalid_token'
          }));
      }
    });
  }

  function getDialogue(thebody)
  {
    // return a promise since we'll imitating an API call
    return new Promise(function(resolve, reject)
    {
      resolve(
      {
        "country": thebody.country,
        "email": thebody.email
      });
    })
  }

  function redirect_to_shuffle(res, docRef, obj, user_id, user_status, access_token, refresh_token, req)
  {
    res.clearCookie('spotify');
    if (user_status)
    { // New Users
      const data = { // User fields to add
        country: obj.country,
        email: obj.email,
        new_user: user_status
      };
      docRef.set(data).then(function()
      { // Using .SET() method
        console.log(`Added ${user_id} to DB!`);
      }).catch(function(error)
      {
        console.error(error);
      });
    }
    else
    { // Returning Users
      const data = { // User fields to add
        country: obj.country,
        email: obj.email,
        // new_user: 'true' // TEMP HACK FOR DEV - DELETE THIS LINE
      };
      docRef.update(data).then(function()
      { // Using .UPDATE() method
        console.log(`Updated ${user_id} in DB!`);
      }).catch(function(error)
      {
        console.error(error);
      });
    }

    // Redirect w/ hash params

    // TODO: Set object in local storage spotify :
    var spotifyObject = {
      user_id: user_id,
      new_user: user_status,
      access_token: access_token,
      refresh_token: refresh_token
    };
    res.cookie('spotify', JSON.stringify(spotifyObject));
    return res.redirect(endpoints.registerConnected.url);
  }

}