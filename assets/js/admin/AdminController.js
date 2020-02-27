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
        this.model.bindViewDataChanged(this.onViewDataChanged);
    }

    handleListViews = async () => {
        await this.model.listViews();
        this.view.bindClickView(this.handleClickView);
    }

    handleClickView = async (viewId) => {
        await this.model.getViewForm(viewId);
        this.view.bindClickSubmitView(this.handleClickSubmitView);
    }

    handleClickSubmitView = (formData) => {
        this.model.submitViewForm(formData);
    }

    onViewListChanged = (promise) => {
        this.view.renderViewList(promise);
    }

    onViewDataChanged = (viewData) => {
        this.view.renderViewForm(viewData);
    }
}
