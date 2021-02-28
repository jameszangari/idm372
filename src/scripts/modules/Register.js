const endpoints = require('../config/endpoints.json');
const Lists = require('./Lists');
const helper = require('../helper');

// Cookies
const shuffleCookie = helper.shuffleCookie();

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
            const form_children = form.querySelectorAll('input, textarea, select');

            // ===== Bundle form values into valsObj for DB =====

            if (type === 'strings') {
                form_children.forEach(el => {
                    if (el.value) { valsObj[el.name] = el.value; }
                });
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

            function push_data(obj) {
                if (Object.keys(obj).length > 0) { // If theres values
                    $.ajax({
                        url: endpoints.routes.update.url,
                        data: {
                            uuid: shuffleCookie.user_id,
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

        // Add all looking for options
        const lists = Lists.lists;
        const looking_for_list = lists.looking_for;
        const lookingForSection = docQ('section[name="looking_for"]');
        if (lookingForSection) {
            Object.keys(looking_for_list).forEach(key => {
                lookingForSection.innerHTML += `
                    <label class="o-form--checkbox">
                        <input class="o-form--checkbox__input" type="checkbox" value="${key}">
                        <span class="o-form--checkbox__label">${looking_for_list[key]}</span>
                    </label>
                `;
            });
        }

        // Add all select options if it's on the page
        Object.keys(lists).forEach(listKey => {
            const form = docQ(`select[name="${listKey}"]`);
            if (form) {
                Object.keys(lists[listKey]).forEach(key => {
                    form.innerHTML += `<option value=${key}>${lists[listKey][key]}</option>`;
                });
            }
        });
    }
}