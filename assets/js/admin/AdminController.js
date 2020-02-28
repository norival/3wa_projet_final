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
        this.view.bindClickContent(this.handleClickContent);
    }

    handleClickSubmitView = (viewId, formData) => {
        this.model.submitViewForm(viewId, formData);
    }

    handleListContent = async () => {
        await this.model.listContent();
        this.view.bindClickContent(this.handleClickContent);
    }

    handleClickContent = async (contentId) => {
        await this.model.getContentForm(contentId);
        this.view.bindClickSubmitContent(this.handleClickSubmitContent)
    }

    handleClickSubmitContent = (contentId, formData) => {
        this.model.submitContentForm(contentId, formData);
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
