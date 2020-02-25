import {Utils} from '../utils/Utils';

export class View {
    constructor(outputElement)
    {
        this.outputElement = outputElement;
        this.form          = null;
    }

    list()
    {
        fetch('admin/list-view')
            .then(response => response.json())
            .then(json => {
                const viewList = JSON.parse(json);

                viewList.forEach((view) => {
                    // create list item
                    let li = document.createElement('li');
                    let a  = document.createElement('a');

                    a.href         = '#';
                    a.text         = view.title;
                    a.dataset.name = view.name;
                    a.dataset.id   = view.id

                    a.addEventListener('click', this.onClickView.bind(this));

                    li.appendChild(a);

                    // append element to list
                    this.outputElement.appendChild(li);
                });

            });
    }

    home(outputElement)
    {
        const a = document.createElement('a');
        const h2 = document.createElement('h2');

        h2.innerHTML = 'List of views';
        outputElement.appendChild(h2);

        a.classList.add('button');
        a.text = 'New';
        a.href = '#';
        a.addEventListener('click', this.onClickNewView.bind(this));
        outputElement.appendChild(a);

        this.list(outputElement);
    }

    buildForm(outputElement)
    {
        this.viewDiv             = document.createElement('div');
        this.form                = document.createElement('form');
        this.form.dataset.viewId = event.target.dataset.id;

        fetch('/admin/view/form/' + event.target.dataset.name)
            .then(response => response.json())
            .then(json => {
                const data = JSON.parse(json);
                console.log(data);

                let h3 = document.createElement('h3');
                h3.innerHTML = `View: ${data.name}`;
                this.viewDiv.appendChild(h3);

                let fieldset = document.createElement('fieldset');
                let h4       = document.createElement('h4');
                h4.innerHTML = 'Informations';

                fieldset.appendChild(h4);

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

                const table = document.createElement('table');
                const thead = document.createElement('thead');
                const tbody = document.createElement('tbody');

                let tr = document.createElement('tr');
                let th = document.createElement('th');

                th.innerHTML = 'Name';
                tr.appendChild(th);

                thead.appendChild(tr);
                table.appendChild(thead);

                data.viewContents.forEach((value) => {
                    let tr = document.createElement('tr');
                    let td = document.createElement('td');
                    let a  = document.createElement('a');

                    a.href              = '#';
                    a.text              = value.content.name;
                    a.dataset.contentId = value.content.id;

                    td.appendChild(a)
                    tr.appendChild(td);
                    tbody.appendChild(tr);
                });

                table.appendChild(tbody);
                this.viewDiv.appendChild(this.form);

                h3 = document.createElement('h3');
                h3.innerHTML = 'Content list';
                this.viewDiv.appendChild(h3);

                this.viewDiv.appendChild(table);

                ul = document.createElement('ul');
                ul.id = 'buttonList';

                let li = document.createElement('li');

                let button       = document.createElement('button');
                button.id        = 'addContent';
                button.innerHTML = 'Add content';
                li.appendChild(button);
                ul.appendChild(li);

                li               = document.createElement('li');
                button           = document.createElement('button');
                button.innerHTML = 'Save';
                button.id        = 'submitButton';
                li.appendChild(button);
                ul.appendChild(li);

                li               = document.createElement('li');
                button           = document.createElement('button');
                button.innerHTML = 'Cancel';
                button.id        = 'cancelButton';
                li.appendChild(button);
                ul.appendChild(li);

                this.viewDiv.appendChild(ul);
                outputElement.appendChild(this.viewDiv);

                document
                    .getElementById('addContent')
                    .addEventListener('click', this.onClickAddContent.bind(this));
                document
                    .getElementById('submitButton')
                    .addEventListener('click', this.onClickSubmit.bind(this));
                document
                    .getElementById('cancelButton')
                    .addEventListener('click', this.onClickCancel.bind(this));
            })
    }

    onClickAddContent(event)
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

        this.viewDiv.remove();
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

    onClickView(event)
    {
        event.preventDefault();

        this.buildForm(this.outputElement);
    }

    onClickNewView(event)
    {
        event.preventDefault();
    }
}
