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

        const profile_list = docQ('#l-profile-list');

        // Functions
        $.ajax({
            url: endpoints.users.url,
            data: {
                uuid: spotifyObject.user_id,
                query: 'all-users'
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
                console.log(data);
                // get the profile data by using user.<DB Field Name> (Ex. user.first_name)
                const el = document.createElement('div');
                el.classList.add('c-user-card');
                el.innerHTML += `
                    <div class="c-user-card--overlay"></div>
                    <div class="c-user-card--top">
                        <p class="c-user-card__stats-name u-heading-1 u-box-shadow--text">${data.first_name}, ${helper.getAge(data.bday)}</p>
                        <p class="c-user-card__stats-pronouns u-heading-4 u-box-shadow--text">${Lists.decipherCodes('pronouns', data.pronouns)}</p>
                        <p class="c-user-card__stats-location u-heading-3 u-box-shadow--text">Philadelphia, PA</p>
                    </div>
                    <div class="c-user-card--btm">
                        <p class="c-user-card--btm--title">${data.first_name}'s Anthem</p>
                        <div class="c-media">
                            <iframe src="https://open.spotify.com/embed/track/${data.anthem}" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                            <div class="c-media--controls">
                                <div class="c-media--controls--top">
                                    <p class="c-media--controls--top--artist">${data.song_title}</p>
                                    <p class="c-media--controls--top--title">${data.song_artist} - ${data.song_album}</p>
                                </div>
                                <div class="c-media--controls--btm">
                                    <a href="#">
                                        <i class="fas fa-lg fa-history"></i>
                                    </a>
                                    <a href="#">
                                        <i class="fas fa-lg fa-play"></i>
                                    </a>
                                    <a href="#">
                                        <i class="fas fa-lg fa-history fa-flip-horizontal"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                profile_list.appendChild(el);
                el.querySelector('.c-user-card--top')
                    .addEventListener('click', () => {
                        displayUser(user);
                    });
            });
        }

        function displayUser(user) {
            // quickRefs
            const data = user.data;
            const viewUser = docQ('.c-view-user');
            const html = docQ('html');

            // Display the user
            html.classList.add('u-no-scroll');
            viewUser.classList.add('c-view-user--open');
            viewUser.hidden = false;
            viewUser.innerHTML = `
            <div class="c-view-user--top">
            <h2 class="c-view-user--top-heading u-heading-1 u-align-center">${data.first_name}</h2>
            <button class="o-spotify-select--close">Done</button>
            </div>
            <div class="c-view-user--overlay"></div>
            <div class="c-view-user--header">
                <p class="u-heading-1 u-box-shadow--text">${data.first_name}, ${helper.getAge(data.bday)}</p>
                <p class="u-heading-3 u-box-shadow--text">${Lists.decipherCodes('genders', data.pronouns)}</p>
                <p class="u-heading-2 u-box-shadow--text">Philadelphia</p>
            </div>
            <div class="c-view-user__main">
                <div class="c-view-user__main--card c-view-user__main--card-horizontal">
                    <h2 class="c-view-user__main--card-heading u-heading-3">Looking For</h2>
                    <p>${Lists.decipherCodes('looking_for', data.looking_for)}</p>
                </div>
                <div class="c-view-user__main--card">
                    <h2 class="c-view-user__main--card-heading u-heading-3">About Me</h2>
                    <p class="c-view-user__main--card-body u-paragraph">${data.bio}</p>
                </div>
                <div class="c-view-user__main--card">
                    <h2 class="c-view-user__main--card-heading c-view-user__main--card-heading-anthem u-heading-3">${data.first_name}'s Favorite Anthem</h2>
                    <div class="c-media">
                        <iframe src="https://open.spotify.com/embed/track/${data.anthem}" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                        <div class="c-media--controls">
                            <div class="c-media--controls--top">
                                <p class="c-media--controls--top--artist">${data.song_title}</p>
                                <p class="c-media--controls--top--title">${data.song_artist} - ${data.song_album}</p>
                            </div>
                            <div class="c-media--controls--btm">
                                <i class="fas fa-lg fa-history"></i>
                                <i class="fas fa-lg fa-play"></i>
                                <i class="fas fa-lg fa-history fa-flip-horizontal"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="c-view-user__main--card">
                    <h2 class="c-view-user__main--card-heading u-heading-3">${data.first_name}'s Favorite Artist</h2>
                </div>
                <div class="c-view-user__main--card">
                    <h2 class="c-view-user__main--card-heading u-heading-3">${data.first_name}'s Favorite Playlist</h2>
                </div>
                <div class="c-view-user__main--card">
                    <h2 class="c-view-user__main--card-heading u-heading-3">${data.first_name}'s Top Songs</h2>
                </div>
                <div class="c-view-user__main--card">
                    <h2 class="c-view-user__main--card-heading u-heading-3">${data.first_name}'s Top Artist</h2>
                </div>
                <div class="c-view-user__main--card">
                    <h2 class="c-view-user__main--card-heading u-heading-3">${data.first_name}'s Top Playlists</h2>
                </div>
                <div class="c-view-user__main--card">
                    <h2 class="c-view-user__main--card-heading u-heading-3">${data.first_name}'s Recreational Activities</h2>
                    <p></p>
                </div>
            </div>
            `;
            function close_user_view() {
                html.classList.remove('u-no-scroll');
                viewUser.classList.remove('c-view-user--open');
                viewUser.hidden = true;
                viewUser.innerHTML = '';
            }
            const close = viewUser.querySelector('.o-spotify-select--close');
            close.addEventListener('click', close_user_view);
        }
    }
}