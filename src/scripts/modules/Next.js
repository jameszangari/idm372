module.exports = {
    init: function() {
        const next = docQ('[data-form]');
        if (!next) {return}
        else { // If the next button has a form to submit before navigating
            // quickRefs
            const url = next.href,
                form = docQ(next.dataset.form);

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
                    console.error('Invalid Form');
                }
            });
        };
    },
}