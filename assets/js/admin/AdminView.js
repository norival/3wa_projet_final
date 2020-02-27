export class AdminView {
    constructor()
    {
        this.element = this.getElement('#admin-main');
    }

    /***************************************************************************
     * Helper methods
     **************************************************************************/

    /**
     * createElement
     *
     * Create an element and optionnally adds a class and an id
     *
     * @returns Element
     */
    createElement(tag, className, id)
    {
        const element = document.createElement(tag);

        if (className) {
            element.classList.add(className);
        }

        if (id) {
            element.id = id;
        }

        return element;
    }

    /**
     * getElement
     *
     * Retrieve an element from the DOM
     *
     * @returns Element
     */
    getElement(selector)
    {
        return document.querySelector(selector);
    }


    /***************************************************************************
     * Methods to render views
     **************************************************************************/

    renderViewList(viewList)
    {
        // promise.then(viewList => {
            const ul = this.createElement('ul', null, 'viewList');

            viewList.forEach((view) => {
                // create list item
                let li = this.createElement('li');
                let a  = this.createElement('a');

                a.href         = '#';
                a.text         = view.title;
                a.dataset.name = view.name;
                a.dataset.id   = view.id

                // TODO add event listener
                // a.addEventListener('click', this.onClickView.bind(this));

                li.appendChild(a);

                // append element to list
                ul.appendChild(li);
            });

            this.element.appendChild(ul);
        // });
    }

    renderViewForm(viewData)
    {
        const viewDiv = this.createElement('div');
        const form    = this.createElement('form');

        let h3       = this.createElement('h3');
        h3.innerHTML = `View: ${viewData.name}`;
        viewDiv.appendChild(h3);

        let fieldset = this.createElement('fieldset');
        let h4       = this.createElement('h4');
        h4.innerHTML = 'Informations';

        fieldset.appendChild(h4);

        let ul      = this.createElement('ul');
        const infos = {'name': viewData.name, 'title': viewData.title}

        for (const key in infos) {
            let li    = this.createElement('li');
            let input = this.createElement('input');
            let label = this.createElement('label');

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
        form.appendChild(fieldset);

        const table = this.createElement('table');
        const thead = this.createElement('thead');
        const tbody = this.createElement('tbody');

        let tr = this.createElement('tr');
        let th = this.createElement('th');

        th.innerHTML = 'Name';
        tr.appendChild(th);

        thead.appendChild(tr);
        table.appendChild(thead);

        viewData.viewContents.forEach((value) => {
            let tr = this.createElement('tr');
            let td = this.createElement('td');
            let a  = this.createElement('a');

            a.href              = '#';
            a.text              = value.content.name;
            a.dataset.contentId = value.content.id;

            td.appendChild(a)
            tr.appendChild(td);
            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        viewDiv.appendChild(form);

        h3           = this.createElement('h3');
        h3.innerHTML = 'Content list';
        viewDiv.appendChild(h3);

        viewDiv.appendChild(table);

        ul = this.createElement('ul', null, 'buttonList');

        let li = this.createElement('li');

        let button       = this.createElement('button', null, 'addContent');
        button.innerHTML = 'Add content';
        li.appendChild(button);
        ul.appendChild(li);

        li               = this.createElement('li');
        button           = this.createElement('button', null, 'submitButton');
        button.innerHTML = 'Save';
        li.appendChild(button);
        ul.appendChild(li);

        li               = this.createElement('li');
        button           = this.createElement('button', null, 'cancelButton');
        button.innerHTML = 'Cancel';
        li.appendChild(button);
        ul.appendChild(li);

        viewDiv.appendChild(ul);
        this.element.appendChild(viewDiv);

        // TODO add event listeners for addContent and cancel buttons
        // document
        //     .getElementById('addContent')
        //     .addEventListener('click', this.onClickAddContent.bind(this));
        // document
        //     .getElementById('cancelButton')
        //     .addEventListener('click', this.onClickCancel.bind(this));
    }


    /***************************************************************************
     * Methods to bind event Listeners
     **************************************************************************/

    bindListViews(handler)
    {
        this.getElement('#views').addEventListener('click', event => {
            event.preventDefault();

            handler();
        });
    }

    bindClickView(handler)
    {
        this.getElement('#viewList').addEventListener('click', event => {
            event.preventDefault();
            console.log(event.target.dataset.id)

            handler(event.target.dataset.id);
        });
    }

    bindClickSubmitView(handler)
    {
        console.log('hello');
        this.getElement('#submitButton').addEventListener('click', event => {
            event.preventDefault();
            const formData = 'submit the form';

            handler(formData);
        });
    }
}
