import {Utils} from '../utils/Utils';

export class Components {
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
    static createElement(tag, className, id)
    {
        const element = document.createElement(tag);

        if (className) {
            if (!Array.isArray(className)) {
                className = [className];
            }

            element.classList.add(...className);
        }

        if (id) {
            element.id = id;
        }

        return element;
    }

    /**
     * contentList
     *
     * The content list component.
     *
     * @param contentList The content list
     * @param contentListIsNested Whether the content is nested inside the
     * content list
     *
     * @returns {undefined}
     */
    static contentList(contentList, id, contentListIsNested = false)
    {
        const table = this.createElement('table', null, id);
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

            a.text               = element.type;
            a.href               = '#';
            a.dataset.contentId  = element.id;
            td.dataset.contentId = element.id;

            td.appendChild(a)
            tr.appendChild(td);

            tbody.appendChild(tr);
        });

        table.appendChild(tbody);

        return table;
    }

    /**
     * Create a list of available views
     *
     * @param {Array} viewList The content list
     *
     * @returns {Element}
     */
    static viewList(viewList)
    {
        const helpDiv   = this.createElement('div', 'help');
        const outputDiv = this.createElement('div');
        const p         = this.createElement('p');
        const title     = this.createElement('h2');
        const ul        = this.createElement('ul', null, 'viewList');

        p.innerHTML = `
            A view is a collection of contents that are rendered together
            within a template or from an API query.
        `;
        helpDiv.appendChild(p);

        title.innerHTML = 'Views';

        viewList.forEach((view) => {
            // create list item
            let li = this.createElement('li');
            let a  = this.createElement('a', 'button', 'editView');

            li.innerHTML = view.name;

            a.href         = '#';
            a.text         = 'Edit';
            a.dataset.name = view.name;
            a.dataset.id   = view.id

            li.appendChild(a);

            // adds button for visual editing of view (experimental)
            a = this.createElement('a', ['button', 'beta'], 'editViewVisual');

            a.href         = '#';
            a.text         = 'Visual edit';
            a.dataset.name = view.name;
            a.dataset.id   = view.id

            li.appendChild(a);
            ul.appendChild(li);
        });

        outputDiv.appendChild(title);
        outputDiv.appendChild(helpDiv);
        outputDiv.appendChild(ul);

        return outputDiv;
    }

    /**
     * Create a form to modify a View
     *
     * @param {object} viewData The view data
     *
     * @returns {Element}
     */
    static viewForm(viewData)
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
            label.innerHTML = Utils.capitalizeFirst(key);
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

        viewDiv.appendChild(this.contentList(viewData.viewContents, 'contentList', true));

        ul = this.createElement('ul', null, 'buttonList');

        let li = this.createElement('li');

        let button       = this.createElement('button', null, 'addContentButton');
        button.innerHTML = 'Add content';
        li.appendChild(button);
        ul.appendChild(li);

        li               = this.createElement('li');
        button           = this.createElement('button', null, 'submitViewButton');
        button.innerHTML = 'Save';
        button.dataset.viewId = viewData.id;
        li.appendChild(button);
        ul.appendChild(li);

        li                      = this.createElement('li');
        button                  = this.createElement('button', null, 'cancelContentEditButton');
        button.innerHTML        = 'Cancel';
        button.dataset.parentId = 'viewFormOutput';
        li.appendChild(button);
        ul.appendChild(li);

        viewDiv.appendChild(ul);

        return viewDiv;
    }

    /**
     * Create form to ask which type of content must be added
     *
     * @returns {Element}
     */
    static askNewContentForm()
    {
        const addContentDiv = this.createElement('div', null, 'askNewContentType');
        const ul = this.createElement('ul');

        let li = this.createElement('li');
        let a  = this.createElement('a', 'button', 'createContent');
        a.text = 'Create new Content';
        a.href = "#";
        li.appendChild(a);
        ul.appendChild(li);

        li     = this.createElement('li');
        a      = this.createElement('a', 'button', 'useContent');
        a.text = 'Use existing Content';
        a.href = "#";
        li.appendChild(a);
        ul.appendChild(li);

        addContentDiv.appendChild(ul);

        return addContentDiv;
    }

    /**
     * Create a search content form
     *
     * @returns {Element}
     */
    static searchContentForm()
    {
        const searchContentDiv = this.createElement('div', null, 'searchContent');
        const form             = this.createElement('form', null, 'searchContentForm');
        const input            = this.createElement('input');

        form.appendChild(input);
        searchContentDiv.appendChild(form);

        return searchContentDiv;
    }

    /**
     * Create list to display content suggestions
     *
     * @returns {undefined}
     */
    static contentSuggestion(suggestion)
    {
        const ul = this.createElement('ul');

        suggestion.forEach(element => {
            let li              = this.createElement('li');
            let a               = this.createElement('a');
            a.href              = '#';
            a.innerHTML         = element.name;
            a.dataset.contentId = element.id;

            li.appendChild(a);
            ul.appendChild(li);
        });

        return ul;
    }

    static content(content)
    {
        const div = this.createElement('div', 'contentDisplay', 'contentDisplay');

        let ul = this.createElement('ul');

        let li = this.createElement('li');
        li.innerHTML = content.name;
        ul.appendChild(li);

        li = this.createElement('li');
        li.innerHTML = content.type;
        ul.appendChild(li);

        li = this.createElement('li');
        li.innerHTML = content.created_at;
        ul.appendChild(li);

        li = this.createElement('li');
        li.innerHTML = content.updated_at;
        ul.appendChild(li);

        div.appendChild(ul);
        return div;
    }
}
