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


    /***************************************************************************
     * Methods to fetch data and post data
     *
     * This methods use the fetch API to fetch data from the database or to
     * post data
     **************************************************************************/

    /***************************************************************************
     * Methods related to help data
     */

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


    /***************************************************************************
     * Methods related to view data
     */

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

    /**
     * Search views from the database
     *
     * @param {Object} query The query to look for
     */
    searchView(query)
    {
        fetch('/view/search?' + new URLSearchParams(query))
            .then(response => response.json())
            .then(paginator => {
                this.onViewsListDataReceived(paginator.results, paginator.state);
            });
    }

    /**
     * Get view data from the database and call the given callback
     *
     * @param {int} viewId The id of the view to get
     * @param {function} callback The function to call when data has been
     * received
     */
    getViewData(viewId, callback)
    {
        fetch(`/view/${viewId}`)
            .then(response => response.json())
            .then(viewData => {
                callback(viewData);
            });
    }

    /**
     * Submit the form to update a view
     *
     * @param {number} viewId The id of the view for which the form is submitted
     * @param {object} formData The formated form data
     */
    submitViewForm(viewId, formData, callback)
    {
        fetch('admin/view/' + viewId, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            // .then(response => response.json())
            .then(response => {
                // TODO If the server returns an error, display the form and the validation errors
                // TODO If the server says OK, display confirmation message and clear the page
                // TODO Clear the form
                // console.log(response);
                callback(response);
                // this.form.remove();
            })
    }

    /**
     * Remove content from the view specified with viewId
     *
     * @param {number[]} contentIds The ids of the content to remove
     * @param {number} viewId The id of the view for which the form is submitted
     * @param {function} callback The function to call when response has been received
     */
    removeContentFromView(contentIds, viewId, callback)
    {
        fetch(`admin/view/${viewId}/content`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contentIds)
        })
            .then(() => {
                callback(viewId);
            })
    }


    /***************************************************************************
     * Methods related to content data
     */

    /**
     * Fetch the list of available views
     *
     * @param {{page: int, itemsPerPage: integer}} pagination Pagination state
     * @param {function} callback The function to call when response has been received
     */
    listContent(pagination, callback)
    {
        // build request URL
        const url = '/content/list?' + new URLSearchParams(pagination);

        // fetch data from website and store the promise in this.views
        fetch(url)
            .then(response => response.json())
            .then(paginator => {
                console.log(paginator);
                // tell the controller to refresh the view
                callback(paginator.results, paginator.state);
            });
    }

    /**
     * Search content from the database
     *
     * @param {Object} query The query to look for
     * @returns {undefined}
     */
    searchContent(query)
    {
        fetch('/content/search?' + new URLSearchParams(query))
            .then(response => response.json())
            .then(paginator => {
                this.onContentListDataReceived(paginator.results, paginator.state);
            });
    }


    /***************************************************************************
     * Methods to bind handlers
     *
     * These methods are called by the controller to bind callbaks used when
     * events happen (for example: when data have been received)
     **************************************************************************/

    /***************************************************************************
     * Handlers related to help data
     */

    /**
     * Bind the controller callback to use when the help data has been received
     *
     * @param {function} callback The callback to bind
     */
    bindHelpDataReceived(callback)
    {
        this.onHelpDataReceived = callback;
    }


    /***************************************************************************
     * Handlers related to view data
     */

    /**
     * Bind the controller callback to use when the list of view has been
     * loaded
     *
     * @param {function} callback The callback to bind
     */
    bindViewsListDataReceived(callback)
    {
        this.onViewsListDataReceived = callback;
    }


    /***************************************************************************
     * Handlers related to content data
     */

    /**
     * Bind the controller callback to use when the list of content has been
     * loaded
     *
     * @param {function} callback The callback to bind
     */
    bindContentListDataReceived(callback)
    {
        this.onContentListDataReceived = callback
    }


    // -------------------------------------------------------------------------
    // no refacto yet
    // -------------------------------------------------------------------------

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
