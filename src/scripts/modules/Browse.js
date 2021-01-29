const profile_list = docQ('#profile_list');

if (profile_list) { // Check if we are on browse page
    // Required
    const endpoints = require('../config/endpoints.json');
    const helper = require('../helper');

    // Cookies
    const spotifyObjectString = helper.getCookie('spotify');
    const spotifyObject = JSON.parse(spotifyObjectString);

    // Functions
    $.ajax({
        url: endpoints.list.url,
        data: {
            uuid: spotifyObject.user_id
        }
    }).done((response) => {
        // Do stuff after
        response ? listUsers(response) : console.error('There was a server error...');
    });

    // List the users
    function listUsers(users) {
        users.forEach(user => {
            // get the profile data by using user.<DB Field Name> (Ex. user.first_name)
            profile_list.innerHTML += `
                    <h2>${user.first_name} ${user.last_name}</h2>
                    <p>${user.bday}</p>
                    <p>${user.song}</p>
                `;
        });
    }
}