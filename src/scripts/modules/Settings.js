if (docQ('.js-settings')) {
    const
        helper = require('../helper'),
        endpoints = require('../config/endpoints'),
        shuffleCookie = helper.shuffleCookie(),
        settingsPage = docQ('.c-settings'),
        settingsTriggers = docQA('.settings-trigger');

    settingsTriggers.forEach(el => {
        el.addEventListener('click', () => {
            settingsPage.hidden = !settingsPage.hidden; // Toggle
            settingsPage.hidden ? docQ('html').style.overflowY = '' : docQ('html').style.overflowY = 'hidden';
        });
    });

    // ===== Delete Profile =====

    const deleteUserBtn = settingsPage.querySelector('[data-query="delete-user"]');
    deleteUserBtn.addEventListener('click', () => {
        if (confirm('You are about to delete your Shuffle account. You cannot undo this. Continue?')) {
            $.ajax({
                url: endpoints.routes.users.url,
                data: {
                    query: deleteUserBtn.dataset.query,
                    target: shuffleCookie.uuid
                }
            }).done(function (res) {
                console.log('Deleted Account');
                window.location.href = endpoints.pages.login.url;
            });
        }
    });

    // ===== Logout =====

    const logoutBtn = settingsPage.querySelector('[data-query="logout"]');
    logoutBtn.addEventListener('click', () => {
        if (confirm('You are about to log out. Continue?')) {
            $.ajax({
                url: endpoints.routes.users.url,
                data: {
                    query: logoutBtn.dataset.query
                }
            }).done(function (res) {
                console.log('Logging Out');
                window.location.href = endpoints.pages.login.url;
            });
        }
    });
}