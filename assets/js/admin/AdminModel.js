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
        console.log(`getting view form for view: ${viewId}`);
        await fetch('/admin/view/form/' + event.target.dataset.name)
            .then(response => response.json())
            .then(json => JSON.parse(json))
            .then(viewData => {
                this.onViewDataChanged(viewData);
            });

        return this;
    }

    submitViewForm(viewId, formData)
    {
        // TODO submit the form
        console.log(formData);

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
                console.log(json)
                console.log('data sent')
                // this.form.remove();
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
}
