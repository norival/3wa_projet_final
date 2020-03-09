/**
 * The model component for the admin MVC app
 */
export class AdminModel {
    /**
     * Create the AdminModel
     */
    constructor()
    {
    }

    /**
     * Fetch help data for a given name
     *
     * @param {string} locale The locale of the documentation to retrieve
     * @param {string} name The name of the documentation to retrieve
     */
    getHelpData(locale, name)
    {
        fetch(`doc/${locale}/${name}`)
            .then(response => response.json())
            .then(helpData => {
                this.onHelpDataReceived(helpData);
            })
    }

    /**
     * Fetch the list of available views
     *
     * @param {{page: int, itemsPerPage: integer}} pagination Pagination state
     */
    listViews(pagination)
    {
        // build request URL
        const url = '/view/list?' + new URLSearchParams(pagination);

        // fetch data from website and store the promise in this.views
        fetch(url)
            .then(response => response.json())
            .then(paginator => {
                // tell the controller to refresh the view
                this.onViewsListDataReceived(paginator.results, paginator.state);
            });
    }

    async getViewForm(viewId)
    {
        await fetch('/admin/view/form/' + viewId)
            .then(response => response.json())
            .then(json => JSON.parse(json))
            .then(viewData => {
                this.onViewDataChanged(viewData);
            });

        return this;
    }

    /**
     * Submit the form to update a view
     *
     * @param {number} viewId The id of the view for which the form is submitted
     * @param {object} formData The formated form data
     */
    submitViewForm(viewId, formData)
    {
        fetch('admin/view/' + viewId, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(json => {
                // TODO If the server returns an error, display the form and the validation errors
                // TODO If the server says OK, display confirmation message and clear the page
                // TODO Clear the form
                console.log(json)
                // this.form.remove();
            })
    }

    /**
     * Add a content to a view
     *
     * @param {number} viewId The id of the view for which the form is submitted
     * @param {object} formData The formated form data
     * @param {number} contentId The id of the content that is added
     */
    addContentToView(viewId, formData, contentId)
    {
        formData.viewContents.push({
            view:    viewId,
            content: contentId
        });

        fetch('admin/view/' + viewId, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(json => {
                // TODO If the server returns an error, display the form and the validation errors
                // TODO If the server says OK, display confirmation message and clear the page
                // TODO Clear the form
                console.log(json)
                console.log('data sent')
                this.onViewDataChanged(JSON.parse(json));
                // this.form.remove();
            })
    }

    async listContent()
    {
        await fetch('admin/content')
            .then(response => response.json())
            .then(json => JSON.parse(json))
            .then(contentList => {
                this.onContentListChanged(contentList);
            })
    }

    async getContentForm(contentId)
    {
        await fetch('/admin/content/form/' + contentId)
            .then(response => response.json())
            .then(data => {
                this.onContentFormChanged(data);
            })
    }

    /**
     * Submit form to edit a content
     *
     * @param {number} contentId The id of the content to edit
     * @param {?Object} formData The data to send
     * @param {Boolean} visual Whether we are in visual mode or not
     */
    submitContentForm(contentId, formData, visual)
    {
        fetch(contentId === null ? 'admin/content' : `admin/content/${contentId}`, {
                method: contentId === null ? 'POST': 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(json => {
                // TODO If the server returns an error, display the form and the validation errors
                // TODO If the server says OK, display confirmation message and clear the page
                // TODO Clear the form
                const data = JSON.parse(json);
                console.log(data)
                if (visual) {
                    // call callback to refresh iframe
                    this.onVisualViewChanged();
                }
            })
    }

    /**
     * Submit form to create a new content and add it to a view if viewId and
     * viewData are supplied
     *
     * @param {Object} contentData Data for the new content
     * @param {?number} viewId Null to create a new content only or the id of
     * the view to which the new content must be added
     */
    submitNewContentForm(contentData, viewId = null)
    {
        fetch('admin/content', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(contentData)
            })
            .then(response => response.json())
            .then(json => {
                // TODO If the server returns an error, display the form and the validation errors
                // TODO If the server says OK, display confirmation message and clear the page
                // TODO Clear the form
                const contentId = JSON.parse(json);

                if (viewId) {
                    // if viewId was supplied, refresh the view screen
                    this.onContentCreatedForView(contentId);
                }
            })
    }

    /**
     * Fetch a content from database with its id
     *
     * @param {number} contentId The id of the content to fetch
     * @returns {Object} Content data
     * @async
     */
    async getContent(contentId)
    {
        return await fetch('/admin/content/' + contentId)
            .then(response => response.json())
            .then(json => {
                return JSON.parse(json);
                // this.onContentReceived(JSON.parse(json));
            })
    }

    /**
     * Search a content by name
     *
     * @param {string} searchTerm The string to look for in database
     */
    searchContent(searchTerm)
    {
        const url = '/content/search?' + encodeURI(`search=${searchTerm}`);
        // console.log(`I'm looking for: ${url}`);

        fetch(url, {
                method: 'GET',
            })
            .then(response => response.json())
            .then(json => {
                this.onContentSuggestionChanged(JSON.parse(json));
            })
    }

    /**
     * Delete a content from the database
     *
     * @param {number} contentId The id of the content to delete
     */
    deleteContent(contentId)
    {
        console.log('coucou');
        fetch('/admin/content/' + contentId, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(response => {
                console.log('coucou');
                console.log(response.status);
            })
    }

    /**
     * Bind the controller callback to use when the help data has been received
     *
     * @param {function} callback The callback to bind
     */
    bindHelpDataReceived(callback)
    {
        this.onHelpDataReceived = callback;
    }

    /**
     * Bind the controller callback to use when the list of view have been
     * loaded
     *
     * @param {function} callback The callback to bind
     */
    bindViewsListDataReceived(callback)
    {
        this.onViewsListDataReceived = callback;
    }

    bindViewDataChanged(callback)
    {
        this.onViewDataChanged = callback;
    }

    bindVisualViewChanged(callback)
    {
        this.onVisualViewChanged = callback;
    }

    bindContentListChanged(callback)
    {
        this.onContentListChanged = callback;
    }

    bindContentFormChanged(callback)
    {
        this.onContentFormChanged = callback;
    }

    /**
     * Bind the controller callback to use when the content suggestions have changed
     *
     * @param {function} callback The callback to bind
     */
    bindContentSuggestionChanged(callback)
    {
        this.onContentSuggestionChanged = callback;
    }

    /**
     * Bind the controller callback to use when the a content have been received
     *
     * @param {function} callback The callback to bind
     */
    bindContentReceived(callback)
    {
        this.onContentReceived = callback;
    }

    /**
     * Bind the controller callback to use when the a content have been created
     * for a view and the view must be updated
     *
     * @param {function} callback The callback to bind
     */
    bindContentCreatedForView(callback)
    {
        this.onContentCreatedForView = callback;
    }
}
