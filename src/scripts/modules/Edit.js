const endpoints = require('../config/endpoints.json');
const helper = require('../helper');
const pathLocation = window.location.pathname;

if (docQ('.js-edit')) {
    if (pathLocation == endpoints.browse.url) {
        // If you're on the browse page...
        const
            allEditDivs = docQA('[data-editLink]'),
            myProfileBtn = docQ('.my-profile-button'),
            closeProfileBtns = docQA('.c-header-navigation__button, .o-modal--close');

        function rmEditBtns() {
            allEditDivs.forEach(el => {
                const editBtn = el.querySelector('.c-profile__body-card__edit');
                editBtn && editBtn.remove();
            });
        }

        function addEditBtns() {
            rmEditBtns(); // In case of duplicates
            allEditDivs.forEach(el => {
                const editAnchor = document.createElement('a');
                editAnchor.classList.add('c-profile__body-card__edit');
                editAnchor.href = el.dataset.editlink + '?backLink=' + pathLocation;
                el.appendChild(editAnchor);
            });
        }

        // Action(s) that will ADD the edit buttons
        myProfileBtn.addEventListener('click', addEditBtns);
        helper.getUrlParam('completed') && addEditBtns();

        // Action(s) that will REMOVE the edit buttons
        closeProfileBtns.forEach(el => {
            el.addEventListener('click', rmEditBtns);
        });
    }
}

const backLink = helper.getUrlParam('backLink') || null;

if (pathLocation.includes('/register') && backLink) {
    // If on a register page and a backLink is present
    const submitBtn = docQ('[data-form]');
    if (submitBtn) {
        submitBtn.dataset.href = backLink;
    }
}