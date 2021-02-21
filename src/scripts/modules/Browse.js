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

        // Elements
        const profile_list = docQ('#l-profile-list');
        const html = docQ('html');
        const viewUser = docQ('.c-view-user');
        const continueBtn = docQ('.continue-button');
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
                    completeProfile();
                } else {
                    continueBtn.hidden = true;
                }
            } else {
                console.log('Server Error');
            }
        });

        function addGeneralData(el, data) {
            el.querySelector('.data_first_name').innerText = data.first_name + ', ' + helper.getAge(data.bday);
            data.pronouns ? el.querySelector('.data_pronouns').innerText = Lists.decipherCodes('pronouns', data.pronouns) : el.querySelector('.data_pronouns').hidden = true;
            el.querySelector('.data_location').innerText = 'Philadelphia';
            el.querySelector('.data_anthem_heading').innerText = data.first_name + "'s Anthem";
            el.querySelector('.data_anthem_id').src = 'https://open.spotify.com/embed/track/' + data.anthem_id;
            el.querySelector('.data_anthem_title').innerText = data.anthem_title;
            el.querySelector('.data_anthem_subtitle').innerText = data.anthem_album + ', ' + data.anthem_artist;
        }

        // User Cards
        function listUsers(users) {
            users.forEach(user => {
                // quickRefs
                const data = user.data;
                const card = docQA('.c-user-card')[0];
                const cloneCard = card.cloneNode(true);

                // General Data
                addGeneralData(cloneCard, data);

                profile_list.appendChild(cloneCard);
                cloneCard.querySelector('.c-user-card--overlay')
                    .addEventListener('click', () => {
                        displayUser(user);
                        toggleChatBar(true, user);
                        docQ('.c-view-user').classList.remove('c-view-user--self');
                    });
            });
        }

        // Specific User View
        function displayUser(user) {
            // quickRefs
            const data = user.data;

            // Display the user
            html.classList.add('u-no-scroll');
            viewUser.classList.add('c-view-user--open');
            viewUser.hidden = false;
            const close = viewUser.querySelector('.o-spotify-select--close');
            close.addEventListener('click', close_user_view);

            // General Data
            addGeneralData(viewUser, data);

            // User View Specific Data
            viewUser.querySelector('.data_first_name_1').innerText = data.first_name;
            viewUser.querySelector('.data_looking_for').innerText = Lists.decipherCodes('looking_for', data.looking_for);
            viewUser.querySelector('.data_bio').innerText = data.bio;
            viewUser.querySelector('.data_top_artists_heading').innerText = data.first_name + "'s Top Artists";
            viewUser.querySelector('.data_top_tracks_heading').innerText = data.first_name + "'s Top Songs";
            viewUser.querySelector('.data_top_playlist_heading').innerText = data.first_name + "'s Favorite Playlist";

            ['artist', 'track'].forEach(string => {
                for (i = 0; i < 3; i++) {
                    viewUser.querySelector(`.data_${string}_${i}_title`).innerText = helper.truncateString(data[`${string}_${i}_title`], 12);
                    viewUser.querySelector(`.data_${string}_${i}_thumb`).src = data[`${string}_${i}_thumb`];
                    viewUser.querySelector(`.data_${string}_${i}_href`).src = data[`${string}_${i}_href`];
                }
            });
        }
    }
}