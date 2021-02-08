module.exports = {
    init: function () {

        if (document.querySelector('.js-browse') == null) {
            return;
        }

        // Required
        const endpoints = require('../config/endpoints.json');
        const helper = require('../helper');
        const Lists = require('./Lists');

        // Cookies
        const spotifyObjectString = helper.getCookie('spotify');
        const spotifyObject = JSON.parse(spotifyObjectString);

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
                el.classList.add('user-card');
                el.innerHTML += `
                    <div class="user-card--top">
                        <p class="stat stat--name u-heading-1">${data.first_name}, ${helper.getAge(data.bday)}</p>
                        <p class="stat stat--pronouns u-heading-4">${Lists.lists.pronouns[data.pronouns]}</p>
                        <p class="stat stat--location u-heading-3">Philadelphia, PA</p>
                    </div>
                    <div class="user-card--btm">
                        <p class="user-card--btm--title">${data.first_name}'s Anthem</p>
                        <div class="media">
                            <iframe src="https://open.spotify.com/embed/track/${data.anthem}" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                            <div class="media--controls">
                                <div class="media--controls--top">
                                    <p class="media--controls--top--artist">Chop Suey!</p>
                                    <p class="media--controls--top--title">System of a Down - Chop Suey</p>
                                </div>
                                <div class="media--controls--btm">
                                    <i class="fas fa-lg fa-history"></i>
                                    <i class="fas fa-lg fa-play"></i>
                                    <i class="fas fa-lg fa-history fa-flip-horizontal"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                profile_list.appendChild(el);
                el.addEventListener('click', () => {
                    displayUser(user);
                });
            });
        }

        function displayUser(user) {
            // quickRefs
            const data = user.data;
            const user_view = docQ('.user_view');
            const html = docQ('html');

            // Display the user
            html.classList.add('no-scroll');
            user_view.classList.add('y-scroll');
            user_view.hidden = false;
            user_view.innerHTML = `
            <div class="user_view--top">
                <h2 class="u-heading-1">${data.first_name}</h2>
                <button class="o-spotify-select--close">Done</button>
            </div>
            <div class="user_view--header">
                <p class="u-heading-1">${data.first_name}, ${helper.getAge(data.bday)}</p>
                <p class="u-heading-3">${Lists.decipherCodes('genders', data.pronouns)}</p>
                <p class="u-heading-2">Philadelphia</p>
            </div>
            <div class="user_view--main">
                <div class="user_view--main--card">
                    <h2 class="u-heading-3">Looking For</h2>
                    <p>${Lists.decipherCodes('looking_for', data.looking_for)}</p>
                </div>
                <div class="user_view--main--card">
                    <h2 class="u-heading-3">About Me</h2>
                    <p>${data.bio}</p>
                </div>
                <div class="user_view--main--card">
                    <h2 class="u-heading-3">${data.first_name}'s Favorite Anthem</h2>
                    <div class="media">
                        <iframe src="https://open.spotify.com/embed/track/${data.anthem}" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                        <div class="media--controls">
                            <div class="media--controls--top">
                                <p class="media--controls--top--artist">Chop Suey!</p>
                                <p class="media--controls--top--title">System of a Down - Chop Suey</p>
                            </div>
                            <div class="media--controls--btm">
                                <i class="fas fa-lg fa-history"></i>
                                <i class="fas fa-lg fa-play"></i>
                                <i class="fas fa-lg fa-history fa-flip-horizontal"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="user_view--main--card">
                    <h2 class="u-heading-3">${data.first_name}'s Favorite Artist</h2>
                </div>
                <div class="user_view--main--card">
                    <h2 class="u-heading-3">${data.first_name}'s Favorite Playlist</h2>
                </div>
                <div class="user_view--main--card">
                    <h2 class="u-heading-3">${data.first_name}'s Top Songs</h2>
                </div>
                <div class="user_view--main--card">
                    <h2 class="u-heading-3">${data.first_name}'s Top Artist</h2>
                </div>
                <div class="user_view--main--card">
                    <h2 class="u-heading-3">${data.first_name}'s Top Playlists</h2>
                </div>
                <div class="user_view--main--card">
                    <h2 class="u-heading-3">${data.first_name}'s Recreational Activities</h2>
                    <p></p>
                </div>
            </div>
            `;
            function close_user_view() {
                html.classList.remove('no-scroll');
                user_view.classList.remove('y-scroll');
                user_view.hidden = true;
                user_view.innerHTML = '';
            }
            const close = user_view.querySelector('.o-spotify-select--close');
            close.addEventListener('click', close_user_view);
        }
    }
}