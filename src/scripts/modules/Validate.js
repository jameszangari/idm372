const helper = require('../helper');

module.exports = {
    init: function () {
        const date_inputs = docQA('input[type="date"]');
        if (date_inputs.length > 0) {
            // Set 18 y/o restriction
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; // January is 0!
            var yyyy = today.getFullYear();
            if (dd < 10) {
                dd = '0' + dd
            }
            if (mm < 10) {
                mm = '0' + mm
            }
            const max = (yyyy - 18) + '-' + mm + '-' + dd;
            const min = (yyyy - 90) + '-' + mm + '-' + dd;

            date_inputs.forEach(el => { // Set 'Max' attribute
                el.setAttribute('max', max);
                el.setAttribute('min', min);
            });
        }
        const next = docQ('[data-form]');
        if (!next) { return }
        else { // If the next button has a form to submit before navigating
            // quickRefs
            const url = next.href,
                form = docQ(next.dataset.form),
                type = form.getAttribute('type');

            if (type === 'checkOne') {
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

            next.addEventListener('click', (e) => {
                e.preventDefault(); // Stop anchor from changing page location by default
                if (form.checkValidity()) { // If form is valid
                    // Create submit button
                    const submit = document.createElement('button');
                    submit.hidden = true;
                    submit.setAttribute('type', 'submit');
                    form.appendChild(submit);

                    // Submit form
                    submit.click();
                    // Navigate to next page
                    window.location.href = url;
                } else { // Handle invalid form
                    console.error('Form is invalid');
                    const invalids = form.querySelectorAll(':invalid'),
                        valids = form.querySelectorAll(':valid');

                    // Call respective function to handle
                    type === 'strings' && invalid_strings(form, invalids, valids);
                    type === 'checkOne' && invalid_checkOne(form, invalids, valids);

                    // Functions per invalid form type
                    function invalid_strings(form, invalids, valids) {
                        invalids.forEach(el => {
                            el.classList.add('invalid'); // Located an invalid input
                            // Check date input
                            el.addEventListener('change', () => {
                                el.value.length > 0 ? el.classList.remove('invalid') : el.classList.add('invalid');
                            });
                        });
                    }
                    function invalid_checkOne(form, invalids, valids) {
                        const sections = form.querySelectorAll('section');
                        sections.forEach(section => {
                            section.classList.remove('invalid');
                        })

                        // Handle section validity
                        invalids.forEach(el => {
                            const invalid_section = el.closest('section');
                            const el_siblings = invalid_section.querySelectorAll('[type="checkbox"]');
                            invalid_section.classList.add('invalid'); // Located an invalid input
                            el_siblings.forEach(el => {
                                el.addEventListener('click', () => {
                                    invalid_section.classList.remove('invalid');
                                });
                            });
                        });
                    }
                }
            });
        };
    },
}