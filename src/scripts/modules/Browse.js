// Required
const endpoints = require('../config/endpoints.json');
const helper = require('../helper');
const Lists = require('./Lists');

// Cookies
const spotifyObjectString = helper.getCookie('spotify');
const spotifyObject = JSON.parse(spotifyObjectString);

// Page Identifier
const title = docQ('.c-header-navigation__title');
const user_view = docQ('.user_view');

if (title.innerText == endpoints.browse.title) { // Check if we are on browse page
    const profile_list = docQ('#profile_list');

    // Functions
    $.ajax({
        url: endpoints.users.url,
        data: {
            uuid: spotifyObject.user_id,
            queryCategory: 'all-users'
        }
    }).done((response) => {
        // Do stuff after
        response ? listUsers(response) : console.error('There was a server error...');
    });

    // List the users
    function listUsers(users) {
        users.forEach(user => {
            // quickRefs
            const data = user.data;
            // get the profile data by using user.<DB Field Name> (Ex. user.first_name)
            const el = document.createElement('div');
            el.innerHTML += `
                <h2>${data.first_name} ${data.last_name}</h2>
                <p>Pronouns: ${Lists.lists.pronouns[data.pronouns]}</p>
                <p>Bday: ${helper.getAge(data.bday)}</p>
                <p>Bio: ${data.bio}</p>
                <p>Fav Song:</p>
                <iframe src="https://open.spotify.com/embed/track/${data.song}" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
            `;
            profile_list.appendChild(el);
            el.addEventListener('click', () => {
                displayUser(user);
            });
        });
    }
} else if (title.innerText == endpoints.profile.title) { // User's own profile
    $.ajax({
        url: endpoints.users.url,
        data: {
            uuid: spotifyObject.user_id,
            queryCategory: 'single-user',
            target: spotifyObject.user_id
        }
    }).done((response) => {
        // Do stuff after
        if (response) displayUser(response.data);
        else console.error('There was a server error...');
    });
}

function displayUser(user) {
    // Display the user
    user_view.hidden = false;
    user_view.innerHTML = `
        <h2>${user.first_name} ${user.last_name}</h2>
        <p>Pronouns: ${Lists.lists.pronouns[user.pronouns]}</p>
        <p>Bday: ${helper.getAge(user.bday)}</p>
        <p>Bio: ${user.bio}</p>
        <p>Fav Song:</p>
        <iframe src="https://open.spotify.com/embed/track/${user.song}" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
    `;
}