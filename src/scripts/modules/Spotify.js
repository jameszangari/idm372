const endpoints = require('../config/endpoints.json');
const helper = require('../helper');
const Validate = require('./Validate');

// Cookies
const spotifyObjectString = helper.getCookie('spotify');
const spotifyObject = JSON.parse(spotifyObjectString);

const spotifySearchForm = docQ('#searchSpotify');
module.exports = {
  init: function () {
    if (spotifySearchForm) this.search();
    else return;
  },
  search: function () { // Searches the Spotify database
    const searchForm = docQ('#searchSpotify'),
      search_input = docQ('#search_input'),
      search_result_wrap = docQ('.o-spotify-select'),
      choice_wrap = docQ('.o-spotify-choice'),
      cancel_button = docQ('.o-spotify-choice--cancel'),
      choice_area = docQ('.o-spotify-choice--area');

    searchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const query = search_input.value.trim(), // What the user searches for, trim white space from front and back
        searchcategory = search_input.dataset.searchcategory, // What the user searches for
        search_results = docQ('#search_results');
      search_results.innerHTML = ''; //clear out previous results

      // Modal
      docQ('.o-spotify-select--close').addEventListener('click', () => {
        search_result_wrap.hidden = true;
      });

      // Searching
      if (!query) { // If search has no input
        Validate.toggleInvalid(true, search_input, 'This field is required to perform search');
        return;
      } else {
        Validate.toggleInvalid(false, search_input);

        $.ajax({ //
          url: endpoints.search.url,
          data: {
            access_token: spotifyObject.access_token,
            refresh_token: spotifyObject.refresh_token,
            query: query,
            searchcategory: searchcategory
          }
        }).done(function (results) { //receive info, populate html, add event listeners to tracks to add as anthem
          search_result_wrap.hidden = false;
          search_results.innerHTML = ''; // Clear previous results
          // Add tracks to page in search results
          results.forEach(result => {
            if (result.id) { // Skip the empty results (Idk why Spotify returns those...)
              const track_element = document.createElement('div'); // Create a div element (Better to do it this way for adding event listener later)
              track_element.classList.add('o-spotify-select--track'); // Add the class 'track'

              // Then add the content
              track_element.innerHTML += `
                <img class="o-spotify-select--image" src="${result.thumb}">
                <div class="o-spotify-select--track-info">
                  <h3 class="track_title">${helper.truncateString(result.title, 50)}</h3>
                  <h5 class="track_artist">${result.artist || ''}</h5>
                </div>
                <div class="o-spotify-select--selected" hidden>
                  <i class="fas fa-check"></i>
                </div>
              `;
              // <h5 class="track_artist">${artist + (artist ? ' - ' + artist : '')}</h5>

              // Add the track element to the DOM
              search_results.appendChild(track_element);

              function rmChoice() { // Hide choice
                docQA('#firestore_form input').forEach(input => {
                  input.value = '';
                });
                choice_area.innerHTML = '';
                choice_wrap.hidden = true;
              }

              function displayChoice(result) { // Display choice
                choice_wrap.hidden = false;
                docQ('input#result_id').value = result.id;
                docQ('input#result_title').value = result.title;
                if (docQ('input#result_artist')) docQ('input#result_artist').value = result.artist; // This one is optional for artist search
                docQ('input#result_thumb').value = result.thumb;
                docQ('input#result_album').value = result.album;

                choice_area.innerHTML = `
                  <img class="o-spotify-choice--image" src="${result.thumb}">
                  <div class="o-spotify-choice--track-info">
                    <h3 class="track_title">${helper.truncateString(result.title, 50)}</h3>
                    <h5 class="track_artist">${result.artist}</h5>
                  </div>
                `;
              }

              cancel_button.addEventListener('click', rmChoice);

              track_element.addEventListener('click', () => { // When user picks a track
                docQA('.o-spotify-select--track').forEach(track => {
                  const check = track.querySelector('.o-spotify-select--selected');
                  if (track == track_element) { // The one picked
                    if (!check.hidden) { // If already selected
                      check.hidden = true; // Uncheck
                      rmChoice();
                    } else {
                      check.hidden = false; // Check
                      displayChoice(result);
                    }
                  } else {
                    check.hidden = true; // Hide all other checks
                  }
                });
              });
            }
          });
        });
      }
    }, false);
  }
}