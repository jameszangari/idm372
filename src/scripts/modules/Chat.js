// Requires
const helper = require('../helper');
const endpoints = require('../config/endpoints.json');
const moment = require('moment');

function unixToFromNow(unix) {
    return moment.unix(unix).fromNow();
}

let targetInfo;
function getTargetInfo(threadID) {
    $.ajax({ //send info to server - GET request
        url: endpoints.chat.url,
        data: {
            uuid: spotifyObject.user_id,
            query: 'get-target-info',
            thread: threadID
        }
    }).done(function (result) {
        targetInfo = result;
        const headerTitle = docQ('.c-header-navigation__title');
        headerTitle.innerText = headerTitle.innerText.replace('[NAME]', targetInfo.name);
        docQ('title').innerText = docQ('title').innerText.replace('[Name]', targetInfo.name);
    });
}

// Cookies
const spotifyObjectString = helper.getCookie('spotify');
const spotifyObject = JSON.parse(spotifyObjectString);

if (docQ('.l-chat-browse')) { // Browse Page
    // quickRefs
    const chatsList = docQ('.l-chat-browse');

    // List users
    $.ajax({ //send info to server - GET request
        url: endpoints.chat.url,
        data: {
            uuid: spotifyObject.user_id,
            query: 'list-chats'
        }
    }).done(function (results) {
        results.forEach(thread => {
            chatsList.innerHTML += `
                <a class="l-chat-browse--user-item" href="${endpoints.chatView.url + '/?thread=' + thread.thread_id}">
                    <div class="l-chat-browse--user-item--img-area">
                        <img class="l-chat-browse--user-item--img-area--img"
                            src="https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500">
                    </div>
                    <div class="l-chat-browse--user-item--main">
                        <div class="l-chat-browse--user-item--main--top">
                            <h2 class="l-chat-browse--user-item--main--top--name">${thread.target_name}</h2>
                            <p class="l-chat-browse--user-item--main--top--time">${unixToFromNow(thread.last_activity._seconds)}</p>
                        </div>
                        <div class="l-chat-browse--user-item--main--btm">
                            <p class="l-chat-browse--user-item--main--btm--preview">
                                ${helper.truncateString(thread.preview, 65)}
                            </p>
                        </div>
                    </div>
                </a>
            `;
        });
    });
} else if (docQ('.l-chat-view')) { // View Page
    // Get thread id from URL
    docQ('html').style.overflowY = 'hidden'; // Fix Incorrect Scroll
    const thread = helper.getUrlParam('thread');
    getTargetInfo(thread);
    const chatContentDiv = docQ('.l-chat-view--content');

    function scroll_to_bottom(command) { // command can be 'ask' or 'tell'
        if (command == 'ask') {
            if ((chatContentDiv.scrollHeight - (chatContentDiv.scrollTop + chatContentDiv.clientHeight)) <= 500) {
                chatContentDiv.scrollTop = chatContentDiv.scrollHeight;
            }
        } else if (command == 'tell') {
            chatContentDiv.scrollTop = chatContentDiv.scrollHeight;
        }
    }

    function appendMessages(messages) {
        messages.forEach(message => {
            let fromClass;
            message.from == spotifyObject.user_id ? fromClass = 'from-me' : fromClass = 'from-them';

            chatContentDiv.innerHTML += `
                <div class="l-chat-view--content--message message-${fromClass}">
                    <p>${message.content}</p>
                    <time>${moment.unix(message.when._seconds).format('M/D/YY, h:mm a')}</time>
                </div>
            `;
        });
        scroll_to_bottom('tell');
    };

    docRef.set(data).then(() => { // Push data to DB
        // do stuff after
        decipher_uuid(target).then((name) => {
            console.log(`Toggling block on ${name}...`);
        });
        toggle_page('browse_users_form'); // Back out
    }).catch(function (error) {
        console.error(error);
    });
}

const stat_pp = docQ('#stat_pp'),
    profile_pic_placeholder = docQ('#profile_pic_placeholder');

// ==============================
// profile_cms_form
// ==============================

const unblock_user_input = docQ('#unblock_user_input'),
    unblock_user_button = docQ('#unblock_user_button'),
    blocked_users_wrap = docQ('#blocked_users_wrap');

function init_profile_cms_form(current_uuid) {
    nav_title.innerText = 'Edit Profile';
    profile_options_button.style.display = 'none';

    rm_events('#unblock_user_button', false);
    $('#unblock_user_button').on('click', (e) => { // Set up unblock button
        e.preventDefault();
        toggle_user_block(unblock_user_input.value, current_uuid, false); // Unblocks the user w/ false param
    });
    rm_events('#delete_user_button', false);
    $('#delete_user_button').on('click', (e) => {
        e.preventDefault();
        delete_user(current_uuid);
    });
    prep_photo_input(current_uuid);
}

const pp_input = docQ('#pp_input'),
    pp_thumb = docQ('#pp_thumb'),
    js_profile_picture = docQ('#js-profile-picture'),
    pp_change_button = docQ('#pp_change_button');

pp_change_button.addEventListener('click', (e) => {
    e.preventDefault();
    pp_input.click();
})

function prep_photo_input(current_uuid) { // Prepares the input and upload functions for a profile pic
    rm_events('#pp_input', false);
    rm_events('#js-profile-picture', false);

    upload_unready(); // Do this first

    function upload_unready() {
        pp_thumb.src = '';
        pp_thumb.hidden = true;
        docQ('#js-profile-picture').setAttribute('disabled', true);
    }
    function upload_ready() {
        pp_thumb.hidden = false;
        docQ('#js-profile-picture').removeAttribute('disabled');
    }

    let files = [];

    $('#pp_input').on('change', function (e) {
        e.preventDefault();
        // Do stuff
        files = e.target.files;
        if (typeof files[0] === 'object') { // File attached
            // If there's a file
            var reader = new FileReader();
            reader.onload = () => {
                pp_thumb.src = reader.result;
                reader = null;
            }
            reader.readAsDataURL(files[0]);
            upload_ready(); // Styles
        } else { // No file attached
            upload_unready(); // Styles
        }
    }

    // Get chat history
    $.ajax({ // Send info to server - GET request
        url: endpoints.chat.url,
        data: {
            uuid: spotifyObject.user_id,
            query: 'get-history',
            thread: thread
        }
    }).done(function (messages) {
        appendMessages(messages);
    });

    //  Send Messages
    const messageForm = docQ('#messageForm');
    const messageInput = messageForm.querySelector('input[name="message"]');
    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (messageInput.value) {
            $.ajax({ //send info to server - GET request
                url: endpoints.chat.url,
                data: {
                    uuid: spotifyObject.user_id,
                    query: 'send-message',
                    thread: thread,
                    content: messageInput.value
                }
            }).done(function (response) {
                if (response) {
                    chatContentDiv.innerHTML += `
                        <div class="l-chat-view--content--message message-from-me">
                            <p>${messageInput.value}</p>
                            <time>${moment.unix(Math.floor(Date.now() / 1000)).format('M/D/YY, h:mm a')}</time>
                        </div>
                    `;
                    messageInput.value = ''; // Clear input
                    scroll_to_bottom('tell');
                }
            });
        }
    });
}