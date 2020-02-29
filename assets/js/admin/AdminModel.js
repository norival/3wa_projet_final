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
                this.onContentDataChanged(data);
            })
    }

    submitContentForm(contentId, formData)
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
                console.log(json)
                console.log('data sent')
                // this.form.remove();
            })
    }

    getContent(contentId)
    {
        fetch('/admin/content/' + contentId)
            .then(response => response.json())
            .then(json => {
                this.onContentReceived(JSON.parse(json));
            })
    }

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

    bindContentListChanged(callback)
    {
        this.onContentListChanged = callback;
    }

    bindContentFormChanged(callback)
    {
        this.onContentFormChanged = callback;
    }

    bindContentSuggestionChanged(callback)
    {
        this.onContentSuggestionChanged = callback;
    }

    bindContentReceived(callback)
    {
        this.onContentReceived = callback;
    }
}
