import {Utils} from '../utils/Utils';

export class Components {
    /***************************************************************************
     * Generic components
     **************************************************************************/

    /**
     * Create a 'button' element
     *
     * @param {(string|string[])} classList A class name or an array of class names
     * @param {string} id An id
     * @param {string} html The innerHtml
     * @returns {Element} the created NodeElement
     */
    static button(classList, id, html)
    {
        const element = document.createElement('a');

        // if (classList) {
            if (!Array.isArray(classList)) {
                // put in an array if not already
                classList = [classList];
            }

            // always add the 'button' class
            classList.push('button');

            // use spread syntax to assign all classes names
            element.classList.add(...classList);
        // }

        if (id) {
            element.id = id;
        }

        element.innerHTML = html;
        element.href      = '#';

        return element;
    }

    /**
     * Create a list of action buttons for tables (show, edit end delete)
     *
     * @param {string} forTable The table for which it is created
     * @param {{name: string, id: int}} data The data to bind to the dataset
     * @returns {Element}
     */
    static actionButtonList(forTable, data)
    {
        const ul = Utils.createElement('ul', 'actions');

        let li               = Utils.createElement('li');
        let a                = Utils.createElement('a', 'button', `show-${forTable}`);
        a.href               = '#';
        a.innerHTML          = 'Show/Edit';
        a.dataset.action     = `show-${forTable}`;
        a.dataset[data.name] = data.id;
        li.appendChild(a);
        ul.appendChild(li);

        // li                   = Utils.createElement('li');
        // a                    = Utils.createElement('a', 'button', `edit-${forTable}`);
        // a.href               = '#';
        // a.innerHTML          = 'Edit';
        // a.dataset.action     = `edit-${forTable}`;
        // a.dataset[data.name] = data.id;
        // li.appendChild(a);
        // ul.appendChild(li);

        li                    = Utils.createElement('li');
        a                     = Utils.createElement('a', ['button', 'delete'], `delete-${forTable}`);
        a.href                = '#';
        a.innerHTML           = 'Delete';
        a.dataset.action      = `delete-${forTable}`;
        a.dataset[data.name] = data.id;
        li.appendChild(a);
        ul.appendChild(li);

        return ul;
    }

    /**
     * Create an element to render a not implemented features
     *
     * @returns {Element}
     */
    static notImplementedFeature()
    {
        const div = Utils.createElement('div', 'notImplemented');
        const p   = Utils.createElement('p');
        const img = Utils.createElement('img');

        p.innerHTML = 'Working on it! Come back later!';

        img.src = require('../../images/bud.gif');

        div.appendChild(p);
        div.appendChild(img);

        return div;
    }


    /***************************************************************************
     * Components related to home page screen
     **************************************************************************/

    /**
     * Create the home page for the admin panel
     *
     * @param {{siteName: string, userEmail: string}} informations Informations about the website
     * @returns {Element} The admin home page element
     */
    static homePage(informations)
    {
        const div   = Utils.createElement('div', null, 'admin-homepage');
        const title = Utils.createElement('h1');
        let message = Utils.createElement('p');
        let list    = Utils.createElement('ul', 'bulletList');
        let item    = Utils.createElement('li');

        title.innerHTML = "Website administration";
        div.appendChild(title);

        message.innerHTML = `
            Welcome back ${informations.userEmail}! This is the administration panel
            of your website!
        `;
        div.appendChild(message);

        message           = Utils.createElement('p');
        message.innerHTML = 'Here, there should be:';
        div.appendChild(message);

        item.innerHTML = 'A link to the documentation';
        list.appendChild(item);

        item           = Utils.createElement('li');
        item.innerHTML = 'An overcollection of the site content (number of collections, number of contents, ...';
        list.appendChild(item);

        div.appendChild(list);

        return div;
    }


    /***************************************************************************
     * Components related to pagination
     **************************************************************************/

    /**
     * Create the upper hand of the pagination: number of elements displayed,
     * total number of elements and selection of elements per page
     *
     * @param {int} listLength The length of the current list
     * @param {{itemsPerPage: int, numberOfPages: int, page: int, total: int}} paginationState The current
     *      state of the pagination
     * @returns {Element}
     */
    static paginationHead(listLength, paginationState)
    {
        // available options for number of elements per page
        const pageOptions = [5, 10, 20, 30, 50];

        const paginationHead = Utils.createElement('ul', 'paginationHead');
        const select         = Utils.createElement('select', null, 'choose-items-per-page');

        let li       = Utils.createElement('li');
        li.innerHTML = `${listLength}/${paginationState.total} elements`;
        paginationHead.appendChild(li)

        li = Utils.createElement('li');
        pageOptions.forEach((opt) => {
            const option = Utils.createElement('option');
            option.value = opt;
            option.innerHTML = opt;

            if (opt === paginationState.itemsPerPage) {
                option.setAttribute('selected', true);
            }

            select.appendChild(option);
        });
        select.dataset.onScreen = 'collectionList';
        li.appendChild(select);

        const text = document.createTextNode('entries per page');

        li.appendChild(text);
        paginationHead.appendChild(li);

        return paginationHead;
    }

    /**
     * Create the lower hand of the pagination: the navigation buttons
     *
     * @param {{itemsPerPage: int, numberOfPages: int, page: int, total: int}} paginationState The current
     *      state of the pagination
     * @returns {Element}
     */
    static paginationPages(paginationState)
    {
        const pagination = Utils.createElement('ul', 'paginationPages');

        if (paginationState.page > 1) {
            let li         = Utils.createElement('li');
            let a          = Utils.createElement('a', 'navButton', 'first-page');
            a.href         = '#';
            a.innerHTML    = '<<';
            a.dataset.page = 1;
            li.appendChild(a);
            pagination.appendChild(li);

            li             = Utils.createElement('li');
            a              = Utils.createElement('a', 'navButton', 'previous-page');
            a.href         = '#';
            a.innerHTML    = '<';
            a.dataset.page = paginationState.page - 1;
            li.appendChild(a);
            pagination.appendChild(li);
        }

        if (paginationState.page >= 5) {
            let li         = Utils.createElement('li');
            let a          = Utils.createElement('a', 'navButton', 'previous-page');
            a.href         = '#';
            a.innerHTML    = '&#8230;';
            a.dataset.page = paginationState.page - 4;
            li.appendChild(a);
            pagination.appendChild(li);
        }

        for (let i = paginationState.page - 3; i <= paginationState.page + 3; i++) {
            if (i < 1 || i > paginationState.numberOfPages) {
                continue;
            }

            let li = Utils.createElement('li');
            let a  = Utils.createElement('a', 'navButton');
            
            a.href             = '#';
            a.innerHTML        = i;
            a.dataset.page     = i;
            a.dataset.disabled = false;

            if (i === paginationState.page) {
                a.classList.add('current');
            }

            li.appendChild(a);

            pagination.appendChild(li);
        }

        if (paginationState.page <= paginationState.numberOfPages - 5) {
            let li         = Utils.createElement('li');
            let a          = Utils.createElement('a', 'navButton', 'previous-page');
            a.href         = '#';
            a.innerHTML    = '&#8230;';
            a.dataset.page = paginationState.page + 4;
            li.appendChild(a);
            pagination.appendChild(li);
        }


        if (paginationState.page < paginationState.numberOfPages) {
            let li         = Utils.createElement('li');
            let a          = Utils.createElement('a', 'navButton', 'next-page');
            a.href         = '#';
            a.innerHTML    = '>';
            a.dataset.page = paginationState.page + 1;
            li.appendChild(a);
            pagination.appendChild(li);

            li             = Utils.createElement('li');
            a              = Utils.createElement('a', 'navButton', 'last-page');
            a.href         = '#';
            a.innerHTML    = '>>';
            a.dataset.page = paginationState.numberOfPages;
            li.appendChild(a);
            pagination.appendChild(li);
        }

        return pagination;
    }


    /***************************************************************************
     * Components related to collection screen
     **************************************************************************/

    /**
     * Create the collection homepage
     *
     * @returns {Element}
     */
    static collectionsHome()
    {
        const outputDiv  = Utils.createElement('div', null, 'collectionsHomeDiv');
        const title      = Utils.createElement('h1');
        const toolsList  = Utils.createElement('ul', 'tools');
        const newCollection    = Utils.createElement('a', 'button', 'new-collection');
        const collectionSearch = Utils.createElement('input', 'search', 'search-collection');

        title.innerHTML = 'Collections';
        outputDiv.appendChild(title);

        let li            = Utils.createElement('li');
        newCollection.href      = '#';
        newCollection.innerHTML = 'Create collection';
        li.appendChild(newCollection);
        toolsList.appendChild(li);

        li = Utils.createElement('li');
        collectionSearch.setAttribute('type', 'text');
        collectionSearch.setAttribute('placeholder', 'Search Collections');
        li.appendChild(collectionSearch);
        toolsList.appendChild(li);

        outputDiv.appendChild(toolsList);

        return outputDiv;
    }

    /**
     * Create a list of available collections
     *
     * @param {Object} collectionListData The list of collections
     * @param {{itemsPerPage: int, numberOfPages: int, page: int, total: int}} paginationState The current
     *      state of the pagination
     * @returns {Element}
     */
    static collectionList(collectionListData, paginationState)
    {
        const outputDiv = Utils.createElement('div', null, 'collection-list-div');
        const table     = Utils.createElement('table', ['adminTable', 'fullWidth'], 'collections-list');
        const thead     = Utils.createElement('thead');
        const tbody     = Utils.createElement('tbody');

        // upper pagination
        outputDiv.appendChild(this.paginationHead(collectionListData.length, paginationState));
        outputDiv.appendChild(this.paginationPages(paginationState));

        // table header
        let th       = Utils.createElement('th', ['largeCell', 'textCell']);
        th.innerHTML = 'Name';
        thead.appendChild(th);

        th           = Utils.createElement('th', ['textCell']);
        th.innerHTML = 'User';
        thead.appendChild(th);

        th           = Utils.createElement('th', ['numCell']);
        th.innerHTML = 'Date';
        thead.appendChild(th);

        th           = Utils.createElement('th', ['numCell']);
        th.innerHTML = 'Last Update';
        thead.appendChild(th);

        table.appendChild(thead);

        // table body
        collectionListData.forEach((collectionData) => {
            const tr = Utils.createElement('tr');

            // first column
            let td     = Utils.createElement('td', 'textCell');
            let strong = Utils.createElement('strong');

            strong.innerHTML = collectionData.name;
            td.appendChild(strong);

            td.appendChild(this.actionButtonList('collection', {name: 'collectionId', id: collectionData.id}));
            tr.appendChild(td);

            // second column
            td          = Utils.createElement('td', 'textCell');
            let a       = Utils.createElement('a');
            a.href      = '#';
            a.innerHTML = collectionData.user.email;
            td.appendChild(a);
            tr.appendChild(td);

            // third column
            td             = Utils.createElement('td', 'numCell');
            let time       = Utils.createElement('time');
            time.innerHTML = Utils.formatDate(collectionData.created_at);
            time.setAttribute('datetime', collectionData.created_at);
            td.appendChild(time);
            tr.appendChild(td);

            // fourth column
            td             = Utils.createElement('td', 'numCell');
            time           = Utils.createElement('time');
            if (collectionData.updated_at) {
                time.innerHTML = Utils.formatDate(collectionData.updated_at);
                time.setAttribute('datetime', collectionData.updated_at);
            } else {
                time.innerHTML = 'Never';
                time.setAttribute('datetime', null);
            }
            td.appendChild(time);
            tr.appendChild(td);

            tbody.appendChild(tr)
        });

        table.appendChild(tbody);
        outputDiv.appendChild(table);

        // lower navigation
        outputDiv.appendChild(this.paginationPages(paginationState));

        return outputDiv;
    }

    /**
     * Create the collection details element
     *
     * @param {Object} collectionData The data for the given collection
     * @returns {Element}
     */
    static collectionDetails(collectionData)
    {
        const outputDiv      = Utils.createElement('div', null, 'collection-details-div');
        const title          = Utils.createElement('h1');
        const collectionUser = Utils.createElement('div', 'collectionUser');

        // title ---------------------------------------------------------------
        title.innerHTML = `${collectionData.title} (${collectionData.name})`;
        outputDiv.appendChild(title);

        // user informations ---------------------------------------------------
        let a       = Utils.createElement('a');
        a.href      = '#';
        a.innerHTML = `User: ${collectionData.user.email}`;
        collectionUser.appendChild(a);
        outputDiv.appendChild(collectionUser);

        // collection informations ---------------------------------------------------
        let section = Utils.createElement('section', 'adminSection');
        let secTitle = Utils.createElement('h2');

        secTitle.innerHTML = 'Informations';
        section.appendChild(secTitle);

        // adds form for collection informations
        section.appendChild(this.collectionInformationsForm(collectionData));

        // add button list: 'Save' and 'Cancel'
        let ul = Utils.createElement('ul', 'buttonList', 'collection-info-actions');

        let li           = Utils.createElement('li');
        a                = Utils.createElement('a', ['button', 'save', 'big']);
        a.href           = '#';
        a.innerHTML      = 'Save';
        a.dataset.action = 'save';
        a.dataset.collectionId = collectionData.id;
        li.appendChild(a);
        ul.appendChild(li);

        li               = Utils.createElement('li');
        a                = Utils.createElement('a', ['button', 'cancel', 'big']);
        a.href           = '#';
        a.innerHTML      = 'Cancel';
        a.dataset.action = 'cancel';
        li.appendChild(a);
        ul.appendChild(li);

        section.appendChild(ul);
        outputDiv.appendChild(section);

        if (!collectionData.id) {
            // if creating a new collection, do not add parts related to
            // content
            return outputDiv;
        }

        // collection content --------------------------------------------------------
        section        = Utils.createElement('section', 'adminSection');
        secTitle       = Utils.createElement('h2');
        let buttonList = Utils.createElement('ul', ['buttonList', 'content-list-actions']);
        buttonList.dataset.collectionId = collectionData.id;

        secTitle.innerHTML = 'Content';
        section.appendChild(secTitle);

        li         = Utils.createElement('li');
        let button = this.button('delete', null, 'Remove selected content');
        button.dataset.action = 'remove-content';
        li.appendChild(button);
        buttonList.appendChild(li);

        li     = Utils.createElement('li');
        button = this.button(null, null, 'Add content');
        button.dataset.action = 'add-content';
        li.appendChild(button);
        buttonList.appendChild(li);

        section.appendChild(buttonList);

        // content list
        section.appendChild(this.contentList(collectionData.collectionContents));

        buttonList = Utils.createElement('ul', ['buttonList', 'content-list-actions']);
        buttonList.dataset.collectionId = collectionData.id;

        li     = Utils.createElement('li');
        button = this.button('delete', null, 'Remove selected content');
        button.dataset.action = 'remove-content';
        li.appendChild(button);
        buttonList.appendChild(li);

        li     = Utils.createElement('li');
        button = this.button(null, null, 'Add content');
        button.dataset.action = 'add-content';
        li.appendChild(button);
        buttonList.appendChild(li);

        section.appendChild(buttonList);

        outputDiv.appendChild(section);

        // return
        return outputDiv;
    }

    /**
     * Create a form to edit/create collection informations
     *
     * @returns {Element} The form
     */
    static collectionInformationsForm(collectionData)
    {
        const form      = Utils.createElement('form', 'adminForm', 'collection-form');
        const inputList = Utils.createElement('ul', 'inputList');

        // collection name field
        let li          = Utils.createElement('li');
        let label       = Utils.createElement('label');
        let input       = Utils.createElement('input', null, 'collection-name');
        input.value     = collectionData.name;
        label.innerHTML = 'Name';
        input.setAttribute('name', 'name');
        input.setAttribute('type', 'text');
        input.setAttribute('placeholder', 'Collection name');
        input.setAttribute('required', true);
        // form validation
        input.dataset.required  = true;
        input.dataset.type      = 'text';
        input.dataset.form      = true;
        input.dataset.fieldName = 'Name';
        li.appendChild(label);
        li.appendChild(input);
        inputList.appendChild(li);

        // collection title field
        li              = Utils.createElement('li');
        label           = Utils.createElement('label');
        input           = Utils.createElement('input', null, 'collection-title');
        label.innerHTML = 'Title';
        input.value     = collectionData.title;
        input.setAttribute('name', 'title');
        input.setAttribute('type', 'text');
        input.setAttribute('placeholder', 'Collection title');
        input.setAttribute('required', true);
        // form validation
        input.dataset.required  = true;
        input.dataset.type      = 'text';
        input.dataset.form      = true;
        input.dataset.fieldName = 'Title';
        li.appendChild(label);
        li.appendChild(input);
        inputList.appendChild(li);

        // collection description field
        li              = Utils.createElement('li');
        label           = Utils.createElement('label');
        input           = Utils.createElement('textarea', null, 'collection-description');
        input.value     = collectionData.description;
        label.innerHTML = 'Description';
        input.setAttribute('name', 'description');
        input.setAttribute('type', 'text');
        input.setAttribute('placeholder', 'Collection description');
        // form validation
        input.dataset.required  = false;
        input.dataset.type      = 'text';
        input.dataset.form      = true;
        input.dataset.fieldName = 'Name';
        li.appendChild(label);
        li.appendChild(input);
        inputList.appendChild(li);

        form.appendChild(inputList);
        form.dataset.collectionId = collectionData.id;

        return form;
    }

    /**
     * Create a modal window to select content to add to a collection
     *
     * @returns {Element} The created element
     */
    static addContentToCollection(collectionId)
    {
        const modal            = Utils.createElement('div', 'modal', 'add-content-to-collection');
        const modalContent     = Utils.createElement('div', 'modalContent');
        const toolsList        = Utils.createElement('ul', 'tools');
        const title            = Utils.createElement('h3');
        const collectionSearch = Utils.createElement('input', 'search', 'search-content');

        title.innerHTML = 'Add a content to the collection';
        modalContent.appendChild(title);

        let li = Utils.createElement('li');
        collectionSearch.setAttribute('type', 'text');
        collectionSearch.setAttribute('placeholder', 'Search collection');
        li.appendChild(collectionSearch);
        toolsList.appendChild(li);
        modalContent.appendChild(toolsList);

        const buttonList = Utils.createElement('ul', 'buttonList', 'content-list-actions');
        const button     = this.button(null, null, 'Add selected content');

        li                              = Utils.createElement('li');
        button.dataset.action           = 'add-content';
        buttonList.dataset.collectionId = collectionId;
        li.appendChild(button);
        buttonList.appendChild(li);

        modalContent.appendChild(buttonList);

        modal.appendChild(modalContent);
        return modal;
    }


    /***************************************************************************
     * Components related to content
     **************************************************************************/

    /**
     * Create the content homepage
     *
     * @returns {Element}
     */
    static contentHome()
    {
        const outputDiv     = Utils.createElement('div', null, 'content-home-div');
        const title         = Utils.createElement('h1');
        const toolsList     = Utils.createElement('ul', 'tools');
        const newContent    = Utils.createElement('a', 'button', 'new-content');
        const contentSearch = Utils.createElement('input', 'search', 'search-content');

        title.innerHTML = 'Content';
        outputDiv.appendChild(title);

        let li               = Utils.createElement('li');
        newContent.href      = '#';
        newContent.innerHTML = 'Create content';
        li.appendChild(newContent);
        toolsList.appendChild(li);

        li = Utils.createElement('li');
        contentSearch.setAttribute('type', 'text');
        contentSearch.setAttribute('placeholder', 'Search content');
        li.appendChild(contentSearch);
        toolsList.appendChild(li);

        outputDiv.appendChild(toolsList);

        return outputDiv;
    }

    /**
     * Create a list of available content
     *
     * @param {Object} contentListData The list of content
     * @param {{itemsPerPage: int, numberOfPages: int, page: int, total: int}?} paginationState The current
     *      state of the pagination
     * @returns {Element}
     */
    static contentList(contentListData, paginationState)
    {
        const outputDiv = Utils.createElement('div', null, 'content-list-div');
        const table = Utils.createElement('table', ['adminTable', 'fullWidth'], 'content-list');
        const thead = Utils.createElement('thead');
        const tbody = Utils.createElement('tbody');

        // upper pagination
        if (paginationState) {
            // only output if paginationState is given
            // NOTE is it good idea to make a JS pagination?
            outputDiv.appendChild(this.paginationHead(contentListData.length, paginationState));
            outputDiv.appendChild(this.paginationPages(paginationState));
        }

        // table head ----------------------------------------------------------
        let th    = Utils.createElement('th', 'tinyCell');
        let input = Utils.createElement('input', null, 'check-all');
        input.setAttribute('type', 'checkbox');
        input.dataset.action = 'check-all';
        th.appendChild(input);
        thead.appendChild(th);

        th           = Utils.createElement('th', ['largeCell', 'textCell']);
        th.innerHTML = 'Name';
        thead.appendChild(th);

        th           = Utils.createElement('th', ['textCell']);
        th.innerHTML = 'User';
        thead.appendChild(th);

        th           = Utils.createElement('th', ['numCell']);
        th.innerHTML = 'Date';
        thead.appendChild(th);

        th           = Utils.createElement('th', ['numCell']);
        th.innerHTML = 'Last updated';
        thead.appendChild(th);

        table.appendChild(thead);

        // table body ----------------------------------------------------------
        contentListData.forEach((contentData) => {
            if (!contentData.user) {
                // check if content data is nested (ie when it comes from a
                // join in collection table) and un-nest it
                contentData = contentData.content;
            }

            const tr = Utils.createElement('tr');

            // first column
            let td                  = Utils.createElement('td', 'tinyCell');
            let input               = Utils.createElement('input');
            input.dataset.contentId = contentData.id;
            input.setAttribute('type', 'checkbox');
            td.appendChild(input);
            tr.appendChild(td);

            // second column
            td         = Utils.createElement('td', 'textCell');
            let strong = Utils.createElement('strong');

            strong.innerHTML = contentData.name;
            td.appendChild(strong);

            td.appendChild(this.actionButtonList('content', {name: 'contentId', id: contentData.id}));
            tr.appendChild(td);

            // third column
            td          = Utils.createElement('td', 'textCell');
            let a       = Utils.createElement('a');
            a.href      = '#';
            a.innerHTML = contentData.user.email;
            td.appendChild(a);
            tr.appendChild(td);

            // fourth column
            td             = Utils.createElement('td', 'numCell');
            let time       = Utils.createElement('time');
            time.innerHTML = Utils.formatDate(contentData.created_at);
            time.setAttribute('datetime', contentData.created_at);
            td.appendChild(time);
            tr.appendChild(td);

            // fifth column
            td             = Utils.createElement('td', 'numCell');
            time           = Utils.createElement('time');
            if (contentData.updated_at) {
                time.innerHTML = Utils.formatDate(contentData.updated_at);
                time.setAttribute('datetime', contentData.updated_at);
            } else {
                time.innerHTML = 'Never';
                time.setAttribute('datetime', null);
            }
            td.appendChild(time);
            tr.appendChild(td);

            tbody.appendChild(tr)
        });

        table.appendChild(tbody);
        outputDiv.appendChild(table);

        // lower navigation
        if (paginationState) {
            outputDiv.appendChild(this.paginationPages(paginationState));
        }

        return outputDiv;
    }

    static contentListRow()
    {
    }

    /**
     * Create a form to edit a content
     *
     * @param {?object} contentData The content data
     * @returns {Element}
     */
    static contentDetails(contentData)
    {
        const outputDiv = Utils.createElement('div', null, 'content-details-div');
        outputDiv.innerHTML = `
            <h1>Content name</h1>
            <div class="collectionUser">User: <a href="#">${contentData.user.email}</a></div>

            <form id="content-form" class="adminForm" action="#" data-content-id="${contentData.id}">
                <section class="adminSection">
                    <h2>Informations</h2>
                    <ul class="inputList">
                        <li>
                            <label for="content-name">Name</label>
                            <input
                                type="text"
                                id="content-name"
                                name="name"
                                placeholder="Content name"
                                required data-required="true"
                                data-type="text"
                                data-field-name="Name"
                                data-form="true"
                                value="${contentData.name}">
                        </li>
                        <li>
                            <label for="content-type">Type</label>
                            <input
                                type="text"
                                id="content-type"
                                name="type"
                                placeholder="Content type"
                                required data-required="true"
                                data-type="text"
                                data-field-name="Type"
                                data-form="true"
                                value="${contentData.type}">
                        </li>
                    </ul>
                </section>
                <section class="adminSection">
                    <h2>Content</h2>
                    <table id="inner-content-list" class="adminTable innerContentTable fullWidth">
                        <thead>
                            <th class="tinyCell">Action</th>
                            <th class="tinyCell">Name</th>
                            <th>Content</th>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                    <ul id="content-info-actions" class="buttonList">
                        <li>
                            <a class="button" href="#" data-action="add-row">Add row</a>
                        </li>
                        <li>
                            <a class="button" href="#" data-action="save">Save</a>
                        </li>
                        <li>
                            <a class="button cancel" href="#" data-action="cancel">Cancel</a>
                        </li>
                    </ul>
                </section>
            </form>
        `;

        const tbody = outputDiv.querySelector('#inner-content-list tbody')

        // render rows
        for (const key in contentData.content) {
            const tr = Utils.createElement('tr');
            tr.innerHTML = `
                <td>
                    <a class="button delete" href="#" data-action="delete-row">Delete</a>
                </td>
                <td>
                    <input
                        type="text"
                        value="${key}">
                </td>
                <td>
                    <textarea
                        cols="30" rows="10"
                        >${contentData.content[key]}</textarea>
                </td>
            `;
            tbody.appendChild(tr);
        }

        return outputDiv;
    }

    /**
     * Create an inner content row
     *
     * @returns {Element}
     */
    static innerContentRow()
    {
        const tr = Utils.createElement('tr');
        tr.innerHTML = `
            <td>
                <a class="button delete" href="#" data-action="delete-row">Delete</a>
            </td>
            <td>
                <input
                    type="text">
            </td>
            <td>
                <textarea
                    cols="30" rows="10"
                    ></textarea>
            </td>
        `;

        return tr;
    }
}
