//check if connected page
const lconnected = docQ('.l-connected');

//requires
const endpoints = require('../config/endpoints.json');
const helper = require('../helper');
const Validate = require('./Validate');

// Cookies
const spotifyObjectString = helper.getCookie('spotify');
const spotifyObject = JSON.parse(spotifyObjectString);

if (lconnected) { //if on right page
	let itemName = docQA('.l-connected__artists--item-text');
	let itemImage = docQA('.l-connected__artists--item-image');
	console.log(itemName[1]);

	function sendrequest(type, i) {
		$.ajax({ //send info to server - GET request
			url: endpoints.connected.url,
			data: {
				access_token: spotifyObject.access_token,
				refresh_token: spotifyObject.refresh_token,
				type: type
			}
		}).done(function (results) { //receive info, populate html, add event listeners to tracks to add as anthem
			// Add tracks to page in search results

			results.forEach(result => {
				if (result.name) { // Skip the empty results
					itemName[i].innerHTML = result.name;
					itemImage[i].src = result.thumb;
					i++;
				}
			});
		});
	}
	sendrequest('artists', 0);
	sendrequest('tracks', 3);

}