import {Utils} from '../utils/Utils';

export class ViewForm {
    constructor(parentElement)
    {
        this.form                  = document.createElement('form');
        this.form.id               = 'viewForm';
        this.form.dataset.viewName = 'cv';
        this.parentElement         = parentElement;
    }

    createInformationFields(title, infos)
    {
        let fieldset = document.createElement('fieldset');
        let h3 = document.createElement('h3');
        h3.innerHTML = title;

        fieldset.appendChild(h3);

        let ul = document.createElement('ul');
        for (const key in infos) {
            let li = document.createElement('li');

            let input = document.createElement('input');
            let label = document.createElement('label');

            input.setAttribute('type', 'text');
            input.setAttribute('name', key);
            input.value = infos[key];
            label.innerHTML = key;
            label.setAttribute('for', key);

            li.appendChild(label);
            li.appendChild(input);
            ul.appendChild(li);
        }

        fieldset.appendChild(ul);

        return fieldset;
    }

    build(data)
    {
        // console.log(data);
        let informations = this.createInformationFields('Informations', {
            'name':  data.name,
            'title': data.title
        });
        this.form.appendChild(informations);

        let fieldset = document.createElement('fieldset');
        let h3 = document.createElement('h3');
        h3.innerHTML = 'Content types';
        fieldset.appendChild(h3);

        let ul = document.createElement('ul');
        ul.id = 'contentTypeList';
        data.contentType.forEach((value) => {
            let li = document.createElement('li');
            let input = document.createElement('input');
            let button = document.createElement('button');

            input.setAttribute('name', 'contentType');
            input.setAttribute('type', 'text');
            input.value = value;

            button.innerHTML = 'Remove';

            li.appendChild(input);
            li.appendChild(button);

            ul.appendChild(li);
        });
        fieldset.appendChild(ul);
        let button = document.createElement('button');

        button.innerHTML = 'Add content type';
        button.id = 'addContentType';
        fieldset.appendChild(button);

        this.form.appendChild(fieldset);

        ul = document.createElement('ul');
        let li = document.createElement('li');
        button = document.createElement('button');
        button.innerHTML = 'Save';
        button.id = 'submitButton';

        li.appendChild(button);
        ul.appendChild(li);

        li = document.createElement('li');
        button = document.createElement('button')
        button.innerHTML = 'Cancel';
        button.id = 'cancelButton';

        li.appendChild(button);
        ul.appendChild(li);

        this.form.appendChild(ul);

        this.parentElement.appendChild(this.form);

        document
            .getElementById('addContentType')
            .addEventListener('click', this.onClickAddContentType.bind(this));
        document
            .getElementById('submitButton')
            .addEventListener('click', this.onClickSubmit.bind(this));
        document
            .getElementById('cancelButton')
            .addEventListener('click', this.onClickCancel.bind(this));
    }

    onClickAddContentType(event)
    {
        // TODO Add a new content_type on the server
        event.preventDefault();
        let li    = document.createElement('li');
        let input = document.createElement('input');

        input.setAttribute('type', 'text');
        input.setAttribute('name', 'contentType');

        li.appendChild(input);
        document.getElementById('contentTypeList').appendChild(li);
    }

    onClickCancel(event)
    {
        // TODO: cancel
        event.preventDefault();

        Utils.clear(this.parentElement);
    }

    onClickSubmit(event)
    {
        // TODO Validation du formulaire
        event.preventDefault();

        const formData = new FormData(this.form);
        const data = {};

        data['content_type'] = [];
        formData.forEach((element, key) => {
            if (key === 'contentType') {
                data['content_type'].push(element);
                return;
            }
            data[key] = element;
        });

        fetch('admin/view/' + this.form.dataset.viewName, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(json => {
                // TODO If the server returns an error, display the form and the validation errors
                // TODO If the server says OK, display confirmation message and clear the page
                console.log(JSON.parse(json))
                this.clearForm();
            })
    }

    clearForm()
    {
        this.parentElement.removeChild(document.getElementById('viewForm'));
    }
}
