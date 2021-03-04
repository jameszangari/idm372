module.exports = {
    init: function () {
        if (docQ('#firestore_form')) this.update(); else return;
    },
    update: function () { // Send update profile request to server
        const endpoints = require('../config/endpoints.json');
        const Lists = require('./Lists');
        const helper = require('../helper');

        // Cookies
        const shuffleCookie = helper.shuffleCookie();
        // quickRefs
        const form = docQ('#firestore_form'),
            next = docQ('[data-form]'),
            nextUrl = next.dataset.href,
            type = form.getAttribute('type');

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form data as an object, !!!the name attribute will declare the field name in the DB!!!
            var valsObj = {};
            const form_children = form.querySelectorAll('input, textarea, select');

            // ===== Bundle form values into valsObj for DB =====

            if (type === 'strings') {
                const endpoint = endpoints.routes.update;

                let i = 0;
                form_children.forEach(el => {
                    i++;
                    if (el.value) { valsObj[el.name] = el.value; }
                    i == form_children.length && push_data(valsObj, endpoint);
                });

            } else if (type === 'checkOne') {
                const endpoint = endpoints.routes.update;
                const checked = form.querySelectorAll('input[type="checkbox"]:checked');

                let i = 0;
                checked.forEach(el => {
                    i++;
                    const section = el.closest('section');
                    valsObj[section.getAttribute('name')] = el.value;
                    i == checked.length && push_data(valsObj, endpoint);
                });

            } else if (type === 'checkMulti') {
                const endpoint = endpoints.routes.update;
                const sections = form.querySelectorAll('section');

                let i = 0;
                sections.forEach(section => {
                    i++;
                    const strings = [];
                    const fieldName = section.getAttribute('name');
                    const checked = section.querySelectorAll('input[type="checkbox"]:checked');
                    checked.forEach(el => {
                        strings.push(el.value);
                    });
                    if (strings.length > 0) valsObj[fieldName] = strings.join(', ');
                    i == sections.length && push_data(valsObj, endpoint);
                });

            } else if (type === 'images') {
                const fileInputs = form.querySelectorAll('input[type="file"]');
                const endpoint = endpoints.routes.update;

                let valsObj = {
                    dbObj: {},
                    photos: {}
                };

                let i = 0;
                fileInputs.forEach(input => {
                    i++;
                    valsObj.dbObj[input.name] = !!input.value;
                    if (input.dataset.uri) valsObj.photos[input.name] = input.dataset.uri;
                    i == fileInputs.length && push_data(valsObj, endpoint);
                });
            }

            function push_data(obj, endpoint) {
                if (Object.keys(obj).length > 0) { // If theres values
                    $.ajax({
                        method: endpoint.method || 'get', // Get is default
                        url: endpoint.url,
                        data: {
                            uuid: shuffleCookie.user_id,
                            values: obj
                        }
                    }).done((response) => {
                        // Do stuff after
                        response ? window.location.href = nextUrl : console.error('There was a server error...');
                    });
                } else { // Skip
                    window.location.href = nextUrl;
                }
            }

        }, false);

        // Add all looking for options
        const lists = Lists.lists;

        // Add all select options if it's on the page
        Object.keys(lists).forEach(listKey => {
            const listsElements = docQA(`[data-list="${listKey}"]`);
            if (listsElements.length > 0) {
                listsElements.forEach(listEl => {
                    const listType = listEl.dataset.listtype;
                    Object.keys(lists[listKey]).forEach(key => {
                        if (listType == 'select') {
                            listEl.innerHTML += `<option value=${key}>${lists[listKey][key]}</option>`;
                        } else if (listType == 'checkboxes') {
                            listEl.innerHTML += `
                                <label class="o-form--checkbox">
                                    <input class="o-form--checkbox__input" type="checkbox" value="${key}">
                                    <span class="o-form--checkbox__label">${lists[listKey][key]}</span>
                                </label>
                            `;
                        }
                    });
                });
            }
        });
    }
}