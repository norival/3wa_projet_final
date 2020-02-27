export class AdminModel {
    constructor()
    {
        this.viewList = null;
    }

    listViews()
    {
        // fetch data from website and store the promise in this.views
        this.views = fetch('admin/list-view')
            .then(response => response.json())
            .then(json => JSON.parse(json));

        // tell the controller to refresh the view
        this.onViewListChanged(this.viewList);

        return this;
    }

    bindViewListChanged(callback)
    {
        /*
         * Here we set the callback that must be called when this.views gets updated
         */
        this.onViewListChanged = callback;
    }
}
