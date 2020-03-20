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
        section.appendChild(this.contentListForContent(collectionData.collectionContents));

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
     * Create a form to modify a Collection or create a new one
     *
     * @param {?object} collectionData The collection data
     *
     * @returns {Element}
     */
    static collectionForm(collectionData)
    {
        const outputDiv = Utils.createElement('div', null, 'collection-form-div');
        const title     = Utils.createElement('h1');
        const form      = Utils.createElement('form', 'adminForm', 'collection-form');

        let fieldset  = Utils.createElement('fieldset');
        let legend    = Utils.createElement('legend');
        let inputList = Utils.createElement('ul', 'inputList');

        if (collectionData) {
            // TODO do something when updating an existing collection
        }

        title.innerHTML = 'Create a new collection';
        outputDiv.appendChild(title);

        // collection informations fieldset ------------------------------------------
        legend.innerHTML = 'Collection informations';
        fieldset.appendChild(legend);

        // collection name field
        let li            = Utils.createElement('li');
        let label         = Utils.createElement('label');
        let input         = Utils.createElement('input', null, 'collection-name');
        label.innerHTML   = 'Name';
        input.setAttribute('name', 'collectionName');
        input.setAttribute('type', 'text');
        input.setAttribute('placeholder', 'Collection name');
        input.setAttribute('required', true);
        li.appendChild(label);
        li.appendChild(input);
        inputList.appendChild(li);

        // collection title field
        li                = Utils.createElement('li');
        label             = Utils.createElement('label');
        input             = Utils.createElement('input', null, 'collection-title');
        label.innerHTML   = 'Title';
        input.setAttribute('name', 'collectionTitle');
        input.setAttribute('type', 'text');
        input.setAttribute('placeholder', 'Collection title');
        input.setAttribute('required', true);
        li.appendChild(label);
        li.appendChild(input);
        inputList.appendChild(li);

        // collection description field
        li                = Utils.createElement('li');
        label             = Utils.createElement('label');
        input             = Utils.createElement('textarea', null, 'collection-description');
        label.innerHTML   = 'Description';
        input.setAttribute('name', 'collectionDescription');
        input.setAttribute('type', 'text');
        input.setAttribute('placeholder', 'Collection description');
        li.appendChild(label);
        li.appendChild(input);
        inputList.appendChild(li);

        fieldset.appendChild(inputList);
        form.appendChild(fieldset);

        // collection content fieldset -----------------------------------------------
        fieldset = Utils.createElement('fieldset');
        legend   = Utils.createElement('legend');
        let ul   = Utils.createElement('ul');
        let a    = Utils.createElement('a', 'button', 'add-content');

        legend.innerHTML = 'Collection content';
        fieldset.appendChild(legend);

        li          = Utils.createElement('li');
        a.href      = '#';
        a.innerHTML = 'Add content';
        li.appendChild(a);
        ul.appendChild(li);
        fieldset.appendChild(ul);

        // add content list
        const contentListData = collectionData ? collectionData.content : null;
        fieldset.appendChild(this.contentList(contentListData));

        form.appendChild(fieldset);

        // add button list
        ul = Utils.createElement('ul', 'buttonList');

        li          = Utils.createElement('li');
        a           = Utils.createElement('a', ['button', 'save', 'big']);
        a.href      = '#';
        a.innerHTML = 'Save';
        li.appendChild(a);
        ul.appendChild(li);

        li          = Utils.createElement('li');
        a           = Utils.createElement('a', ['button', 'cancel', 'big']);
        a.href      = '#';
        a.innerHTML = 'Cancel';
        li.appendChild(a);
        ul.appendChild(li);

        form.appendChild(ul);

        outputDiv.appendChild(form)

        return outputDiv;
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
     * Create a list of content
     *
     * @param {?Object} contentListData The content list
     * @returns {Element}
     * static contentList(contentList, id, forCollectionScreen = false)
     */
    static contentList(contentListData)
    {
        const table = Utils.createElement('table', ['adminTable', 'fullWidth']);
        const thead = Utils.createElement('thead');
        const tbody = Utils.createElement('tbody');

        let th    = Utils.createElement('th', 'tinyCell');
        let input = Utils.createElement('input');
        input.setAttribute('type', 'checkbox');
        th.appendChild(input);
        thead.appendChild(th);

        th           = Utils.createElement('th', 'textCell');
        th.innerHTML = 'Name';
        thead.appendChild(th);

        th           = Utils.createElement('th', 'textCell');
        th.innerHTML = 'User';
        thead.appendChild(th);

        table.appendChild(thead);

        if (!contentListData) {
            // create empty table and hide it
            table.classList.add('hidden');
            table.appendChild(tbody);

            return table;
        }

        // TODO create the content list when contentListData is not null
        table.appendChild(tbody);

        return table;
    }
    static contentListForCollection(contentListData)
    {
        // TODO refacto: 2 separate methods for content list in collection screen or
        // content screen
        return this.contentList(contentListData);
    }

    /**
     * Create a list of available content
     *
     * @param {Object} contentListData The list of content
     * @param {{itemsPerPage: int, numberOfPages: int, page: int, total: int}?} paginationState The current
     *      state of the pagination
     * @returns {Element}
     */
    static contentListForContent(contentListData, paginationState)
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


    /***************************************************************************
     * no refacto yet
     **************************************************************************/

    /**
     * Create a form to modify a content
     *
     * @param {object?} contentData The content data or null to create a new content
     *
     * @static
     * @returns {Element}
     */
    static contentForm(contentData) {
        const div  = Utils.createElement('div', null, 'contentForm');
        const form = Utils.createElement('form');

        if (contentData) {
            form.dataset.contentId = contentData.id;
        }

        let fieldset = Utils.createElement('fieldset');
        let h3       = Utils.createElement('h3');

        h3.innerHTML = 'Informations';
        fieldset.appendChild(h3);

        let ul = Utils.createElement('ul');

        let li    = Utils.createElement('li');
        let input = Utils.createElement('input');
        let label = Utils.createElement('label');

        label.setAttribute('for', 'name');
        label.innerHTML = 'Name';
        input.setAttribute('type', 'text');
        input.setAttribute('name', 'name');
        input.value = contentData ? contentData.name : '';
        // validation
        input.dataset.required = true;
        input.dataset.type     = 'text';
        input.dataset.name     = 'Name';

        li.appendChild(label);
        li.appendChild(input);
        ul.appendChild(li);

        li    = Utils.createElement('li');
        input = Utils.createElement('input');
        label = Utils.createElement('label');

        label.setAttribute('for', 'type');
        label.innerHTML = 'Type';
        input.setAttribute('type', 'text');
        input.setAttribute('name', 'type');
        input.value = contentData ? contentData.type : '';
        // validation
        input.dataset.required = true;
        input.dataset.type     = 'text';
        input.dataset.name     = 'Type';

        li.appendChild(label);
        li.appendChild(input);
        ul.appendChild(li);

        fieldset.appendChild(ul);

        form.appendChild(fieldset);

        fieldset = Utils.createElement('fieldset');
        h3       = Utils.createElement('h3');

        h3.innerHTML = 'Content';
        fieldset.appendChild(h3);

        ul = Utils.createElement('ul', null, 'innerContentList');

        if (contentData) {
            for (let property in contentData.content) {
                let li    = Utils.createElement('li');
                let label = Utils.createElement('label');
                let input = Utils.createElement('input');

                label.innerHTML = property;
                label.setAttribute('for', `content_${property}`);

                input.setAttribute('type', 'text');
                input.setAttribute('name', `content_${property}`);
                input.value = contentData.content[property];

                // validation
                input.dataset.type = 'text';
                input.dataset.name = Utils.capitalizeFirst(property);

                li.appendChild(label);
                li.appendChild(input);

                ul.appendChild(li);
            }
        }

        fieldset.appendChild(ul);
        form.appendChild(fieldset);

        let button = Utils.createElement('button', null, 'submitContentFormButton');
        ul         = Utils.createElement('ul');
        li         = Utils.createElement('li');

        button.innerHTML         = 'Save';
        button.dataset.contentId = contentData ? contentData.id : '';

        li.appendChild(button);
        ul.appendChild(li);

        button = Utils.createElement('button', 'cancelButton', 'cancelContentFormButton');
        li     = Utils.createElement('li');

        button.innerHTML        = 'Cancel';
        button.dataset.parentId = 'contentForm';

        li.appendChild(button);
        ul.appendChild(li);

        form.appendChild(ul);
        div.appendChild(form);

        return div;
    }


    /**
     * Create form to ask which type of content must be added
     *
     * @param {integer} collectionId The id of the collection for which we want to add a content
     * @returns {Element}
     */
    static askNewContentForm(collectionId)
    {
        const addContentDiv = Utils.createElement('div', null, 'askNewContentType');
        const ul = Utils.createElement('ul');

        // set data-group: used to easily remove groups of divs
        addContentDiv.dataset.group = 'addContentToCollection';

        let li           = Utils.createElement('li');
        let a            = Utils.createElement('a', 'button', 'createContent');
        a.text           = 'Create new Content';
        a.href           = "#";
        a.dataset.collectionId = collectionId;
        li.appendChild(a);
        ul.appendChild(li);

        li               = Utils.createElement('li');
        a                = Utils.createElement('a', 'button', 'useContent');
        a.text           = 'Use existing Content';
        a.href           = "#";
        a.dataset.collectionId = collectionId;
        li.appendChild(a);
        ul.appendChild(li);

        addContentDiv.appendChild(ul);

        return addContentDiv;
    }

    /**
     * Create a div to display a content
     *
     * @param {Object} content The content to be displayed
     * @returns {Element}
     */
    static content(content)
    {
        const div = Utils.createElement('div', 'contentDisplay', 'contentDisplay');

        let ul      = Utils.createElement('ul', null, 'contentInformations');
        let li      = Utils.createElement('li');
        let title   = Utils.createElement('h4');
        let article = Utils.createElement('article', 'content');

        div.dataset.contentId = content.id;
        div.dataset.group     = 'addContentToCollection';

        title.innerHTML = 'Informations';
        article.appendChild(title);

        li.innerHTML = `Name: ${content.name}`;
        ul.appendChild(li);

        li           = Utils.createElement('li');
        li.innerHTML = `Type: ${content.type}`;
        ul.appendChild(li);

        li           = Utils.createElement('li');
        li.innerHTML = `Creation date: ${Utils.formatDate(content.created_at)}`;
        ul.appendChild(li);

        if (content.updated_at) {
            li           = Utils.createElement('li');
            li.innerHTML = `Last updated: ${Utils.formatDate(content.updated_at)}`;
            ul.appendChild(li);

        }

        // set content informations in the list dataset for easy retrieval
        ul.dataset.contentId   = content.id;
        ul.dataset.contentName = content.name;
        ul.dataset.contentType = content.type;
        ul.dataset.createdAt   = content.created_at;
        ul.dataset.updatedAt   = content.updated_at ? content.updated_at : '';

        article.appendChild(ul);
        div.appendChild(article);

        // render the content
        article = Utils.createElement('article', 'content');
        title   = Utils.createElement('h4');
        ul      = Utils.createElement('ul');

        title.innerHTML = 'Content';
        article.appendChild(title);

        for (const key in content.content) {
            li           = Utils.createElement('li');
            li.innerHTML = `${Utils.capitalizeFirst(key)}: ${content.content[key]}`;

            ul.appendChild(li);
        }
        article.appendChild(ul);

        div.appendChild(article);

        return div;
    }

    /**
     * Create a form to create a new content
     *
     * @static
     * @returns {Element}
     */
    static newContentForm()
    {
        const form             = this.contentForm(null);
        const innerContentList = form.querySelector('#innerContentList');

        // count the number of inner contents
        innerContentList.dataset.innerContentCount = 0;

        const li         = Utils.createElement('li');
        const button     = Utils.createElement('a', 'button', 'addInnerContent');
        button.innerHTML = 'Add Content';
        button.href      = '#';

        li.appendChild(button);
        innerContentList.appendChild(li);

        // ---------------------------------------------------------------------
        // Tests !!
        // ---------------------------------------------------------------------
        form.querySelector('[name="name"]').value = 'Test content name';
        form.querySelector('[name="type"]').value = 'Test content type';
        // ---------------------------------------------------------------------

        return form;
    }

    /**
     * Create a form to add an inner content
     *
     * @param {number} count The current number of inner contents added
     * @returns {Element}
     * @static
     */
    static newInnerContentForm(count)
    {
        const name    = Utils.createElement('input');
        const content = Utils.createElement('input');

        let li = Utils.createElement('li');
        // li.dataset.innerContentNumber = count;

        let label = Utils.createElement('label');
        name.setAttribute('type', 'text');
        name.setAttribute('name', `contentName_${count}`);
        name.value = `test_inner_content_name_${count}`;
        label.setAttribute('for', `contentName_${count}`);
        label.innerHTML = 'Name';
        // validation
        name.dataset.required = true;
        name.dataset.type     = 'text';
        name.dataset.name     = Utils.capitalizeFirst(`contentContent_${count}`);

        li.appendChild(label);
        li.appendChild(name);

        label = Utils.createElement('label');
        content.setAttribute('type', 'text');
        content.setAttribute('name', `contentContent_${count}`);
        content.value = `test inner content content ${count}`;
        label.setAttribute('for', `contentContent_${count}`);
        label.innerHTML = 'Content';
        li.appendChild(label);
        li.appendChild(content);

        return li;
    }
}
