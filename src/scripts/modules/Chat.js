// Requires
const helper = require('../helper');
const endpoints = require('../config/endpoints.json');
const moment = require('moment');

function unixToFromNow(unix) {
    return moment.unix(unix).fromNow();
}

let targetInfo;
function getTargetInfo(threadID) {
    $.ajax({
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
    $.ajax({
        url: endpoints.chat.url,
        data: {
            uuid: spotifyObject.user_id,
            query: 'list-chats'
        }
    }).done(function (results) {
        if (results.length > 0) {
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
        } else {
            docQ('.l-chat-browse').hidden = true;
            docQ('.no-results').hidden = false;
        }
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

    // Get chat history
    $.ajax({
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
    const messageInput = messageForm.querySelector('textarea[name="message"]');
    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (messageInput.value) {
            $.ajax({
                url: endpoints.chat.url,
                data: {
                    uuid: spotifyObject.user_id,
                    query: 'send-message',
                    thread: thread,
                    content: messageInput.value
                }
            }).done(function (response) {
                if (response.length > 0) {
                    chatContentDiv.innerHTML += `
                        <div class="l-chat-view--content--message message-from-me">
                            <p>${messageInput.value}</p>
                            <time>${moment.unix(Math.floor(Date.now() / 1000)).format('M/D/YY, h:mm a')}</time>
                        </div>
                    `;
                    messageInput.value = ''; // Clear input
                    scroll_to_bottom('tell');
                } else {
                    // Beginning of chat
                }
            });
        }
    });

    // Grow/Shrink Message Input
    function resizeInput() {
        messageInput.style.height = '52px';
        const
            vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0),
            sHeight = messageInput.scrollHeight,
            maxHeight = vh / 3;

        let newHeight;

        sHeight > maxHeight ? newHeight = maxHeight : newHeight = sHeight;
        messageInput.style.height = newHeight + 'px';
    }
    messageInput.addEventListener('input', resizeInput);
}