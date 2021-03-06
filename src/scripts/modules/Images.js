if (docQ('.js-images')) {
    const buttons = docQA('.o-button-upload');
    const inputs = docQA('.js-profile-picture');
    const form = docQ('#firestore_form');
    const maxFileSize = 5; // In MB
    const Validate = require('./Validate');

    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const input = $(`.js-profile-picture[data-index="${btn.dataset.index}"]`);
            input.click();
        });
    });

    function addValidityCheck(input) {
        const section = input.closest('.form-section');
        const clone = section.cloneNode(true);
        const tempForm = document.createElement('form');
        tempForm.appendChild(clone);

        if (tempForm.checkValidity()) { // Handle valid
            Validate.toggleInvalid(false, input.closest('section'));
        } else {
            Validate.toggleInvalid(true, input.closest('section'), 'At least 1 photo is required for Shuffle.');
        }
    }

    inputs.forEach(input => {
        input.addEventListener('change', (e) => {
            e.preventDefault();
            const button = docQ(`button[data-index="${input.dataset.index}"]`);
            setImage(input, button);
            addValidityCheck(input);
        });
    });

    function setImage(input, button) {
        button_before = button.querySelector('::before');

        if (input.files) {
            const file = input.files[0];
            let reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = function (e) {
                if (file.size < (maxFileSize * 1024 * 1024)) {
                    // file.size is in bytes so you multiply by 1024^2
                    require('./Validate').toggleInvalid(false, input.closest('form'));
                    const URI = e.target.result;
                    button.style.backgroundImage = `url(${URI})`;
                    button.classList.add('file-selected');
                    input.dataset.uri = URI;
                } else {
                    require('./Validate').toggleInvalid(true, input.closest('form'), 'Files must be under 3 MB');
                    button.style.backgroundImage = 'none';
                    button.classList.remove('file-selected');
                    input.dataset.uri = '';
                    input.value = '';
                }
            };
        }
    }
}