const endpoints = require('../config/endpoints.json');
const helper = require('../helper');

// Cookies
const spotifyObjectString = helper.getCookie('spotify');
const spotifyObject = JSON.parse(spotifyObjectString);

module.exports = {
  init: function () {
    if (docQ('#searchSong')) this.search();
    else return;
  },
  /**
   * Searches the Spotify database
   */
  search: function () {
    const searchForm = docQ('#searchSong');
    const song_search_input = docQ('#song_search_input');

    searchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const query = song_search_input.value, // What the user searches for
        search_results = docQ('#search_results');
      search_results.innerHTML = ''; //clear out previous results
      $.ajax(
        { //send info to server - GET request
          url: endpoints.search.url,
          data:
          {
            'access_token': spotifyObject.access_token,
            'refresh_token': spotifyObject.refresh_token,
            'query': query
          }
        }).done(function (results) { //receive info, populate html, add event listeners to tracks to add as anthem
          // Add tracks to page in search results
          song_submit_button.hidden = true;
          search_results.innerHTML = ''; //clear out previous results
          results.forEach(result => {
            if (result.id) { // Skip the empty results (Idk why Spotify returns those...)
              const id = result.id,
                thumb = result.thumb,
                title = result.title,
                artist = result.artist,
                album = result.album;

              const track_element = document.createElement('div'); // Create a div element (Better to do it this way for adding event listener later)
              track_element.classList.add('track'); // Add the class 'track'

              // Then add the content
              track_element.innerHTML += `
                      <img src="${thumb}" id="track_thumbnail">
                      <div class="track_info">
                          <h3 class="track_title">${title}</h3>
                          <h5 class="track_artist">${artist} - ${album}</h5>
                      </div>
                  `;

              // Add the track element to the DOM
              search_results.appendChild(track_element);
              // Add an event listener to it
              track_element.addEventListener('click', () => {
                // Add a data attribute called anthem to the anthem id input for when user completes sign up
                song_id.value = id;
                search_results.innerHTML = ''; //clear out previous results
                song_submit_button.hidden = false;
                // broadcast('Anthem Added!', 'var(--green)');
              });
            }
          });
        });
    }, false);
  }
}