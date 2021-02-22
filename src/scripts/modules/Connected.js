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
					if (imgEl != undefined) { //patch bc the ajax request now returns 6 things, to recycle it for edit feature
						imgEl.src = artist.thumb;
						const nameEl = section.querySelectorAll('.l-connected__item-text')[i];
						nameEl.innerText = helper.truncateString(artist.title, 30);
					}
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
					if (imgEl != undefined) { //patch bc the ajax request now returns 6 things, to recycle it for edit feature
						imgEl.src = track.thumb;
						const nameEl = section.querySelectorAll('.l-connected__item-text')[i];
						nameEl.innerText = helper.truncateString(track.title, 30);
					}
					i++;
				});
			}
		});
	}
	
	//search function if user hits edit button
	function searchForConnected() {
		const searchForm = docQ('#searchSpotify'),
      search_input = docQ('#search_input'),
      search_result_wrap = docQ('.o-spotify-select'),
      choice_wrap = docQ('.o-spotify-choice'),
      cancel_button = docQ('.o-spotify-choice--cancel'),
      choice_area = docQ('.o-spotify-choice--area');
		
		$.ajax({
			url: endpoints.connected.url,
			data: {
				access_token: spotifyObject.access_token,
				refresh_token: spotifyObject.refresh_token,
				type: 'artists'
			}
		}).done(function (results) { //receive info, populate html, add event listeners to tracks to add as anthem
			 console.log(results.artists[1]);
			 let i = 0;
			 let result = results.artists[i];
			 while (i < 6) {
				  console.log(results.artists[i]);
              const track_element = document.createElement('div'); // Create a div element (Better to do it this way for adding event listener later)
              track_element.classList.add('o-spotify-select--track'); // Add the class 'track'

              // Then add the content
              track_element.innerHTML += `
                <img class="o-spotify-select--image" src="${results.artists[i].thumb}">
                <div class="o-spotify-select--track-info">
                  <h3 class="track_title">${helper.truncateString(results.artists[i].title, 50)}</h3>
                </div>
					 `;
				  if (i <3) {
				  track_element.innerHTML += `
                <div class="o-spotify-select--selected">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                  <defs/>
                  <path fill="#F72585" fill-rule="evenodd" d="M5.64482 9.08453L13.722.29949c.3671-.39932.9586-.39932 1.3257 0L16.088 1.4309c.3671.39932.3671 1.04266 0 1.4198L6.31791 13.4992c-.36714.3994-.95865.3994-1.32579 0L.260059 8.35244c-.3467454-.37713-.3467454-1.02048 0-1.4198L1.32069 5.80123c.34675-.39932.93826-.39932 1.3054 0l3.01873 3.2833z" clip-rule="evenodd"/>
                  </svg>
                </div>
              `;
				  }
				  else {
				  track_element.innerHTML += `
                <div class="o-spotify-select--selected" hidden>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                  <defs/>
                  <path fill="#F72585" fill-rule="evenodd" d="M5.64482 9.08453L13.722.29949c.3671-.39932.9586-.39932 1.3257 0L16.088 1.4309c.3671.39932.3671 1.04266 0 1.4198L6.31791 13.4992c-.36714.3994-.95865.3994-1.32579 0L.260059 8.35244c-.3467454-.37713-.3467454-1.02048 0-1.4198L1.32069 5.80123c.34675-.39932.93826-.39932 1.3054 0l3.01873 3.2833z" clip-rule="evenodd"/>
                  </svg>
                </div>
              `;  
				  }
              // <h5 class="track_artist">${artist + (artist ? ' - ' + artist : '')}</h5>

              // Add the track element to the DOM
              search_results.appendChild(track_element);

              function rmChoice() { // Hide choice
                docQA('#firestore_form input').forEach(input => {
                  input.value = '';
                });
                choice_area.innerHTML = '';
                //choice_wrap.hidden = true;
              }

              function displayChoice(result) { // Display choice
                choice_wrap.hidden = false;
                docQ('input#result_id').value = result.id;
                docQ('input#result_title').value = result.title;
                if (docQ('input#result_artist')) docQ('input#result_artist').value = result.artist; // This one is optional for artist search
                docQ('input#result_thumb').value = result.thumb;

                choice_area.innerHTML = `
                  <img class="o-spotify-choice--image" src="${result.thumb}">
                  <div class="o-spotify-choice--track-info">
                    <h3 class="track_title">${helper.truncateString(result.title, 50)}</h3>
                    <h5 class="track_artist">${result.artist}</h5>
                  </div>
                `;
              }

              //cancel_button.addEventListener('click', rmChoice);

              track_element.addEventListener('click', () => { // When user picks a track
					 let count = 0;
                docQA('.o-spotify-select--track').forEach(track => {
                  let check = track.querySelector('.o-spotify-select--selected');
						
						 if (!check.hidden) {
							 count++;
						 }
                  if (track == track_element) { // The one picked
                    if (!check.hidden) { // If already selected
                      check.hidden = true; // Uncheck
                      rmChoice();
                    } else {
                      check.hidden = false; // Check
                      displayChoice(result);
                    }
                  } else {
                    //check.hidden = true; // Hide all other checks
                  }
                });
					  console.log(count);
					  console.log('wut');
              });
				 i++;
          }
        });
		
		
		
		
		document.querySelector('.o-spotify-select').hidden=false;
		document.querySelector('.o-spotify-select--close').addEventListener('click', function() {
			document.querySelector('.o-spotify-select').hidden=true;																					 
		});
	}
	
	sendrequest('artists');
	sendrequest('tracks');
	
	
	let editButtons = document.querySelectorAll(".o-edit-button");
	editButtons.forEach(button => {
		button.addEventListener('click', searchForConnected);
	});
}