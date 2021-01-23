const endpoints = require('../config/endpoints.json');
const helper = require('../helper');

// Cookies
const spotifyObjectString = helper.getCookie('spotify');
const spotifyObject = JSON.parse(spotifyObjectString);

module.exports = {
    init: function () {
        if (docQ('#firestore_form')) this.update(); else return;
    },
    update: function () { // Send update profile request to server
        // quickRefs
        const form = docQ('#firestore_form'),
            next = docQ('[data-form]'),
            url = next.dataset.href,
            type = form.getAttribute('type');

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form data as an object, !!!the name attribute will declare the field name in the DB!!!
            var valsObj = {};
            var count = 0;
            const form_children = docQA('#firestore_form > *');

            // Bundle form values into valsObj for DB
            if (type === 'strings') {
                form_children.forEach(el => {
                    if (el.value) { valsObj[el.name] = el.value; count++; }
                });
                // console.log('count= ' + count);
                push_data(valsObj);
            } else if (type === 'checkOne') {
                const checkboxes = form.querySelectorAll('input[type="checkbox"]');
                checkboxes.forEach(el => {
                    if (el.checked === true) {
                        const section = el.closest('section');
                        if (el.checked) { valsObj[section.getAttribute('name')] = el.value; count++; }
                    }
                });
                push_data(valsObj);
            }

            function push_data(obj) { // Send info to server - GET request
                if (count > 0) {
                    $.ajax({ // If theres values
                        url: endpoints.update.url,
                        data: {
                            uuid: spotifyObject.user_id,
                            values: obj
                        }
                    }).done((response) => {
                        // Do stuff after
                        response ? window.location.href = url : console.error('There was a server error...');
                    });
                } else { // Skip
                    window.location.href = url;
                }
            }

        }, false);

        // Populate pronoun forms
        pnoun_form = docQ('select[name="pronouns"]');
        if (pnoun_form) {
            const Pronouns = require('./Pronouns');
            const list = Pronouns.list;

            for (var i = 0; i < list.length; i++) {
                pnoun_form.innerHTML += `<option value=${i}>${list[i]}</option>`;
            }
        }
    }
}