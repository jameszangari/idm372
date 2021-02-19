if (docQ('input[type="file"]')) {

    const pp_buttons = docQA('.o-button-upload');
    const pp_inputs = docQA('.js-profile-picture');

    pp_buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = $(`.js-profile-picture[data-index="${btn.dataset.index}"]`);
            input.click();
        });
    });

    pp_inputs.forEach(input => {
        input.addEventListener('change', () => {
            const button = docQ(`button[data-index="${input.dataset.index}"]`);
            setImage(input, button);
        });
    });

    function setImage(input, button) {
        button_before = button.querySelector('::before');
        console.log('BEFORE = ' + button_before);

        if (input.files) {
            var reader = new FileReader();

            reader.onload = function (e) {
                button.style.background = `url(${e.target.result})`;
            };

            reader.readAsDataURL(input.files[0]);
            button.classList.add('file-selected');
        }
    }
}