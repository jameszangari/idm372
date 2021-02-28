const endpoints = require('../config/endpoints.json');
const Lists = require('./Lists');
const querystring = require('querystring');
const helper = require('../helper');

if (document.cookie) { //runs if the cookie exists - either return user or logged in
	
	//get refresh token, update cookie with it
	function getRefreshToken() {
		
		//get your cookies
		let spotifyObjectString = helper.getCookie('spotify');
		let spotifyObject = JSON.parse(spotifyObjectString);
		
		//make request to spotify
		$.ajax({
			 url: endpoints.routes.refreshToken.url,
			 data: {
				refresh_token: spotifyObject.refresh_token
			 }
		}).done(function (res) {
			//update cookie with new access token
			let spotifyObjectString = helper.getCookie('spotify');
			let spotifyObject = JSON.parse(spotifyObjectString);
			console.log('refreshed token');
			spotifyObject.access_token = res.access_token;
			spotifyObjectString = JSON.stringify(spotifyObject);
			newSpotifyCookie = helper.encodeCookie('spotify', spotifyObjectString);
			document.cookie = newSpotifyCookie;
		}
	)}
	
	getRefreshToken(); //run once on load - if token is already expired, will be fixed. 
	setInterval(getRefreshToken, 3540000); //every 59 minutes, if the script hasnt reloaded, run it again.
}