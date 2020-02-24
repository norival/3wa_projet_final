import {Utils} from '../utils/Utils';

export class View {
    constructor()
    {
        this.form          = null;
    }

    list(output)
    {
        fetch('admin/list-view')
            .then(response => response.json())
            .then(viewList => {
                viewList.forEach((view) => {
                    // create list item
                    let li = document.createElement('li');
                    let a  = document.createElement('a');

                    a.href         = '#';
                    a.text         = view.title;
                    a.dataset.name = view.name;
                    a.dataset.id   = view.id

                    li.appendChild(a);

                    // append element to list
                    output.appendChild(li);
                });
            });
    }

    buildForm(outputElement)
    {
        this.form = document.createElement('form');
        this.form.dataset.viewId = event.target.dataset.id;

        fetch('/admin/view/form/' + event.target.dataset.name)
            .then(response => response.json())
            .then(json => {
                // viewForm.build(JSON.parse(json));
                const data = JSON.parse(json);
                console.log(data);

                let fieldset = document.createElement('fieldset');
                let h3       = document.createElement('h3');
                h3.innerHTML = 'Informations';

                fieldset.appendChild(h3);

                let ul = document.createElement('ul');
                const infos = {'name': data.name, 'title': data.title}
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

                this.form.appendChild(fieldset);

                fieldset = document.createElement('fieldset');
                h3       = document.createElement('h3');

                h3.innerHTML = 'Content types';
                fieldset.appendChild(h3);

                ul = document.createElement('ul');

                ul.id = 'contentTypeList';

                data.contentType.forEach((value) => {
                    let li = document.createElement('li');
                    let input = document.createElement('input');
                    let button = document.createElement('button');

                    input.setAttribute('name', 'contentType');
                    input.setAttribute('type', 'text');
                    input.value = value;
                    input.dataset.contentType = value;

                    button.innerHTML = 'Remove';
                    button.addEventListener('click', this.onClickRemoveButton.bind(this));
                    button.dataset.contentType = value;

                    li.appendChild(input);
                    li.appendChild(button);
                    li.dataset.contentType = value;

                    ul.appendChild(li);

                    this.contentTypeCounter++;
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

                outputElement.appendChild(this.form);

                document
                    .getElementById('addContentType')
                    .addEventListener('click', this.onClickAddContentType.bind(this));
                document
                    .getElementById('submitButton')
                    .addEventListener('click', this.onClickSubmit.bind(this));
                document
                    .getElementById('cancelButton')
                    .addEventListener('click', this.onClickCancel.bind(this));
            })
    }

    onClickAddContentType(event)
    {
        event.preventDefault();
        let li     = document.createElement('li');
        let input  = document.createElement('input');
        let button = document.createElement('button');

        input.setAttribute('type', 'text');
        input.setAttribute('name', 'contentType');

        button.innerHTML = 'Remove';

        li.dataset.contentType     = `contentType-${++this.contentTypeCounter}`;
        button.dataset.contentType = `contentType-${this.contentTypeCounter}`;

        li.appendChild(input);
        li.appendChild(button);

        button.addEventListener('click', this.onClickRemoveButton.bind(this));

        document.getElementById('contentTypeList').appendChild(li);
    }

    onClickCancel(event)
    {
        event.preventDefault();

        this.form.remove();
    }

    onClickRemoveButton(event)
    {
        event.preventDefault();

        document.querySelector(`li[data-content-type="${event.target.dataset.contentType}"]`).remove();
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

        fetch('admin/view/' + this.form.dataset.viewId, {
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
                this.form.remove();
            })
    }
}
