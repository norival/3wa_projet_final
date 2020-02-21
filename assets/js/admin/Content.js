import {Utils} from '../utils/Utils';

export class Content {
    constructor(parentElement)
    {
        this.parentElement = parentElement;
    }

    /**
     * Query server to get the content list and display it
     *
     * @returns {undefined}
     */
    list()
    {
        fetch('/admin/content')
            .then(response => response.json())
            .then(data => {
                Utils.clear(this.parentElement);

                const ul = document.createElement('ul');
                data.forEach(element => {
                    let li = document.createElement('li');
                    let a  = document.createElement('a');

                    a.text              = `${element.name} (${element.type})`;
                    a.href              = '#';
                    a.dataset.contentId = element.id;

                    li.appendChild(a)
                    ul.appendChild(li);
                });
                ul.addEventListener('click', this.onClickContent.bind(this));

                this.parentElement.appendChild(ul);
            })
    }

    onClickContent(event)
    {
        event.preventDefault();

        // check if we clicked on the link
        if (!event.target.dataset.contentId) {
            return 0;
        }

        fetch('/admin/content/' + event.target.dataset.contentId)
            .then(response => response.json())
            .then(data => {
                // TODO build a form in a modal window
                this.buildForm(data);
                document
                    .getElementById('submitButton')
                    .addEventListener('click', this.onClickSubmit.bind(this));
                document
                    .getElementById('cancelButton')
                    .addEventListener('click', this.onClickCancel.bind(this));
            })
    }

    onClickSubmit(event)
    {
        // TODO submit the form
        event.preventDefault();

        const formData = new FormData(document.querySelector('#contentForm form'));
        const data     = {};

        data['content'] = {}
        formData.forEach((element, key) => {
            if (key.match(/^content_/g)) {
                data['content'][key.substring(8)] = element;
                return;
            }

            if (key === 'contentId') {
                // do not send contentId hidden field
                return;
            }

            data[key] = element;
        });

        fetch('admin/content/' + document.querySelector('#contentForm [name="contentId"]').value, {
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
                console.log(json)
            })
    }

    onClickCancel(event)
    {
        event.preventDefault();

        this.parentElement.removeChild(document.getElementById('contentForm'));
    }

    buildForm(data)
    {
        const div  = document.createElement('div');
        const form = document.createElement('form');

        div.id  = 'contentForm';

        let fieldset = document.createElement('fieldset');
        let h3 = document.createElement('h3');

        h3.innerHTML = 'Informations';
        fieldset.appendChild(h3);

        let ul = document.createElement('ul');

        let li    = document.createElement('li');
        let input = document.createElement('input');
        let label = document.createElement('label');

        label.setAttribute('for', 'name');
        label.innerHTML = 'Name';
        input.setAttribute('type', 'text');
        input.setAttribute('name', 'name');
        input.value = data.name;

        li.appendChild(label);
        li.appendChild(input);
        ul.appendChild(li);

        li    = document.createElement('li');
        input = document.createElement('input');
        label = document.createElement('label');

        label.setAttribute('for', 'type');
        label.innerHTML = 'Type';
        input.setAttribute('type', 'text');
        input.setAttribute('name', 'type');
        input.value = data.type;

        li.appendChild(label);
        li.appendChild(input);
        ul.appendChild(li);

        fieldset.appendChild(ul);

        form.appendChild(fieldset);


        fieldset = document.createElement('fieldset');
        h3 = document.createElement('h3');

        h3.innerHTML = 'Content';
        fieldset.appendChild(h3);

        ul = document.createElement('ul');

        for (let property in data.content) {
            let li    = document.createElement('li');
            let label = document.createElement('label');
            let input = document.createElement('input');

            label.innerHTML = property;
            label.setAttribute('for', `content_${property}`);

            input.setAttribute('type', 'text');
            input.setAttribute('name', `content_${property}`);
            input.value = data.content[property];
            
            li.appendChild(label);
            li.appendChild(input);

            ul.appendChild(li);
        }

        fieldset.appendChild(ul);
        form.appendChild(fieldset);

        let button = document.createElement('button');
        ul = document.createElement('ul');
        li = document.createElement('li');

        button.innerHTML = 'Save';
        button.id = 'submitButton';

        li.appendChild(button);
        ul.appendChild(li);

        button = document.createElement('button');
        li = document.createElement('li');

        button.innerHTML = 'Cancel';
        button.id = 'cancelButton';

        li.appendChild(button);
        ul.appendChild(li);

        form.appendChild(ul);

        input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', 'contentId');
        input.value = data.id;

        form.appendChild(input);
        div.appendChild(form);

        this.parentElement.appendChild(div);
    }
}
