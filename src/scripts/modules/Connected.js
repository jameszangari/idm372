//check if connected page
const lconnected = docQ('.l-connected');

//requires
const endpoints = require('../config/endpoints.json');
const helper = require('../helper');

// Cookies
const shuffleCookie = helper.shuffleCookie();

if (lconnected) { //if on right page
	
	let count=3; //how many tracks are currently selected. starts at 3
	
	//handle selection logic in edit modal
	function chooseTrack(track_element) {
	  track_element.addEventListener('click', () => { // When user picks a track
			 let check_current_track = track_element.querySelector('.o-modal--selected');
			 if (check_current_track.hidden && count < 3) { //if not selected and total selected < 3, select
					check_current_track.hidden=false;
					track_element.classList.remove('deselected');
					track_element.classList.add('selected');
					count++;
			 }
			 else if(!check_current_track.hidden) { //if selected, deselect
					check_current_track.hidden=true;
					track_element.classList.add('deselected');
					track_element.classList.remove('selected');
					count--;
			 }
	  });
	}
	
	//get info that automatically shows up on first visit page
	function sendrequest(type) {
		$.ajax({
			url: endpoints.routes.connected.url,
			data: {
				access_token: shuffleCookie.access_token,
				refresh_token: shuffleCookie.refresh_token,
				type: type
			}
		}).done(function (results) { //receive info, populate html, add event listeners to tracks to add as anthem
			// Add tracks to page in search results
			const form = docQ('#firestore_form');

			if (results.artists.length > 0) {
				const artists = results.artists;
				let i = 0;
				artists.forEach(artist => {
					if (i<3) { //returns 6 results bc same ajax used for edit button, so we only take first 3
						//add to firebase
						form.innerHTML += `
						<input type="text" name="artist_${i}_id" value="${artist.id}"></input>
						<input type="text" name="artist_${i}_title" value="${artist.title}"></input>
						<input type="text" name="artist_${i}_href" value="${artist.href}"></input>
						<input type="text" name="artist_${i}_thumb" value="${artist.thumb}"></input>
						`;
						//add to page
						const section = docQ('section.group--artists');
						const imgEl = section.querySelectorAll('.l-connected__item-image')[i];
						imgEl.src = artist.thumb;
						const nameEl = section.querySelectorAll('.l-connected__item-text')[i];
						nameEl.innerText = helper.truncateString(artist.title, 30);
						i++;
					}
				});
			} else if (results.tracks.length > 0) {
				const tracks = results.tracks;
				let i = 0;
				tracks.forEach(track => {
					if (i<3) { //returns 6 results bc same ajax used for edit button, so we only take first 3
						//add to firebase
						form.innerHTML += `
						<input type="text" name="track_${i}_id" value="${track.id}"></input>
						<input type="text" name="track_${i}_title" value="${track.title}"></input>
						<input type="text" name="track_${i}_href" value="${track.href}"></input>
						<input type="text" name="track_${i}_thumb" value="${track.thumb}"></input>
						`;
						//add to page
						const section = docQ('section.group--tracks');
						const imgEl = section.querySelectorAll('.l-connected__item-image')[i];
							imgEl.src = track.thumb;
							const nameEl = section.querySelectorAll('.l-connected__item-text')[i];
							nameEl.innerText = helper.truncateString(track.title, 30);
						i++;
					}
				});
			}
		});
	}
	
	//adds stuff to form and page when modal is closed
	function closeModal(count) {
			if (count==3) {
				let i = 0;
				document.querySelectorAll('.selected').forEach((track) => {
					//get info of current selected
					let title = track.querySelector('.track_title').innerHTML,
					thumb = track.querySelector('.o-modal--image').src,
					id = track.querySelector('.track_id').innerHTML,
					href = track.querySelector('.track_href').innerHTML;
					//handle firebase
					let type = (search_results.classList.contains('artist-list') ? 'artist' : 'track');
					document.querySelector(`input[name="${type}_${i}_id"]`).setAttribute('value', id);
					document.querySelector(`input[name="${type}_${i}_title"]`).setAttribute('value', title);
					document.querySelector(`input[name="${type}_${i}_href"]`).setAttribute('value', href);
					document.querySelector(`input[name="${type}_${i}_thumb"]`).setAttribute('value', thumb);
					//add to page
					const section = docQ(`section.group--${type}s`); //whole section
					section.querySelectorAll('.l-connected__item-image')[i].src=thumb; //image
					section.querySelectorAll('.l-connected__item-text')[i].innerText = helper.truncateString(title, 30); //title
					i++;
				});
			}//end if count=3
	}
	
	//add track element to search result div
	function addElement(thumb, title, href, id) {
	  const track_element = document.createElement('div'); //create track
	  track_element.classList.add('o-modal--track');
	  track_element.classList.add('deselected');
	  track_element.innerHTML += `
		 <img class="o-modal--image" src="${thumb}">
		 <div class="o-modal--track-info">
			<h3 class="track_title">${helper.truncateString(title, 50)}</h3>
		 </div>
		 <div class="track_id" hidden>${id}</div>
		 <div class="track_href" hidden>${href}</div>
		 <div class="o-modal--selected" hidden>
		 	<i class="fas fa-check"></i>
		 </div>
	  `;
		
	  // Add the track element to the DOM
	  search_results.appendChild(track_element);

	  //handle selection
	  chooseTrack(track_element);
	}
	
	//change content in modal if user searches something
	function editSearch(searchinput) {
		let query = searchinput.value.trim();
		let searchcategory = (search_results.classList.contains('artist-list') ? 'artist' : 'track');
		$.ajax({ //
          url: endpoints.routes.search.url,
          data: {
            access_token: shuffleCookie.access_token,
            refresh_token: shuffleCookie.refresh_token,
            query: query,
            searchcategory: searchcategory
          }
        }).done(function (results) {
			$('.deselected').remove();
			results.forEach(result => {
            if (result.id) { // Skip the empty result
					let thumb = result.thumb,
						title = result.title,
						href = result.href,
						id = result.id;
						
					  //create element
					  addElement(thumb, title, href, id);
				}//end if result.id
			});//end results.foreach
		});//end ajax done
	}//end editSearch
	
	//function with initial results if user hits edit button for the first time
	function editConnected(type) {
		search_results.innerHTML='';
		//populate results list if first time hitting edit. if not, go with what was shown last
		if (search_results.innerHTML=='') {
			$.ajax({
				url: endpoints.routes.connected.url,
				data: {
					access_token: shuffleCookie.access_token,
					refresh_token: shuffleCookie.refresh_token,
					type: type
				}
			}).done(function (results) { //receive info, populate html, add event listeners to tracks to add as anthem
				 let i = 0; //iterate through all returns that populate list
				 let len = ((results.artists.length > 0) ? results.artists.length : results.tracks.length);
				 while (i < len) {
					 let thumb = '',
							title = '',
							href = '',
							id = '';
					 if (results.artists.length > 0) {
					 		thumb = results.artists[i].thumb,
							title = results.artists[i].title,
							href = results.artists[i].href,
							id = results.artists[i].id;
						   search_results.classList.add('artist-list');
					      search_results.classList.remove('track-list');
				 	 }
					 else if (results.tracks.length > 0) {
						   thumb = results.tracks[i].thumb,
							title = results.tracks[i].title,
							href = results.tracks[i].href,
							id = results.tracks[i].id;
						   search_results.classList.remove('artist-list');
					 		search_results.classList.add('track-list');
					 }
					  					 
					  //create element
					  addElement(thumb, title, href, id);
					  
					  let j=0;
					  search_results.querySelectorAll('.o-modal--track').forEach((track_element) => {
						  if (j>2) { //after first 3, make it default deselected
							  track_element.querySelector('.o-modal--selected').hidden=true;
							  track_element.classList.add('deselected');
						  }
						  else {
							  track_element.classList.add('selected');
							  track_element.classList.remove('deselected');
							  track_element.querySelector('.o-modal--selected').hidden=false;
						  }
						  j++;
					 }); //end search_results query selector
					 i++;
				 } //end while loop for resulting tracks
			  }); //end done for ajax call
		  } //end if search results are empty
		
		document.querySelector('.o-modal').hidden=false; //make edit list modal visible
	} //end editConnected
	
	//initial connected results
	sendrequest('artists');
	sendrequest('tracks');
	
	//edit connected results
	let editButtons = document.querySelectorAll(".o-edit-button");
	editButtons[0].addEventListener('click', function() {editConnected('artists')});
	editButtons[1].addEventListener('click', function() {editConnected('tracks')});
	
	//make search within connected results
	let searchinput = document.querySelector('.o-modal--search-input');
	searchinput.addEventListener('keyup', function(event) {
		if (event.keyCode === 13) {
			event.preventDefault();
			editSearch(searchinput);
		}
	});
	
	//handle closing modal
	document.querySelector('.o-modal--close').addEventListener('click', function() { //handle done button
			closeModal(count); //handles firebase / display selected results
			document.querySelector('.o-modal').hidden=true;	//hide modal				 
	});
}