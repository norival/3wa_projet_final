export class AdminController {
    constructor(view, model)
    {
        // initialization
        this.view  = view;
        this.model = model;

        // bind event handlers for view events
        this.view.bindListViews(this.handleListViews);
        this.view.bindListContent(this.handleListContent);

        // bind event handlers for model events
        this.model.bindViewListChanged(this.onViewListChanged);
        this.model.bindViewDataChanged(this.onViewDataChanged);
        this.model.bindContentListChanged(this.onContentListChanged);
        this.model.bindContentDataChanged(this.onContentDataChanged);
    }

    handleListViews = async () => {
        await this.model.listViews();
        this.view.bindClickView(this.handleClickView);
    }

    handleClickView = async (viewId) => {
        await this.model.getViewForm(viewId);
        this.view.bindClickSubmitView(this.handleClickSubmitView);
    }

    handleClickSubmitView = (viewId, formData) => {
        this.model.submitViewForm(viewId, formData);
    }

    handleListContent = async () => {
        await this.model.listContent();
        this.view.bindClickContent(this.handleClickContent);
    }

    handleClickContent = (contentId) => {
        this.model.getContentForm(contentId);
        // TODO 
        // this.view.bindClickSubmitContent(this.handleClickSubmitContent)
    }

    onViewListChanged = (promise) => {
        this.view.renderViewList(promise);
    }

    onViewDataChanged = (viewData) => {
        this.view.renderViewForm(viewData);
    }

    onContentListChanged = (contentData) => {
        this.view.renderContentList(contentData);
    }

    onContentDataChanged = (contentData) => {
        this.view.renderContentForm(contentData);
    }
}
