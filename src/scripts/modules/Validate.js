const next = docQ('[data-form]');

function toggleInvalid(add, input, message) {
    if (input.nextSibling.classList == 'invalid_desc') {
        input.nextSibling.remove();
    }
    if (add == true) {
        input.classList.add('invalid');
        input.insertAdjacentHTML('afterend', `<p class="invalid_desc">${message}</>`);
    } else {
        input.classList.remove('invalid');
    }
}

if (next) { // If there's a form
    // quickRefs
    const form = docQ(next.dataset.form),
        type = form.getAttribute('type');

    // Toggles UI validity of inputs

    // Set validation listeners for all text inputs
    const req_strings = docQA('input[type="text"]');
    if (req_strings.length > 0) { // If there's string input(s)
        req_strings.forEach(el => {
            if (el.required) {
                el.addEventListener('change', () => { // Trim on every change
                    el.value = el.value.trim();
                });
                el.addEventListener('input', () => {
                    el.value.trim().length > 0 ? toggleInvalid(false, el) : toggleInvalid(true, el, 'This field is required.');
                });
            }
        });
    }

    // Set validation listeners for all select inputs
    const req_selects = docQA('select');
    if (req_selects.length > 0) { // If there's string input(s)
        req_selects.forEach(el => {
            if (el.required) {
                el.addEventListener('change', () => {
                    el.value && toggleInvalid(false, el);
                });
            }
        });
    }

    // Set validation listeners for all date inputs
    const date_inputs = docQA('input[type="date"]');
    if (date_inputs.length > 0) { // If there's string input(s)
        date_inputs.forEach(el => {
            if (el.required) {
                el.addEventListener('change', () => {
                    validateDateInput(el);
                });
            }
        });
    }

    function validateDateInput(el) {
        const value = el.value, min = el.getAttribute('min'), max = el.getAttribute('max');
        if (value) { // If there's input
            if (min && max) { // If there is a min & max attribute
                if (value < min) { // Too old
                    toggleInvalid(true, el, 'This date is out of range.');
                } else if (value > max) { // Too young
                    toggleInvalid(true, el, 'You must be at least 18 years old to use Shuffle.');
                } else if (value > min && value < max) { // In between aka correct
                    toggleInvalid(false, el);
                }
            }
        } else {
            toggleInvalid(true, el, 'This field is required.');
        }
    }

    // Set min & max dates on date inputs
    if (date_inputs.length > 0) { // If there's date input(s)
        // Set 18 y/o restriction
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; // January is 0!
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        const max = (yyyy - 18) + '-' + mm + '-' + dd;
        const min = (yyyy - 90) + '-' + mm + '-' + dd;

        date_inputs.forEach(el => { // Set 'Max' attribute
            if (el.getAttribute('role') == "dob") {
                el.setAttribute('max', max);
                el.setAttribute('min', min);
            }
        });
    }

    function reCheckValidity() {
        // quickRefs
        const invalids = form.querySelectorAll(':invalid'),
            valids = form.querySelectorAll(':valid');

        // Call respective function to handle
        type === 'strings' && invalid_strings_form(form, invalids, valids);
        type === 'checkOne' && invalid_checkOne_form(form, invalids, valids);

        // ===== Functions per invalid form type =====

        // Invalid string type forms
        function invalid_strings_form(form, invalids, valids) {
            invalids.forEach(el => { // Located an invalid input
                el.type != 'date' ? toggleInvalid(true, el, 'This field is required.') : validateDateInput(el);
            });
            valids.forEach(el => { // Located an invalid input
                toggleInvalid(false, el);
            });
        }

        // Invalid Check 1 per section type forms
        function invalid_checkOne_form(form, invalids, valids) {
            const sections = form.querySelectorAll('section');
            sections.forEach(section => {
                section.classList.remove('invalid');
                const invalid_desc = section.querySelector('.invalid_desc');
                invalid_desc && invalid_desc.remove();
            });
            // Handle section validity
            invalids.forEach(el => {
                const invalid_section = el.closest('section');
                const el_siblings = invalid_section.querySelectorAll('[type="checkbox"]');
                invalid_section.classList.add('invalid'); // Located an invalid input
                invalid_section.querySelector('.u-heading-2').insertAdjacentHTML('afterend', '<p class="invalid_desc">This section requires input</>');
                el_siblings.forEach(el => {
                    el.addEventListener('click', () => {
                        invalid_section.classList.remove('invalid');
                        invalid_section.querySelector('.invalid_desc').remove();
                    });
                });
            });
        }
    }

    // Check single input (not entire form)
    function checkInput(el) {
        const section = el.closest('.form-section');
        const clone = section.cloneNode(true);
        const tempForm = document.createElement('form');
        tempForm.appendChild(clone);
        console.log('yep');
        if (el.tagName == 'SELECT' && el.value) { // QuickFix select inputs
            addCheck(section);
        } else {
            tempForm.checkValidity() ? addCheck(section) : rmCheck(section);
        }
    }

    function addCheck(section) {
        section.querySelector('.section-title').classList.add('section-checked');
    }
    
    function rmCheck(section) {
        section.querySelector('.section-title').classList.remove('section-checked');
    }

    const allRequired = document.querySelectorAll('.form-section input, .form-section select');
        if (allRequired.length > 0) {
        allRequired.forEach(el => {
            el.addEventListener('change', () => { checkInput(el); });
        });
    }

    // Submit the form
    function submitForm() {
        // Create submit button
        const submit = document.createElement('button');
        submit.hidden = true;
        submit.setAttribute('type', 'submit');
        form.appendChild(submit);

        // Submit form
        submit.click();
    }

    if (type === 'checkOne') { // If form type is a 'check just one per section'
        // Handle checkbox clicks & requires
        const sections = form.querySelectorAll('section');
        sections.forEach(section => {
            const checkboxes = section.querySelectorAll('input[type="checkbox"]');
            checkboxes[0].required = true; // Default
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('click', () => {
                    checkboxes.forEach(checkbox => {
                        checkbox.required = false;
                        checkbox.checked = false;
                    });
                    checkbox.required = true;
                    checkbox.checked = true;
                });
            });
        });
    }

    // What happens when you click the next button
    next.addEventListener('click', function (e) {
        if (form.checkValidity()) { // If form is valid
            submitForm();
        } else { // Handle invalid form
            reCheckValidity();
        }
    });
}

module.exports = {
    toggleInvalid: toggleInvalid
}