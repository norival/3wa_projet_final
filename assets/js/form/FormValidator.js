/**
 * Handles client-side form validation based on data-* attributes found in the
 * form element
 */
export class FormValidator {
    /**
     * Create the FormValidator object
     *
     * @param {Element} form The form to validate
     */
    constructor(form)
    {
        this.errors  = null;
        this.form    = form;
        this.isValid = null;
    }

    checkDataTypes()
    {
        // TODO method to check data types
    }

    checkMinimumLength()
    {
        // TODO method to check minimum length of fields
    }

    checkRequiredFields()
    {
        this.form.querySelectorAll('[data-required="true"]').forEach((element) => {
            if (element.value.trim() === '') {
                this.errors[element.dataset.fieldName] = 'This field is required';
            }
        });
    }

    /**
     * Run validations on the form
     */
    validate()
    {
        this.errors = {};

        this.checkRequiredFields();
        this.checkMinimumLength();
        this.checkDataTypes();

        this.isValid = !(this.errors !== null && Object.keys(this.errors).length > 0);
    }
}
