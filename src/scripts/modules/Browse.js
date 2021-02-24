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
        const shuffleCookie = helper.shuffleCookie();

        // Elements
        const profile_list = docQ('.js-browse');
        const html = docQ('html');
        const viewUser = docQ('.c-profile');
        const continueBtn = docQ('.continue-button');
        continueBtn.hidden = true; // Default
        const myProfileButton = docQ('.my-profile-button');
        const backBtn = docQ('.c-header-navigation__button');


        // Functions
        $.ajax({
            url: endpoints.users.url,
            data: {
                uuid: shuffleCookie.user_id,
                query: 'all-users'
            }
        }).done((response) => {
            // Do stuff after
            response ? listUsers(response) : console.error('There was a server error...');
        });

        function toggleChatBar(mode, target) { // 'mode' is a boolean, true = show, false = hide
            const chatBar = docQ('.o-button-secondary');
            chatBar.hidden = !mode;
            if (target) {
                chatBar.href = endpoints.chatView.url + '?thread=' + helper.getThread(shuffleCookie.user_id, target.uuid);
            }
        }

        function close_user_view() {
            html.classList.remove('u-no-scroll');
            viewUser.classList.remove('c-profile--open');
            viewUser.hidden = true;
            backBtn.hidden = true;
            myProfileButton.hidden = false;
            if (docQ('.o-modal--close')) docQ('.o-modal--close').hidden = false;
            toggleChatBar(false);
        }

        function completeProfile() {
            // Sets the new_user field to false, allowing them to be seen
            $.ajax({
                url: endpoints.update.url,
                data: {
                    uuid: shuffleCookie.user_id,
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
                target: shuffleCookie.user_id,
                query: 'single-user'
            }
        }).done((response) => {
            // Do stuff after
            if (response) {
                // Ability to view own profile
                myProfileButton.addEventListener('click', () => {
                    displayUser(response);
                    toggleChatBar(false);
                    docQ('.c-profile').classList.add('c-profile--self');
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
                    docQ('.c-profile').classList.remove('c-profile--self');
                    if (docQ('.o-modal--close')) docQ('.o-modal--close').hidden = true;
                    continueBtn.hidden = false;
                    completeProfile();
                } else {
                    continueBtn.hidden = true;
                }
            } else {
                console.log('Server Error');
            }
        });

        function hideCard(el) { // Hides the parent card of the specified field
            viewUser.querySelector(el).closest('.c-view-user__main--card').hidden = true;
        }

        function addGeneralData(el, data) {
            data.pronouns ? el.querySelector('.js-pronouns').innerText = Lists.decipherCodes('pronouns', data.pronouns) : el.querySelector('.js-pronouns').hidden = true;
            el.querySelector('.js-first_name').innerText = data.first_name + ', ' + helper.getAge(data.bday);
            el.querySelector('.js-location').innerText = 'Philadelphia';
            el.querySelector('.js-anthem_heading').innerText = data.first_name + "'s Anthem";
            data.anthem_id ? el.querySelector('.js-anthem_id').src = 'https://open.spotify.com/embed/track/' + data.anthem_id : hideCard('.js-anthem_id');
            data.anthem_title ? el.querySelector('.js-anthem_title').innerText = data.anthem_title : hideCard('.js-anthem_title');
            data.anthem_album && data.anthem_artist ? el.querySelector('.js-anthem_subtitle').innerText = data.anthem_album + ', ' + data.anthem_artist : hideCard('.js-anthem_subtitle');
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
                cloneCard.querySelector('.c-user-card__figure')
                    .addEventListener('click', () => {
                        displayUser(user);
                        toggleChatBar(true, user);
                        docQ('.c-profile').classList.remove('c-profile--self');
                    });
            });
        }


        // Specific User View
        function displayUser(user) {
            // quickRefs
            const data = user.data;
            const close = viewUser.querySelector('.o-modal--close');
            helper.rm_events(close, false);
            close.addEventListener('click', close_user_view);

            // Un-hide optional fields
            viewUser.querySelectorAll('.c-view-user__main--card[hidden], .c-view-user__main--card--block[hidden]').forEach(el => {
                el.hidden = false;
            });

            // Display the user
            html.classList.add('u-no-scroll');
            viewUser.classList.add('c-profile--open');
            viewUser.hidden = false;

            // General Data
            addGeneralData(viewUser, data);

            // User View Specific Data
            viewUser.querySelector('.js-first_name_1').innerText = data.first_name;
            viewUser.querySelector('.js-top_artists_heading').innerText = data.first_name + "'s Top Artists";
            viewUser.querySelector('.js-top_tracks_heading').innerText = data.first_name + "'s Top Songs";
            // viewUser.querySelector('.js-top_playlist_heading').innerText = data.first_name + "'s Favorite Playlist";

            // Optional Fields
            data.looking_for ? viewUser.querySelector('.js-looking_for').innerText = Lists.decipherCodes('looking_for', data.looking_for) : hideCard('.js-looking_for');
            data.bio ? viewUser.querySelector('.js-bio').innerText = data.bio : hideCard('.js-bio');

            function hideBlock(el) { // Hides the parent card of the specified field
                console.log(el, viewUser.querySelector(el));
                viewUser.querySelector(el).closest('.c-view-user__main--card--block').hidden = true;
            }

            ['artist', 'track'].forEach(string => {
                for (i = 0; i < 3; i++) {
                    data[`${string}_${i}_title`] ? viewUser.querySelector(`.js-${string}_${i}_title`).innerText = helper.truncateString(data[`${string}_${i}_title`], 12) : hideBlock(`.js-${string}_${i}_title`);
                    data[`${string}_${i}_thumb`] ? viewUser.querySelector(`.js-${string}_${i}_thumb`).src = data[`${string}_${i}_thumb`] : hideBlock(`.js-${string}_${i}_thumb`);
                    data[`${string}_${i}_href`] ? viewUser.querySelector(`.js-${string}_${i}_href`).src = data[`${string}_${i}_href`] : hideBlock(`.js-${string}_${i}_href`);
                }
            });

            docQA('.c-view-user__main--card--block-wrap').forEach(wrap => {
                if (wrap.querySelectorAll('.c-view-user__main--card--block[hidden]').length == 3) {
                    wrap.querySelectorAll('.c-view-user__main--card--block')[0].closest('.c-view-user__main--card').hidden = true;
                }
            });
        }
    }
}