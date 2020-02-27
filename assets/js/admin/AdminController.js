export class AdminController {
    constructor(view, model)
    {
        // initialization
        this.view  = view;
        this.model = model;

        // bind event handlers for view events
        this.view.bindListViews(this.handleListViews);

        // bind event handlers for model events
        this.model.bindViewListChanged(this.onViewListChanged);
    }

    handleListViews = () => {
        this.model.listViews();
    }

    onViewListChanged = (data) => {
        this.view.renderViewList(data);
    }
}
