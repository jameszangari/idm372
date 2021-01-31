const endpoints = require('../config/endpoints.json');
const helper = require('../helper');
const Lists = require('./Lists');

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
            const form_children = docQA('#firestore_form > *');

            // ===== Bundle form values into valsObj for DB =====

            if (type === 'strings') {
                form_children.forEach(el => {
                    if (el.value) { valsObj[el.name] = el.value; }
                });
                // console.log('count= ' + count);
                push_data(valsObj);

            } else if (type === 'checkOne') {
                const checked = form.querySelectorAll('input[type="checkbox"]:checked');
                checked.forEach(el => {
                    const section = el.closest('section');
                    valsObj[section.getAttribute('name')] = el.value;
                });
                push_data(valsObj);

            } else if (type === 'checkMulti') {
                const sections = form.querySelectorAll('section');
                sections.forEach(section => {
                    const strings = [];
                    const fieldName = section.getAttribute('name');
                    const checked = section.querySelectorAll('input[type="checkbox"]:checked');
                    checked.forEach(el => {
                        strings.push(el.value);
                    });
                    if (strings.length > 0) valsObj[fieldName] = strings.join(', ');
                });
                push_data(valsObj);
            }

            function push_data(obj) { // Send info to server - GET request
                if (Object.keys(obj).length > 0) { // If theres values
                    $.ajax({
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

        // // Add all select options if it's on the page
        // const lists = Lists.lists;
        // Object.keys(lists).forEach(listKey => {
        //     const form = docQ(`select[name="${listKey}"]`);
        //     if (form) {
        //         Object.keys(lists[listKey]).forEach(key => {
        //             form.innerHTML += `<option value=${key}>${lists[listKey][key]}</option>`;
        //         });
        //     }
        // });
    }
}