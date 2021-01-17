const endpoints = require('../config/endpoints.json');
const helper = require('../helper');

// Cookies
const spotifyObjectString = helper.getCookie('spotify');
const spotifyObject = JSON.parse(spotifyObjectString);

module.exports = {
    init: function () {
        if (docQ('#firestore_form')) this.update()
        else return;
    },
    update: function () { // Send update profile request to server
        const form = docQ('#firestore_form');
        const type = form.getAttribute('type');
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form data as an object, !!!the name attribute will declare the field name in the DB!!!
            var valsObj = {};
            const form_children = docQA('#firestore_form > *');

            // Bundle form values into valsObj for DB
            console.log(type);
            if (type === 'strings') {
                form_children.forEach(el => {
                    if (el.value) valsObj[el.name] = el.value;
                });
                push_data(valsObj);
            } else if (type === 'checkOne') {
                const checkboxes = form.querySelectorAll('input[type="checkbox"]');
                checkboxes.forEach(el => {
                    if (el.checked === true) {
                        const section = el.parentElement.parentElement.parentElement;
                        if (el.checked) valsObj[section.getAttribute('name')] = el.value;
                    }
                });
                push_data(valsObj);
            }

            function push_data(obj) { // Send info to server - GET request
                $.ajax({
                    url: endpoints.update.url,
                    data: {
                        uuid: spotifyObject.user_id,
                        values: valsObj
                    }
                }).done((response) => {
                    // Do stuff after
                    response ? console.log('Success') : console.error('There was a server error...');
                });
            }

        }, false);
    }
}