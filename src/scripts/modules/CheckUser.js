const endpoints = require('../config/endpoints');
const helper = require('../helper');

const userValidNotRequired = [
    endpoints.pages.login.url,
    endpoints.pages.tos.url,
    endpoints.pages.privacy.url,
];

if (!userValidNotRequired.includes(window.location.pathname) && !window.location.pathname.includes('register')) {
    if (!helper.getUrlParam('completed')) { // If not on the profile complete page
        // Redirect to login if your profile is incomplete AND you're on a page that requires sign in
        $.ajax({
            url: endpoints.routes.users.url,
            data: {
                query: 'check-user-validity',
            }
        }).done(function (res) {
            if (!res) {
                // User is not complete
                window.location.href = endpoints.pages.login.url;
            };
        });
    }
}