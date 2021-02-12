// Requires
const helper = require('../helper');
const endpoints = require('../config/endpoints.json');
const moment = require('moment');

function unixToFromNow(unix) {
    return moment.unix(unix).fromNow();
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
            console.log(thread);
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
    const
        location = window.location.href,
        url = new URL(location),
        thread = url.searchParams.get('thread');
    console.log(thread);

    // Get chat history
    $.ajax({ //send info to server - GET request
        url: endpoints.chat.url,
        data: {
            uuid: spotifyObject.user_id,
            query: 'get-history',
            thread: thread
        }
    }).done(function (results) {
        const chatContentDiv = docQ('.l-chat-view--content');
        results.forEach(message => {
            const data = message.data();
            console.log(message);
            chatContentDiv.innerHTML += `
                <div class="l-chat-view--content--message message-from-them">
                    ${data.content}
                </div>
            `;
        });
    });
}