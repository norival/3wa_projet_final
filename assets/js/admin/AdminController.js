export class AdminController {
    constructor(view, model)
    {
        // initialization
        this.view  = view;
        this.model = model;

        // bind event handlers for view events
        this.view.bindListViews(this.handleListViews);
        this.view.bindListContent(this.handleListContent);
        this.view.bindSearchContent(this.handleSearchContent);
        this.view.bindNeedContent(this.handleNeedContent);

        // bind event handlers for model events
        this.model.bindViewListChanged(this.onViewListChanged);
        this.model.bindViewDataChanged(this.onViewDataChanged);
        this.model.bindVisualViewChanged(this.onVisualViewChanged);
        this.model.bindContentListChanged(this.onContentListChanged);
        this.model.bindContentFormChanged(this.onContentFormChanged);
        this.model.bindContentSuggestionChanged(this.onContentSuggestionChanged);
        this.model.bindContentReceived(this.onContentReceived);
    }

    handleListViews = async () => {
        await this.model.listViews();
        this.view.bindClickView(this.handleClickView);
        this.view.bindClickViewVisual(this.handleClickViewVisual);
    }

    handleClickView = async (viewId) => {
        await this.model.getViewForm(viewId);
        this.view.bindClickSubmitView(this.handleClickSubmitView);
        this.view.bindClickContent(this.handleClickContent);
        // this.view.bindAddContent(this.handleAddContent);
    }

    handleClickViewVisual = (viewId) => {
        this.view.renderViewTemplate(viewId);
        this.view.bindClickContentVisual(this.handleClickContentVisual);
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
        this.view.bindClickSubmitContent(this.handleClickSubmitContent);
    }

    handleClickContentVisual = async (contentId) => {
        await this.model.getContentForm(contentId);
        this.view.bindClickSubmitContentVisual(this.handleClickSubmitContentVisual);
        // this.view.renderViewTemplate();
    }

    handleClickSubmitContent = (contentId, formData) => {
        this.model.submitContentForm(contentId, formData, false);
    }

    handleClickSubmitContentVisual = (contentId, formData) => {
        this.model.submitContentForm(contentId, formData, true);
    }

    handleAddContent = (contentData) => {
        this.model.submitContentForm(null, contentData);
    }

    handleSearchContent = (searchTerm) => {
        this.model.searchContent(searchTerm);
    }

    onViewListChanged = (promise) => {
        this.view.renderViewList(promise);
    }

    onViewDataChanged = (viewData) => {
        this.view.renderViewForm(viewData);
    }

    onVisualViewChanged = () => {
        this.handleClickViewVisual();
    }

    onContentListChanged = (contentData) => {
        this.view.renderContentList(contentData);
    }

    onContentFormChanged = (contentData) => {
        this.view.renderContentForm(contentData);
    }

    onContentSuggestionChanged = (suggestion) => {
        this.view.renderContentSuggestion(suggestion);
    }

    handleNeedContent = (contentId) => {
        // call this when the view need a content
        this.model.getContent(contentId);
    }

    onContentReceived = (content) => {
        this.view.renderContent(content);
    }
}
