if (docQ('.js-images')) {
    const buttons = docQA('.o-button-upload');
    const inputs = docQA('.js-profile-picture');
    const form = docQ('#firestore_form');
    const maxFileSize = 5; // In MB

    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const input = $(`.js-profile-picture[data-index="${btn.dataset.index}"]`);
            input.click();
        });
    });

    inputs.forEach(input => {
        input.addEventListener('change', (e) => {
            e.preventDefault();
            const button = docQ(`button[data-index="${input.dataset.index}"]`);
            setImage(input, button);
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
                    require('./Validate').toggleInvalid(false, input);
                    const URI = e.target.result;
                    button.style.backgroundImage = `url(${URI})`;
                    button.classList.add('file-selected');
                    input.dataset.uri = URI;
                } else {
                    require('./Validate').toggleInvalid(true, input, 'Files must be under 3 MB');
                    button.style.backgroundImage = 'none';
                    button.classList.remove('file-selected');
                    input.dataset.uri = '';
                    input.value = '';
                }
            };
        }
    }
}