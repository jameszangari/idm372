//check if connected page
const lconnected = docQ('.l-connected');

//requires
const endpoints = require('../config/endpoints.json');
const helper = require('../helper');

// Cookies
const spotifyObjectString = helper.getCookie('spotify');
const spotifyObject = JSON.parse(spotifyObjectString);

if (lconnected) { //if on right page
	function sendrequest(type) {
		$.ajax({
			url: endpoints.connected.url,
			data: {
				access_token: spotifyObject.access_token,
				refresh_token: spotifyObject.refresh_token,
				type: type
			}
		}).done(function (results) { //receive info, populate html, add event listeners to tracks to add as anthem
			// Add tracks to page in search results
			const form = docQ('#firestore_form');

			if (results.artists.length > 0) {
				const artists = results.artists;
				let i = 0;
				artists.forEach(artist => {
					form.innerHTML += `
					<input type="text" name="artist_${i}_id" value="${artist.id}"></input>
					<input type="text" name="artist_${i}_title" value="${artist.title}"></input>
					<input type="text" name="artist_${i}_href" value="${artist.href}"></input>
					<input type="text" name="artist_${i}_thumb" value="${artist.thumb}"></input>
					`;
					const section = docQ('section.group--artists');
					const imgEl = section.querySelectorAll('.l-connected__item-image')[i];
					imgEl.src = artist.thumb;
					const nameEl = section.querySelectorAll('.l-connected__item-text')[i];
					nameEl.innerText = helper.truncateString(artist.title, 30);
					i++;
				});
			} else if (results.tracks.length > 0) {
				const tracks = results.tracks;
				let i = 0;
				tracks.forEach(track => {
					form.innerHTML += `
					<input type="text" name="track_${i}_id" value="${track.id}"></input>
					<input type="text" name="track_${i}_title" value="${track.title}"></input>
					<input type="text" name="track_${i}_href" value="${track.href}"></input>
					<input type="text" name="track_${i}_thumb" value="${track.thumb}"></input>
					`;
					const section = docQ('section.group--tracks');
					const imgEl = section.querySelectorAll('.l-connected__item-image')[i];
					imgEl.src = track.thumb;
					const nameEl = section.querySelectorAll('.l-connected__item-text')[i];
					nameEl.innerText = helper.truncateString(track.title, 30);
					i++;
				});
			}
		});
	}
	sendrequest('artists');
	sendrequest('tracks');
}