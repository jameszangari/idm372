const endpoints = require('../config/endpoints.json');
const helper = require('../helper');

// Cookies
const spotifyObjectString = helper.getCookie('spotify');
const spotifyObject = JSON.parse(spotifyObjectString);

module.exports = {
    init: function () {
        this.add();
    },
    /**
     * Send update profile request to server
     */
    add: function () {

        const form = docQ('form');
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            // Get form data as an object, !!!the name attribute will declare the field name in the DB!!!
            var valsObj = {};
            const form_children = docQA('form > *');
            form_children.forEach(el => {
                if (el.value) valsObj[el.name] = el.value;
            });

            // Send info to server - GET request
            $.ajax({
                url: endpoints.update.url,
                data: {
                    uuid: spotifyObject.user_id,
                    values: valsObj
                }
            }).done((response) => {
                // Do stuff after
                response && console.log('Success');
            });
        }, false);
    }
}