import {Utils} from '../utils/Utils';
import {Components} from './Components';

export class AdminView {
    constructor()
    {
        this.output   = Utils.getElement('#admin-main');
        this.menu     = Utils.getElement('#admin-menu');
        this.adminBar = {
            logo:            Utils.getElement('#siteLogo'),
            name:            Utils.getElement('#siteName'),
            notificationBar: Utils.getElement('#notificationBar'),
            userName:        Utils.getElement('#userName'),
            userSettings:    Utils.getElement('#userSettings')
        };
        this.help = Utils.getElement('#help-panel');

        this.currentScreen = '';

        // array to store flash messages
        this.flashBag    = [];
        this.flashOutput = Utils.getElement('#flash-bag');

        // add event listener for navigation menu
        this.menu.addEventListener('click', (event) => {
            switch (event.target.dataset.action) {
                case 'homepage':
                    this.onClickHomePage();
                    break;
                case 'collections-home':
                    this.onClickCollectionsHome({
                        page: 1,
                        itemsPerPage: 5
                    });
                    break;
                case 'content-home':
                    this.onClickContentHome({
                        page: 1,
                        itemsPerPage: 5
                    });
                    break;
                case 'assets-home':
                    this.onClickAssetsHome();
                    break;
                case 'users-home':
                    this.onClickUsersHome();
                    break;
                case 'stats-home':
                    this.onClickStatsHome();
                    break;
            }
        });
    }

    /***************************************************************************
     * Helper methods
     **************************************************************************/

    /**
     * Method to handle flash messages
     */
    handleFlashBag()
    {
        if (this.flashBag.length > 0) {
            this.flashOutput.classList.remove('hidden');
            this.flashOutput.innerHTML = this.flashBag.pop();

            setTimeout(() => {
                this.flashOutput.classList.add('hidden');
            }, 3000)
        }
    }

    /**
     * Get and format Collection form data
     *
     * @param {Element} form The form element to get data from
     * @return {Object} The formatted data
     */
    getCollectionFormData(form)
    {
        const data     = {};
        const formData = new FormData(form);

        // get data from the form
        formData.forEach((element, key) => {
            data[key] = element;
        });

        return data;
    }

    getNewContentFormData()
    {
        const formData = new FormData(document.querySelector('#contentForm form'));
        const data     = {};
        
        data.name = formData.get('name');
        data.type = formData.get('type');

        data['content'] = {};

        let i = 1;
        let innerContentName = formData.get(`contentName_${i}`);

        while (innerContentName) {
            // loop over inner contents
            data['content'][innerContentName] = formData.get(`contentContent_${i}`);

            innerContentName = formData.get(`contentName_${++i}`);
        }

        return data;
    }

    /**
     * Get and format Content form data
     *
     * @param {Element} form The form element to get data from
     * @return {Object} The formatted data
     */
    getContentFormData(form)
    {
        const data     = {};
        const formData = new FormData(form);
        const table    = form.querySelector('tbody');

        data.content = {};
        formData.forEach((element, key) => {
            if (key.match(/^innerContent_/g)) {
                return;
            }

            data[key] = element;
        });

        // fill content
        table.rows.forEach((row) => {
            const name = row.cells[1].querySelector('input').value;

            if (name.trim() === '') {
                // do not add if empty string given
                return;
            }

            data.content[name] = row.cells[2].querySelector('textarea').value;
        });

        return data;
    }

    /**
     * Helper to get content data from content display
     *
     * @param {Element} contentInformations The element from which to retrieve content data
     * @returns {Object} Object representation of the content data
     */
    getContentDataFromContentDisplay(contentInformations)
    {
        return {
            id:         contentInformations.dataset.contentId,
            name:       contentInformations.dataset.contentName,
            type:       contentInformations.dataset.contentType,
            created_at: contentInformations.dataset.createdAt,
            updated_at: contentInformations.dataset.updatedAt
        };
    }

    /**
     * Clear a group of elements
     *
     * @param {string} group The name of the group to clear
     */
    clearGroup(group)
    {
        document.querySelectorAll(`[data-group="${group}"]`).forEach((element) => {
            element.remove();
        });
    }

    /**
     * Add the currentMenuEntry class on the current entry and remove it from
     * the previous current entry
     *
     * @param {string} id The id of the current menu entry
     */
    toggleCurrentMenuEntry(id)
    {
        this.menu.querySelector('.currentMenuEntry').classList.remove('currentMenuEntry');
        this.menu.querySelector(`#${id}`).classList.add('currentMenuEntry');
    }

    /**
     * Toggle display of help section
     *
     * @param {string} section The name of the help section to display
     */
    toggleHelpSection(section)
    {
        const currentSection = this.help.querySelector(`[data-help-section="${section}"]`);
        const currentContent = this.help.querySelector(`[data-for="${section}"]`);

        this.help.querySelectorAll('.current').forEach((el) => {
            el.classList.remove('current');
        });

        currentSection.classList.add('current');
        currentContent.classList.add('current');
    }

    /**
     * Toggle display of help panel
     */
    toggleHelp()
    {
        this.help.classList.toggle('hidden');
    }

    /**
     * Check the checkbox present on the clicked line
     * @param {Element} element The the element that is clicked
     */
    checkLine(element)
    {
        const checkbox = element.closest('tr').querySelector('[type="checkbox"]');
        const checkAll = document.getElementById('check-all');

        if (checkAll.checked) {
            // uncheck 'check-all' checkbox if it is checked
            checkAll.checked = false;
        }

        if (checkbox === element) {
            // return because the element will be already checked/unchecked
            return ;
        }

        // inverse checked state
        checkbox.checked = !checkbox.checked;
    }

    /**
     * Check all the checkboxes of the table
     * @param {Element} element The the element that is clicked
     * @param {boolean} checked The state of the clicked checkbox
     */
    checkAll(element, checked)
    {
        element.querySelectorAll('input[type="checkbox"]').forEach((element) => {
            element.checked = checked;
        });
    }

    /**
     * Get data from the selected rows
     * 
     * @returns {number[]} The ids of the selected contents
     */
    getCheckedRows(tableSelector)
    {
        const table      = document.querySelector(tableSelector);
        const contentIds = [];

        table.querySelectorAll('tbody [type="checkbox"]:checked').forEach((element) => {
            contentIds.push(element.dataset.contentId);
        });

        return contentIds;
    }


    /***************************************************************************
     * Methods to render collections
     **************************************************************************/

    /***************************************************************************
     * Render generic stuff
     */

    /**
     * Render form errors
     *
     * @param {Element} form The form that has errors
     * @param {Object} errors Errors to render
     */
    renderFormErrors(form, errors)
    {
        // remove previous errors (if any)
        const previousErrors = document.querySelectorAll('.formError');

        if (previousErrors) {
            previousErrors.forEach((element) => {
                element.remove();
            });
        }

        // display error messages
        for (let property in errors) {
            const span     = Utils.createElement('span', 'formError');
            span.innerHTML = errors[property];

            form.querySelector(`[data-field-name="${property}"]`).insertAdjacentElement('afterend', span);
        }
    }

    /**
     * Render help messages
     *
     * @param {Object} helpData The data to render
     */
    renderHelp(helpData)
    {
        const helpItems   = this.help.querySelector('#help-items');
        const helpContent = this.help.querySelector('#help-content');

        Utils.clear(helpItems);
        Utils.clear(helpContent);

        for (let property in helpData) {
            const li  = Utils.createElement('li');
            const a   = Utils.createElement('a', 'helpSection');
            const div = Utils.createElement('div');
            const p   = Utils.createElement('p');

            a.href                = '#';
            a.dataset.helpSection = property;
            a.innerHTML           = helpData[property].name;
            li.appendChild(a);
            helpItems.appendChild(li);

            p.innerHTML     = helpData[property].content;
            div.dataset.for = property;
            div.appendChild(p);
            helpContent.appendChild(div);
        }

        helpItems.querySelector('a:first-of-type').classList.add('current');
        helpContent.querySelector('div:first-of-type').classList.add('current');
    }


    /***************************************************************************
     * Render stuff for home page
     */

    /**
     * Render admin home page
     */
    renderHomePage()
    {
        // store the current screen id to check if it did not changed
        this.currentScreen = 'home';

        const dataset      = Utils.getElement('main').dataset;
        const informations = {
            siteName: dataset.siteName,
            userEmail: dataset.userEmail
        };

        Utils.clear(this.output);

        this.output.appendChild(Components.homePage(informations));
        this.toggleCurrentMenuEntry('home');
        document.title = 'Administration - Home';
    }


    /***************************************************************************
     * Render stuff for collection management
     */

    /**
     * Render home page layout for collections management
     */
    renderCollectionsHome()
    {
        this.handleFlashBag();

        // store the current screen id to check if it did not changed
        this.currentScreen = 'collection';

        Utils.clear(this.output);
        this.help.classList.add('hidden');

        this.output.appendChild(Components.collectionsHome());
        this.toggleCurrentMenuEntry('collections');
        document.title = 'Administration - Collections';

        // bind event listener for create collection button
        Utils.getElement('#new-collection').addEventListener('click', (event) => {
            event.preventDefault();

            this.onClickNewCollection();
        });

        // add event listener for search field
        Utils.getElement('#search-collection').addEventListener('keyup', (event) => {
            event.preventDefault();

            this.onKeyUpSearchCollection({
                name: event.target.value,
                itemsPerPage: Utils.getElement('#choose-items-per-page').value
            });
        });
    }

    /**
     * Render the list of collections
     *
     * @param {Object} collectionListData The list of collections
     * @param {{itemsPerPage: int, numberOfPages: int, page: int, total: int}} paginationState The current
     *      state of the pagination
     */
    renderCollectionsList(collectionListData, paginationState)
    {
        // check if screen has not been changed: if user click on other meny
        // entry before the async fetch has arrived, it is displayed on the
        // wrong screen
        if (this.currentScreen !== 'collection') {
            return ;
        }

        // remove old collection list if present
        const oldDiv = Utils.getElement('#collection-list-div');
        if (oldDiv) {
            oldDiv.remove();
        }

        this.output.appendChild(Components.collectionList(collectionListData, paginationState));

        // add event listeners -------------------------------------------------
        // event listener for clicks on collection-list
        Utils.getElement('#collections-list').addEventListener('click', (event) => {
            event.preventDefault();

            switch (event.target.dataset.action) {
                case 'show-collection':
                    this.onClickShowCollection(event.target.dataset.collectionId);
                    break;
                case 'edit-collection':
                    this.onClickEditCollection(event.target.dataset.collectionId);
                    break;
                case 'delete-collection':
                    this.onClickDeleteCollection(event.target.dataset.collectionId);
                    break;
            }
        });

        // event listener for pagination select
        Utils.getElement('#choose-items-per-page').addEventListener('change', (event) => {
            event.preventDefault();

            const searchTerm = Utils.getElement('#search-collection').value;

            // if a term is currently searched, use onKeyUpSearchCollection callback
            // instead
            if (searchTerm) {
                this.onKeyUpSearchCollection({
                    name: searchTerm,
                    itemsPerPage: event.target.value
                });

                return;
            }

            this.onChangeChooseItemsPerPage('collectionList', {
                page: 1,
                itemsPerPage: event.target.value
            });
        });


        // bind event listener for pagination pages
        document.querySelectorAll('.paginationPages').forEach((element) => {
            element.addEventListener('click', (event) => {
                event.preventDefault();

                if (!event.target.dataset.page) {
                    return;
                }

                this.onClickPaginationPage('collectionList', {
                    page: event.target.dataset.page,
                    itemsPerPage: Utils.getElement('#choose-items-per-page').value
                });
            });
        });
    }

    /**
     * Render the details of a collection
     *
     * @param {Object} collectionData The data for the given collection
     */
    renderCollectionDetails(collectionData)
    {
        if (!('user' in collectionData)) {
            // create empty collectionData object when creating a new
            // collection
            collectionData = {
                id: '',
                title: '',
                name: '',
                description: '',
                user: collectionData,
                collectionContents: []
            };
        }

        // check if screen has not been changed: if user click on other menu entry
        if (this.currentScreen !== 'collection') {
            return ;
        }

        Utils.clear(this.output);

        this.output.appendChild(Components.collectionDetails(collectionData));

        // add event listeners -------------------------------------------------
        Utils.getElement('#collection-info-actions').addEventListener('click', (event) => {
            switch (event.target.dataset.action) {
                case 'save':
                    this.onClickSaveCollectionDetails(Utils.getElement('#collection-form'));
                    break;
                case 'cancel':
                    this.onClickCancelCollectionDetails(event.target.dataset.collectionId);
                    break;
            }
        });

        if (!collectionData.id) {
            // if creating a new collection, do not bind event listeners
            // related to content
            return ;
        }

        document.querySelectorAll('.content-list-actions').forEach((element) => {
            element.addEventListener('click', (event) => {
                switch (event.target.dataset.action) {
                    case 'remove-content':
                        this.onClickRemoveContentFromCollection(
                            this.getCheckedRows('#content-list'),
                            event.currentTarget.dataset.collectionId
                        );
                        break;
                    case 'add-content':
                        this.onClickAddContentToCollection(
                            event.currentTarget.dataset.collectionId
                        );
                        break;
                }
            });
        });

        Utils.getElement('#content-list').addEventListener('click', (event) => {
            switch (event.target.dataset.action) {
                case 'check-all':
                    this.checkAll(event.target.closest('table'), event.target.checked);
                    break;
                case 'show-content':
                    this.onClickShowContent(event.target.dataset.contentId);
                    break;
                case 'edit-content':
                    this.onClickEditContent(event.target.dataset.contentId);
                    break;
                case 'delete-content':
                    this.onClickDeleteContent(event.target.dataset.contentId);
                    break;
                default:
                    if (event.target.closest('tr')) {
                        this.checkLine(event.target);
                    }
            }
        });
    }

    /**
     * Render a collection form and attach event listeners
     *
     * @param {?Object} collectionData The collection data for the form
     */
    renderCollectionForm(collectionData)
    {
        Utils.clear(this.output);

        if (collectionData) {
            // TODO form to update a collection
        }

        this.output.appendChild(Components.collectionForm(collectionData));
    }

    /**
     * Render the layout for the window to add a content to a view
     * 
     * @param {number} contentId The id of the collection
     */
    renderAddContentToCollection(collectionId)
    {
        // create modal window
        const modal = Components.addContentToCollection(collectionId);
        this.output.appendChild(modal);

        // add event listeners -------------------------------------------------
        // add event listener for search input
        modal.querySelector('#search-content').addEventListener('keyup', (event) => {
            event.preventDefault();

            this.onKeyUpSearchContent({
                name: event.target.value,
                itemsPerPage: modal.querySelector('#choose-items-per-page').value
            }, 'addToCollection');
        });

        // event listener for the 'add selected content' button
        modal.querySelector('#content-list-actions').addEventListener('click', (event) => {
            switch (event.target.dataset.action) {
                case 'add-content':
                    this.onClickAddSelectedContentToCollection(
                        this.getCheckedRows('.modalContent #content-list'),
                        event.currentTarget.dataset.collectionId
                    );
                    break;
            }
        });

        return;
    }

    /**
     * Render or refresh the content list in the window to add a content to the view
     * 
     * @param {number} contentId The id of the collection
     */
    renderContentListInAddToCollection(contentListData, paginationState)
    {
        const modalContent = Utils.getElement('.modalContent');
        const oldDiv       = modalContent.querySelector('#content-list-div');

        // remove previous content list if present
        if (oldDiv) {
            oldDiv.remove();
        }

        // append the new content list
        modalContent.appendChild(Components.contentListForContent(contentListData, paginationState));

        // add event listeners -------------------------------------------------
        // TODO see if possible to make a reusable function for these events
        // event listener for items per page selector
        modalContent
            .querySelector('#choose-items-per-page')
            .addEventListener( 'change', (event) => {
                // TODO refacto: this one should be quite easy to put into a reusable method

                // get the currently searched term
                const searchTerm = modalContent.querySelector('#search-content').value;

                // if a term is currently searched, use onKeyUpSearchContent
                // callback instead
                if (searchTerm) {
                    this.onKeyUpSearchContent(
                        {
                            name: searchTerm,
                            itemsPerPage: event.target.value
                        },
                        'addToCollection'
                    );

                    return;
                }

                // else use onChangeChooseItemsPerPage
                this.onChangeChooseItemsPerPage('addToCollection', {
                    page: 1,
                    itemsPerPage: event.target.value
                });
            });

        // event listener for pagination
        modalContent.querySelectorAll('.paginationPages').forEach((element) => {
            element.addEventListener('click', (event) => {
                event.preventDefault();

                if (!event.target.dataset.page) {
                    return;
                }

                this.onClickPaginationPage('addToCollection', {
                    page: event.target.dataset.page,
                    itemsPerPage: Utils.getElement('#choose-items-per-page').value
                });
            });
        });

        // event listener for checkboxes
        modalContent.querySelector('#content-list').addEventListener('click', (event) => {
            switch (event.target.dataset.action) {
                case 'check-all':
                    this.checkAll(event.target.closest('table'), event.target.checked);
                    break;
                default:
                    if (event.target.closest('tr')) {
                        this.checkLine(event.target);
                    }
            }
        });
    }


    /***************************************************************************
     * Render stuff for content management
     */

    /**
     * Render home page layout for content management
     */
    renderContentHome()
    {
        this.handleFlashBag();

        // store the current screen id to check if it did not changed
        this.currentScreen = 'content';

        // clear output
        Utils.clear(this.output);

        // hide help div if not already
        this.help.classList.add('hidden');
        // toggle style for menu entries
        this.toggleCurrentMenuEntry('content');

        this.output.appendChild(Components.contentHome());
        document.title = 'Administration - Content';

        // add event listeners -------------------------------------------------
        // bind event listener for create collection button
        Utils.getElement('#new-content').addEventListener('click', (event) => {
            event.preventDefault();

            this.onClickNewContent();
        });

        // add event listener for search field
        Utils.getElement('#search-content').addEventListener('keyup', (event) => {
            event.preventDefault();

            this.onKeyUpSearchContent({
                name: event.target.value,
                itemsPerPage: Utils.getElement('#choose-items-per-page').value
            }, 'contentHome');
        });
    }

    /**
     * Render the list of content
     * 
     * @param {Object} collectionListData The list of collections
     * @param {{itemsPerPage: int, numberOfPages: int, page: int, total: int}} paginationState The current
     *      state of the pagination
     */
    renderContentList(contentListData, paginationState)
    {
        // check if screen has not been changed: if user click on other meny
        // entry before the async fetch has arrived, it is displayed on the
        // wrong screen
        if (this.currentScreen !== 'content') {
            return ;
        }

        // remove old collection list if present
        const oldDiv = Utils.getElement('#content-list-div');
        if (oldDiv) {
            oldDiv.remove();
        }

        this.output.appendChild(Components.contentListForContent(contentListData, paginationState));

        // add event listeners -------------------------------------------------
        // event listener for clicks on collection-list
        Utils.getElement('#content-list').addEventListener('click', (event) => {
            event.preventDefault();

            switch (event.target.dataset.action) {
                case 'show-content':
                    this.onClickShowContent(event.target.dataset.contentId);
                    break;
                case 'edit-content':
                    this.onClickEditContent(event.target.dataset.contentId);
                    break;
                case 'delete-content':
                    this.onClickDeleteContent(event.target.dataset.contentId);
                    break;
            }
        });

        // event listener for pagination select
        Utils.getElement('#choose-items-per-page').addEventListener('change', (event) => {
            event.preventDefault();

            const searchTerm = Utils.getElement('#search-content').value;

            // if a term is currently searched, use onKeyUpSearchContent callback
            // instead
            if (searchTerm) {
                this.onKeyUpSearchContent({
                    name: searchTerm,
                    itemsPerPage: event.target.value
                });

                return;
            }

            this.onChangeChooseItemsPerPage('contentList', {
                page: 1,
                itemsPerPage: event.target.value
            });
        });

        // bind event listener for pagination pages
        document.querySelectorAll('.paginationPages').forEach((element) => {
            element.addEventListener('click', (event) => {
                event.preventDefault();

                if (!event.target.dataset.page) {
                    return;
                }

                this.onClickPaginationPage('contentList', {
                    page: event.target.dataset.page,
                    itemsPerPage: Utils.getElement('#choose-items-per-page').value
                });
            });
        });
    }

    /**
     * Render the details of a content
     *
     * @param {Object} contentData The data for the given collection
     */
    renderContentDetails(contentData)
    {
        if (!('user' in contentData)) {
            // create empty contentData object when creating a new content
            contentData = {
                id: '',
                name: '',
                type: '',
                user: contentData,
                content: {}
            };
        }

        // console.log(contentData);
        Utils.clear(this.output);
        this.output.appendChild(Components.contentDetails(contentData));

        // add event listeners -------------------------------------------------
        // click on the action buttons
        this.output.querySelector('#content-info-actions')
            .addEventListener('click', (event) => {
                switch (event.target.dataset.action) {
                    case 'save':
                        this.onClickSaveContentDetails(Utils.getElement('#content-form'));
                        break;
                    case 'cancel':
                        this.onClickCancelContentDetails(event.target.dataset.collectionId);
                        break;
                    case 'add-row':
                        this.onClickAddRowToContent();
                        break;
                }
            });

        // click on the delete row button
        this.output.querySelector('#inner-content-list').addEventListener('click', (event) => {
            if (event.target.dataset.action !== 'delete-row') {
                return ;
            }

            const tr = event.target.closest('tr');
            tr.remove();
        });
    }

    /**
     * Add a row to add inner content in content details form
     */
    renderAddRowToContent()
    {
        const tbody = this.output.querySelector('#inner-content-list tbody');

        tbody.appendChild(Components.innerContentRow());
    }


    /***************************************************************************
     * Render stuff for assets management
     */

    /**
     * Render home page for assets management
     */
    renderAssestsHome()
    {
        Utils.clear(this.output);
        this.help.classList.add('hidden');

        this.toggleCurrentMenuEntry('assets');
        this.output.appendChild(Components.notImplementedFeature());
    }


    /***************************************************************************
     * Render stuff for users management
     */

    /**
     * Render home page for users management
     */
    renderUsersHome()
    {
        Utils.clear(this.output);
        this.help.classList.add('hidden');

        this.toggleCurrentMenuEntry('users');
        this.output.appendChild(Components.notImplementedFeature());
    }


    /***************************************************************************
     * Render stuff for stats management
     */

    /**
     * Render home page for stats management
     */
    renderStatsHome()
    {
        Utils.clear(this.output);
        this.help.classList.add('hidden');

        this.toggleCurrentMenuEntry('stats');
        this.output.appendChild(Components.notImplementedFeature());
    }


    /***************************************************************************
     * Methods to bind event handler
     *
     * These methods are called by the controller to bind event handlers
     **************************************************************************/

    /***************************************************************************
     * Handlers for clicks on the menu
     */

    /**
     * Bind the controller callback to use when the user clicks on 'Home' menu
     * entry
     *
     * @param {function} handler The callback to bind
     */
    bindOnClickHomePage(handler)
    {
        this.onClickHomePage = handler;
    }

    /**
     * Bind the controller callback to use when the user clicks on 'Collections' menu
     * entry
     *
     * @param {function} handler The callback to bind
     */
    bindOnClickCollectionsHome(handler)
    {
        this.onClickCollectionsHome = handler;
    }

    /**
     * Bind the controller callback to use when the user clicks on 'Content' menu
     * entry
     *
     * @param {function} handler The callback to bind
     */
    bindOnClickContentHome(handler)
    {
        this.onClickContentHome = handler;
    }

    /**
     * Bind the controller callback to use when the user clicks on 'Assets' menu
     * entry
     *
     * @param {function} handler The callback to bind
     */
    bindOnClickAssetsHome(handler)
    {
        this.onClickAssetsHome = handler;
    }

    /**
     * Bind the controller callback to use when the user clicks on 'Users' menu
     * entry
     *
     * @param {function} handler The callback to bind
     */
    bindOnClickUsersHome(handler)
    {
        this.onClickUsersHome = handler;
    }

    /**
     * Bind the controller callback to use when the user clicks on 'Stats' menu
     * entry
     *
     * @param {function} handler The callback to bind
     */
    bindOnClickStatsHome(handler)
    {
        this.onClickStatsHome = handler;
    }


    /***************************************************************************
     * Handlers for clicks on the help collection
     */

    /**
     * Bind the controller callback to use when the user click on 'toggle-help'
     * button
     *
     * @param {function} handler The callback to bind
     */
    bindClickToggleHelp(handler)
    {
        Utils.getElement('#toggle-help').addEventListener('click', (event) => {
            event.preventDefault();

            handler();
        });
    }

    /**
     * Bind the controller callback to use when the user click on a given help
     * section
     *
     * @param {function} handler The callback to bind
     */
    bindClickHelpSection(handler)
    {
        Utils.getElement('#help-items').addEventListener('click', (event) => {
            event.preventDefault();

            handler(event.target.dataset.helpSection);
        });
    }


    /***************************************************************************
     * Handlers for clicks on the collection management screen
     */

    /**
     * Bind the controller callback to use when the user clicks on 'new-collection'
     * button
     *
     * @param {function} handler The callback to bind
     */
    bindOnClickNewCollection(handler)
    {
        this.onClickNewCollection = handler;
    }

    /**
     * Bind the controller callback to use when the user type a letter in the
     * collection search field
     *
     * @param {function} handler The callback to bind
     */
    bindOnKeyUpSearchCollection(handler)
    {
        this.onKeyUpSearchCollection = handler;
    }

    /**
     * Bind the controller callback to use when the user clicks on 'show-collection'
     * button
     *
     * @param {function} handler The callback to bind
     */
    bindOnClickShowCollection(handler)
    {
        this.onClickShowCollection = handler;
    }

    /**
     * Bind the controller callback to use when the user clicks on 'edit-collection'
     * button
     *
     * @param {function} handler The callback to bind
     */
    bindOnClickEditCollection(handler)
    {
        this.onClickEditCollection = handler;
    }

    /**
     * Bind the controller callback to use when the user clicks on 'edit-collection'
     * button
     *
     * @param {function} handler The callback to bind
     */
    bindOnClickDeleteCollection(handler)
    {
        this.onClickDeleteCollection = handler;
    }

    /**
     * Bind the controller callback to use when the user clicks on 'save' in
     * the collection details screen
     *
     * @param {function} handler The callback to bind
     */
    bindOnClickSaveCollectionDetails(handler)
    {
        this.onClickSaveCollectionDetails = handler;
    }

    /**
     * Bind the controller callback to use when the user clicks on 'cancel' in
     * the collection details screen
     *
     * @param {function} handler The callback to bind
     */
    bindOnClickCancelCollectionDetails(handler)
    {
        this.onClickCancelCollectionDetails = handler;
    }

    /**
     * Bind the controller callback to use when the user clicks on 'Remove
     * selected content' from the collection details screeen
     *
     * @param {function} handler The callback to bind
     */
    bindOnClickRemoveContentFromCollection(handler)
    {
        this.onClickRemoveContentFromCollection = handler;
    }

    /**
     * Bind the controller callback to use when the user clicks on 'Add
     * content' from the collection details screeen
     *
     * @param {function} handler The callback to bind
     */
    bindOnClickAddContentToCollection(handler)
    {
        this.onClickAddContentToCollection = handler;
    }

    /**
     * Bind the controller callback to call when we want to add selected
     * content to a collection
     *
     * @param {function} handler The callback to bind
     */
    bindOnClickAddSelectedContentToCollection(handler)
    {
        this.onClickAddSelectedContentToCollection = handler;
    }


    /***************************************************************************
     * Handlers related to content management
     */

    /**
     * Bind the controller callback to use when the user clicks on
     * 'new-content' button
     *
     * @param {function} handler The callback to bind
     */
    bindOnClickNewContent(handler)
    {
        this.onClickNewContent = handler;
    }

    /**
     * Bind the controller callback to use when the user type a letter in the
     * content search field
     *
     * @param {function} handler The callback to bind
     */
    bindOnKeyUpSearchContent(handler)
    {
        this.onKeyUpSearchContent = handler;
    }

    /**
     * Bind the controller callback to use when the user clicks on
     * 'show-content' button
     *
     * @param {function} handler The callback to bind
     */
    bindOnClickShowContent(handler)
    {
        this.onClickShowContent = handler;
    }

    /**
     * Bind the controller callback to use when the user clicks on
     * 'edit-content' button
     *
     * @param {function} handler The callback to bind
     */
    bindOnClickEditContent(handler)
    {
        this.onClickEditContent = handler;
    }

    /**
     * Bind the controller callback to use when the user clicks on
     * 'delete-content' button
     *
     * @param {function} handler The callback to bind
     */
    bindOnClickDeleteContent(handler)
    {
        this.onClickDeleteContent = handler;
    }

    /**
     * Bind the controller callback to use when the user clicks on 'save' in
     * the content details screen
     *
     * @param {function} handler The callback to bind
     */
    bindOnClickSaveContentDetails(handler)
    {
        this.onClickSaveContentDetails = handler;
    }

    /**
     * Bind the controller callback to use when the user clicks on 'cancel' in
     * the content details screen
     *
     * @param {function} handler The callback to bind
     */
    bindOnClickCancelContentDetails(handler)
    {
        this.onClickCancelContentDetails = handler;
    }

    /**
     * Bind the controller callback to use when the user clicks on 'add-row' in
     * the content details screen
     *
     * @param {function} handler The callback to bind
     */
    bindOnClickAddRowToContent(handler)
    {
        this.onClickAddRowToContent = handler;
    }


    /***************************************************************************
     * Handlers related to pagination
     */

    /**
     * Bind the controller callback to use when the 'itemsPerPage' select menu
     * has changed
     *
     * @param {function} handler The callback to bind
     */
    bindOnChangeChooseItemsPerPage(handler)
    {
        this.onChangeChooseItemsPerPage = handler;
    }

    /**
     * Bind the controller callback to use when a page link has been clicked
     *
     * @param {function} handler The callback to bind
     */
    bindOnClickPaginationPage(handler)
    {
        this.onClickPaginationPage = handler;
    }


    // -------------------------------------------------------------------------
    // not refactored yet ------------------------------------------------------
    // -------------------------------------------------------------------------

    /**
     * Render the template associated to collectionId within an iframe
     *
     * @param {number} collectionId The id of the collection. Set to null to only refresh an
     * existing iframe
     *
     * @return {undefined}
     */
    renderCollectionTemplate(collectionId)
    {
        if (!collectionId) {
            // called without collectionId when refreshing the iframe, so we get
            // collectionId from existing iframe
            collectionId = Utils.getElement('#visualCollection').dataset.collectionId;
            Utils.getElement('#visualCollectionContainer').remove();
        }

        const div    = Utils.createElement('div', null, 'visualCollectionContainer');
        const iframe = Utils.createElement('iframe', null, 'visualCollection');

        iframe.dataset.collectionId = collectionId;
        iframe.setAttribute('src', `admin/collection/visual/${collectionId}`);

        div.appendChild(iframe);
        this.output.appendChild(div);
    }

    /**
     * Render a form to create a new content
     * 
     * @param {number?} collectionId The id of the collection for which we want to add a
     * content or null if we do not want to add it to a collection
     */
    renderNewContentForm(collectionId)
    {
        let newContentForm = Utils.getElement('#newContentForm');

        if (newContentForm) {
            Utils.clear(newContentForm);
        } else {
            newContentForm = Utils.createElement('div', null, 'newContentForm');
        }

        newContentForm.appendChild(Components.newContentForm());
        newContentForm.dataset.group = 'addContentToCollection';

        this.output.appendChild(newContentForm);

        if (collectionId) {
            // Create a new content from the collection pane
            Utils.getElement('#submitContentFormButton').dataset.collectionId = collectionId;
        }

        // add event listener for cancel button
        this._bindClickCancelButtons();
    }

    /**
     * Render a div to display a single content
     * 
     * @param {Object} content An object representation of the content
     */
    renderContent(content)
    {
        const parent   = Utils.getElement('#collectionFormOutput');
        const button   = Utils.createElement('a', 'button', 'useThisContent');
        let contentDiv = Utils.getElement('#contentDisplay');

        // remove it if already created
        if (contentDiv) {
            contentDiv.remove();
        }

        contentDiv                  = Components.content(content);
        button.innerHTML            = 'Add to collection';
        button.href                 = '#'
        button.dataset.contentId    = content.id;
        button.dataset.collectionId = Utils.getElement('#contentSuggestion').dataset.collectionId;

        contentDiv.appendChild(button);
        parent.appendChild(contentDiv);
    }
}
