export class AdminModel {
    constructor()
    {
        this.viewList = null;
    }

    async listViews()
    {
        // fetch data from website and store the promise in this.views
        await fetch('admin/list-view')
            .then(response => response.json())
            .then(json => JSON.parse(json))
            .then(viewList => {
                // tell the controller to refresh the view
                this.onViewListChanged(viewList);
            });

        return this;
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
                console.log('data sent')
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

    submitContentForm(contentId, formData, visual)
    {
        // const url = contentId === null ? `admin/content/${contentId}` : 'admin/content';

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
     * Submit form to create a new content
     *
     */
    submitNewContentForm(contentData)
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
                const data = JSON.parse(json);
                console.log(data)
            })
    }

    /**
     * Fetch a content from database with its id
     *
     * @param {int} contentId The id id of the content to fetch
     * @async
     */
    async getContent(contentId)
    {
        await fetch('/admin/content/' + contentId)
            .then(response => response.json())
            .then(json => {
                this.onContentReceived(JSON.parse(json));
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

    bindViewListChanged(callback)
    {
        /*
         * Here we set the callback that must be called when this.views gets updated
         */
        this.onViewListChanged = callback;
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
}
