import {Utils} from '../utils/Utils';

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

    getViewFormData()
    {
        const contentList = this.getElement('#contentList');
        const data        = {};
        const formData    = new FormData(this.getElement('#viewForm'));

        formData.forEach((element, key) => {
            data[key] = element;
        });

        data['content'] = [];
        Array.from(contentList.rows).forEach((tr, row_ind) => {
            if (row_ind === 0) {
                return 0;
            }
            Array.from(tr.cells).forEach((cell) => {
                data['content'].push(cell.dataset.contentId);
            })
        });

        return data;
    }

    getContentFormData()
    {
        const formData = new FormData(this.getElement('#contentForm form'));
        const data     = {};

        data['content'] = {};
        formData.forEach((element, key) => {
            if (key.match(/^content_/g)) {
                data['content'][key.substring(8)] = element;
                return;
            }

            data[key] = element;
        });

        return data;
    }


    /***************************************************************************
     * Methods to render views
     **************************************************************************/

    renderViewList(viewList)
    {
        Utils.clear(this.element);

        const ul = this.createElement('ul', null, 'viewList');

        viewList.forEach((view) => {
            // create list item
            let li = this.createElement('li');
            let a  = this.createElement('a');

            a.href         = '#';
            a.text         = view.title;
            a.dataset.name = view.name;
            a.dataset.id   = view.id

            li.appendChild(a);

            // append element to list
            ul.appendChild(li);
        });

        this.element.appendChild(ul);
    }

    renderViewForm(viewData)
    {
        const viewDiv = this.createElement('div', null, 'viewFormOutput');
        const form    = this.createElement('form', null, 'viewForm');

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

        form.dataset.viewId = viewData.id;
        viewDiv.appendChild(form);

        h3           = this.createElement('h3');
        h3.innerHTML = 'Content list';
        viewDiv.appendChild(h3);

        viewDiv.appendChild(this._renderContentList(viewData.viewContents, true));

        ul = this.createElement('ul', null, 'buttonList');

        let li = this.createElement('li');

        let button       = this.createElement('button', null, 'addContent');
        button.innerHTML = 'Add content';
        li.appendChild(button);
        ul.appendChild(li);

        li               = this.createElement('li');
        button           = this.createElement('button', null, 'submitButton');
        button.innerHTML = 'Save';
        button.dataset.viewId = viewData.id;
        li.appendChild(button);
        ul.appendChild(li);

        li                      = this.createElement('li');
        button                  = this.createElement('button', null, 'cancelButton');
        button.innerHTML        = 'Cancel';
        button.dataset.parentId = 'viewFormOutput';
        li.appendChild(button);
        ul.appendChild(li);

        viewDiv.appendChild(ul);
        this.element.appendChild(viewDiv);

        // TODO add event listeners for addContent
        // this.getElement('#addContent').addEventListener('click', this.onClickAddContent);
        this.getElement('#cancelButton').addEventListener('click', this.onClickCancel);
    }

    renderContentList(contentList)
    {
        Utils.clear(this.element);

        this.element.appendChild(this._renderContentList(contentList, false));
    }

    renderContentForm(contentData)
    {
        const div  = this.createElement('div', null, 'contentForm');
        const form = this.createElement('form');

        let fieldset = this.createElement('fieldset');
        let h3 = this.createElement('h3');

        h3.innerHTML = 'Informations';
        fieldset.appendChild(h3);

        let ul = this.createElement('ul');

        let li    = this.createElement('li');
        let input = this.createElement('input');
        let label = this.createElement('label');

        label.setAttribute('for', 'name');
        label.innerHTML = 'Name';
        input.setAttribute('type', 'text');
        input.setAttribute('name', 'name');
        input.value = contentData.name;

        li.appendChild(label);
        li.appendChild(input);
        ul.appendChild(li);

        li    = this.createElement('li');
        input = this.createElement('input');
        label = this.createElement('label');

        label.setAttribute('for', 'type');
        label.innerHTML = 'Type';
        input.setAttribute('type', 'text');
        input.setAttribute('name', 'type');
        input.value = contentData.type;

        li.appendChild(label);
        li.appendChild(input);
        ul.appendChild(li);

        fieldset.appendChild(ul);

        form.appendChild(fieldset);

        fieldset = this.createElement('fieldset');
        h3 = this.createElement('h3');

        h3.innerHTML = 'Content';
        fieldset.appendChild(h3);

        ul = this.createElement('ul');

        for (let property in contentData.content) {
            let li    = this.createElement('li');
            let label = this.createElement('label');
            let input = this.createElement('input');

            label.innerHTML = property;
            label.setAttribute('for', `content_${property}`);

            input.setAttribute('type', 'text');
            input.setAttribute('name', `content_${property}`);
            input.value = contentData.content[property];
            
            li.appendChild(label);
            li.appendChild(input);

            ul.appendChild(li);
        }

        fieldset.appendChild(ul);
        form.appendChild(fieldset);

        let button = this.createElement('button', null, 'submitButton');
        ul = this.createElement('ul');
        li = this.createElement('li');

        button.innerHTML         = 'Save';
        button.dataset.contentId = contentData.id;

        li.appendChild(button);
        ul.appendChild(li);

        button = this.createElement('button', null, 'cancelButton');
        li     = this.createElement('li');

        button.innerHTML = 'Cancel';
        button.dataset.parentId = 'contentForm';

        li.appendChild(button);
        ul.appendChild(li);

        form.appendChild(ul);

        div.appendChild(form);

        this.element.appendChild(div);

        this.getElement('#cancelButton').addEventListener('click', this.onClickCancel);
    }


    _renderContentList(contentList, contentListIsNested = false)
    {
        const table = this.createElement('table', null, 'contentList');
        const tbody = this.createElement('tbody');

        const thead = this.createElement('thead');
        let th      = this.createElement('th');

        th.innerHTML = 'Name';
        thead.appendChild(th);

        th = this.createElement('th');
        th.innerHTML = 'Type';
        thead.appendChild(th);

        table.appendChild(thead);

        contentList.forEach(element => {
            if (contentListIsNested) {
                element = element.content;
            }

            let tr = this.createElement('tr');
            let td = this.createElement('td');
            let a  = this.createElement('a');

            a.text              = element.name;
            a.href              = '#';
            a.dataset.contentId = element.id;

            td.appendChild(a)
            tr.appendChild(td);

            td = this.createElement('td');
            a  = this.createElement('a');

            a.text              = element.type;
            a.href              = '#';
            a.dataset.contentId = element.id;

            td.appendChild(a)
            tr.appendChild(td);

            tbody.appendChild(tr);
        });

        // TODO add event listeners for click events
        // table.addEventListener('click', this.onClickContent.bind(this));
        table.appendChild(tbody);

        return table;
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

            handler(event.target.dataset.id);
        });
    }

    bindClickSubmitView(handler)
    {
        this.getElement('#submitButton').addEventListener('click', event => {
            event.preventDefault();

            handler(event.target.dataset.viewId, this.getViewFormData());
        });
    }

    bindListContent(handler)
    {
        this.getElement('#content').addEventListener('click', event => {
            event.preventDefault();

            handler();
        });
    }

    bindClickContent(handler)
    {
        this.getElement('#contentList').addEventListener('click', event => {
            event.preventDefault();

            handler(event.target.dataset.contentId);
        });
    }

    bindClickSubmitContent(handler)
    {
        this.getElement('#submitButton').addEventListener('click', event => {
            event.preventDefault();

            handler(event.target.dataset.contentId, this.getContentFormData());
        });
    }


    /***************************************************************************
     * Methods to handle view related events
     **************************************************************************/

    onClickCancel = (event) => {
        event.preventDefault();
        this.getElement(`#${event.target.dataset.parentId}`).remove();
    }
}
