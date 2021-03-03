
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
            url: endpoints.routes.users.url,
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
                chatBar.href = endpoints.pages.chatView.url + '?thread=' + helper.getThread(shuffleCookie.user_id, target.uuid);
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
                url: endpoints.routes.update.url,
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
            url: endpoints.routes.users.url,
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
            viewUser.querySelector(el).closest('.c-profile__body-card').hidden = true;
        }

        function addGeneralData(el, data) {
            // The data that appears on both the user list cards and on the profile view
            // Meant to be re-usable
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
            $.each(users, (i, user) => {
                // quickRefs
                const data = user.data;
                const ogCard = docQA('.c-user-card')[0];
                const cloneCard = ogCard.cloneNode(true);

                // General Data
                addGeneralData(cloneCard, data);

                profile_list.appendChild(cloneCard);
                cloneCard.querySelector('.c-user-card__figure')
                    .addEventListener('click', () => {
                        displayUser(user);
                        toggleChatBar(true, user);
                        docQ('.c-profile').classList.remove('c-profile--self');
                    });

                // Delete original card
                i + 1 == users.length && ogCard.remove();
            });
        }


        // Display a Specific User
        function displayUser(user) {
            // quickRefs
            const data = user.data;
            const close = viewUser.querySelector('.o-modal--close');
            helper.rm_events(close, false);
            close.addEventListener('click', close_user_view);

            // Un-hide optional fields
            viewUser.querySelectorAll('.c-profile__body-card--block[hidden], .c-profile__body-card[hidden]').forEach(el => {
                el.hidden = false;
            });

            // Function to hide the top 3 blocks if data is insufficient
            function hideBlock(el) {
                // Finds the closest --block of the given element
                viewUser.querySelector(el).closest('.c-profile__body-card--block').hidden = true;
                const divider = viewUser.querySelector(el).closest('.c-profile__body-card').querySelector('.divider')
                if (divider) divider.hidden = true;
            }

            // Display the user
            html.classList.add('u-no-scroll');
            viewUser.classList.add('c-profile--open');
            viewUser.hidden = false;

            // General Data
            addGeneralData(viewUser, data);

            // Card Titles
            viewUser.querySelector('.js-first_name_1').innerText = data.first_name;
            viewUser.querySelector('.js-top_artists_heading').innerText = data.first_name + "'s Top Artists";
            viewUser.querySelector('.js-top_tracks_heading').innerText = data.first_name + "'s Top Songs";
            viewUser.querySelector('.js-top_genres_heading').innerText = data.first_name + "'s Top Genres";
            // viewUser.querySelector('.js-top_playlist_heading').innerText = data.first_name + "'s Favorite Playlist";

            // Looking For & Who Are You
            ['looking_for', 'who_are_you'].forEach(string => {
                data[string] ? viewUser.querySelector(`.js-${string}`).innerText = Lists.decipherCodes(string, data[string]) : hideBlock(`.js-${string}`);
            });

            // Bio
            data.bio ? viewUser.querySelector('.js-bio').innerText = data.bio : hideCard('.js-bio');

            // Top 3 Artists & Tracks
            ['artist', 'track'].forEach(string => {
                for (i = 0; i < 3; i++) {
                    data[`${string}_${i}_title`] ? viewUser.querySelector(`.js-${string}_${i}_title`).innerText = helper.truncateString(data[`${string}_${i}_title`], 12) : hideBlock(`.js-${string}_${i}_title`);
                    data[`${string}_${i}_thumb`] ? viewUser.querySelector(`.js-${string}_${i}_thumb`).src = data[`${string}_${i}_thumb`] : hideBlock(`.js-${string}_${i}_thumb`);
                    data[`${string}_${i}_href`] ? viewUser.querySelector(`.js-${string}_${i}_href`).src = data[`${string}_${i}_href`] : hideBlock(`.js-${string}_${i}_href`);
                }
            });

            // Top 3 Genres
            for (i = 0; i < 3; i++) {
                data[`genres_${i}`] ? viewUser.querySelector(`.js-genres_${i}_title`).innerText = helper.truncateString(Lists.decipherCodes('genres', data[`genres_${i}`], 12)) : hideBlock(`.js-genres_${i}_title`);
                data[`genres_${i}`] ? viewUser.querySelector(`.js-genres_${i}_thumb`).src = 'http://hunterhdesign.com/drexel/idm372/genre-imgs/' + Lists.decipherCodes('genres', data[`genres_${i}`]) + '.jpeg' : hideBlock(`.js-genres_${i}_thumb`);
            }

            // Top Playlist
            data[`first_name`] ? viewUser.querySelector(`.js-playlist_heading`).innerText = `${data[`first_name`]}'s Favorite Playlist` : hideBlock(`.js-playlist_heading`); //title of block
            data[`playlist_thumb`] ? viewUser.querySelector(`.c-profile-playlist__image`).src = data[`playlist_thumb`] : hideBlock(`.c-profile-playlist__image`); //playlist image
            data[`playlist_title`] ? viewUser.querySelector(`.c-profile-playlist__title`).innerText = helper.truncateString(data[`playlist_title`], 12) : hideBlock(`.c-profile-playlist__title`); //playlist title
            data[`playlist_artist`] ? viewUser.querySelector(`.c-profile-playlist__author`).innerText = `Created by ${data[`playlist_artist`]}` : hideBlock(`.c-profile-playlist__author`); //playlist author

            // Hide any cards where all 3 blocks are hodden (due to insufficient data)
            docQA('.c-profile__body-card--block-wrap').forEach(wrap => {
                if (wrap.querySelectorAll('.c-profile__body-card--block[hidden]').length == wrap.querySelectorAll('.c-profile__body-card--block').length) {
                    wrap.closest('.c-profile__body-card').hidden = true;
                }
            });

            // Playlist Songs
            const shuffleCookie = helper.shuffleCookie();
            $.ajax({
                url: endpoints.routes.playlist.url,
                data: {
                    refresh_token: shuffleCookie.refresh_token,
                    access_token: shuffleCookie.access_token,
                    playlist: data[`playlist_id`]
                }
            }).done(function (res) {
                viewUser.querySelector(`.c-profile-playlist__songs-list`).innerHTML = '';
                for (i = 0; i < 5; i++) {
                    viewUser.querySelector(`.c-profile-playlist__songs-list`).innerHTML += `
						<div class='c-profile-playlist__songs-list__item'> 
							<span class='c-profile-playlist__songs-list__item__title'>
								${helper.truncateString(res.items[i].track.name, 12)} 
							</span>
							<span class='c-profile-playlist__songs-list__item__artist'> 
								by ${helper.truncateString(res.items[i].track.artists[0].name, 15)} 
							</span>
							<span class='c-profile-playlist__songs-list__item__time'> 
								${helper.millisToMinutesAndSeconds(res.items[i].track.duration_ms)}
							</span> 
						</div>`;
                }
            });
        }
    }
}