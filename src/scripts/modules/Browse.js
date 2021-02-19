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
        const html = docQ('html');
        const viewUser = docQ('.c-view-user');
        const continueBtn = docQ('.o-button-primary--pink');
        const myProfileButton = docQ('.my-profile-button');
        const backBtn = docQ('.c-header-navigation__button');

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

        function toggleChatBar(mode, target) { // 'mode' is a boolean, true = show, false = hide
            const chatBar = docQ('.l-chat-view--input-bar');
            chatBar.hidden = !mode;
            if (target) {
                chatBar.href = endpoints.chatView.url + '?thread=' + helper.getThread(spotifyObject.user_id, target.uuid);
            }
        }

        function close_user_view() {
            html.classList.remove('u-no-scroll');
            viewUser.classList.remove('c-view-user--open');
            viewUser.hidden = true;
            viewUser.innerHTML = '';
            backBtn.hidden = true;
            myProfileButton.hidden = false;
            continueBtn.hidden = true;
            if (docQ('.o-spotify-select--close')) docQ('.o-spotify-select--close').hidden = false;
            toggleChatBar(false);
        }

        function completeProfile() {
            // Sets the new_user field to false, allowing them to be seen
            $.ajax({
                url: endpoints.update.url,
                data: {
                    uuid: spotifyObject.user_id,
                    values: {
                        new_user: false
                    }
                }
            }).done((response) => {
                // Do stuff after
                if (!response) {
                    console.log('Server Error');
                }
            });
        }

        // Get your own user
        $.ajax({
            url: endpoints.users.url,
            data: {
                target: spotifyObject.user_id,
                query: 'single-user'
            }
        }).done((response) => {
            // Do stuff after
            if (response) {
                // Ability to view own profile
                myProfileButton.addEventListener('click', () => {
                    displayUser(response);
                    toggleChatBar(false);
                    docQ('.c-view-user').classList.add('c-view-user--self');
                    backBtn.hidden = false;
                    myProfileButton.hidden = true;
                });
                backBtn.addEventListener('click', () => {
                    close_user_view();
                    backBtn.hidden = true;
                    myProfileButton.hidden = false;
                });

                // If just came from profile complete
                if (helper.getUrlParam('completed')) {
                    myProfileButton.click();
                    docQ('.c-view-user').classList.remove('c-view-user--self');
                    docQ('.c-view-user--top-heading').innerText = 'Your Profile';
                    if (docQ('.o-spotify-select--close')) docQ('.o-spotify-select--close').hidden = true;
                    continueBtn.hidden = false;
                    continueBtn.addEventListener('click', close_user_view);
                    completeProfile();
                }
            } else {
                console.log('Server Error');
            }
        });

        // List the users
        function listUsers(users) {
            users.forEach(user => {
                // quickRefs
                const data = user.data;
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
                el.querySelector('.c-user-card--overlay')
                    .addEventListener('click', () => {
                        displayUser(user);
                        toggleChatBar(true, user);
                        docQ('.c-view-user').classList.remove('c-view-user--self');
                    });
            });
        }

        function displayUser(user) {
            // quickRefs
            const data = user.data;

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
                <p class="u-heading-3 u-box-shadow--text">${Lists.decipherCodes('pronouns', data.pronouns)}</p>
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
            </div>
            `;
            const close = viewUser.querySelector('.o-spotify-select--close');
            close.addEventListener('click', close_user_view);
        }
    }
}