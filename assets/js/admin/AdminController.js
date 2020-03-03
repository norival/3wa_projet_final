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

    /**
     * Call this when the user clicks on the content link in the menu
     * 
     * @callback AdminController~handleListContent
     * @async
     */
    handleListContent = async () => {
        await this.model.listContent();
        this.view.bindClickContent(this.handleClickContent);
        this.view.bindClickNewContent(this.handleClickNewContent);
    }

    handleClickContent = async (contentId) => {
        await this.model.getContentForm(contentId);
        this.view.bindClickSubmitContent(this.handleClickSubmitContent);
    }

    /**
     * Handle click on newContentButton
     */
    handleClickNewContent = () => {
        this.view.renderNewContentForm(null);
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

//     handleSearchContent = (searchTerm) => {
//         this.model.searchContent(searchTerm);
//     }

    onViewListChanged = (promise) => {
        this.view.renderViewList(promise);
    }

    /**
     * Call this method from the model when the view data has been loaded. It
     * will render the view form and attach event listeners to it
     * 
     * @callback AdminController~onViewDataChanged
     */
    onViewDataChanged = (viewData) => {
        this.view.renderViewForm(viewData);
        this.view.bindClickAddContent(this.handleClickAddContent);
    }

    handleClickAddContent = (viewId) => {
        this.view.renderAskNewContentForm(viewId);
        this.view.bindClickAddContentNew(this.handleClickAddContentNew);
        this.view.bindClickAddContentUse(this.handleClickAddContentUse);
    }

    handleClickAddContentNew = (viewId) => {
        // TODO handle creation of a new content
        console.log(`creating new content for view ${viewId}`);
        this.view.renderNewContentForm(viewId);
        // TODO add event listners on new content form
    }

    /**
     * Call this method from the view when the user wants to add an existing
     * content to the view
     *
     * @param {number} viewId The id of the view
     * @callback AdminController~handleClickAddContentUse
     */
    handleClickAddContentUse = (viewId) => {
        // render form and call model.searchContent() to render the list of
        // suggestions
        this.view.renderUseContentForm(viewId);
        this.model.searchContent('');

        this.view.bindKeyUpSearchContent(this.handleKeyUpSearchContent);
        this.view.bindClickContentSuggestion(this.handleClickContentSuggestion);
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

    /**
     * Call this method from the model when the content suggestions have
     * changed (when looking for content)
     *
     * @param {Object} suggestion An object containing the suggestions
     * @callback AdminController~onContentSuggestionChanged
     */
    onContentSuggestionChanged = (suggestion) => {
        this.view.renderContentSuggestion(suggestion);
    }

    /**
     * Handle a keyup on content search input: it calls the model's method to
     * search for content in the database
     *
     * @param {string} searchTerm The string to look for in database
     * @callback AdminController~handleKeyUpSearchContent
     */
    handleKeyUpSearchContent = (searchTerm) => {
        this.model.searchContent(searchTerm);
    }

    /**
     * Handle a click on a content suggestion
     *
     * @param {number} contentId The id of the content that has been clicked
     * @param {number} viewId The id of the view for which we want to add a content
     * @callback AdminController~handleClickContentSuggestion
     */
    handleClickContentSuggestion = async (contentId) => {
        await this.model.getContent(contentId);
        this.view.bindClickUseThisContent(this.handleClickUseThisContent);
    }

    /**
     * Handle adding an existing content to a view
     *
     * @param {number} contentId The id of the content that has been clicked
     * @param {object} formData The formated form data
     * @callback AdminController~handleClickUseThisContent
     */
    handleClickUseThisContent = (viewId, formData, contentId) => {
        this.model.addContentToView(viewId, formData, contentId);
        // TODO refresh view
    }

    handleNeedContent = (contentId) => {
        // call this when the view need a content
        this.model.getContent(contentId);
    }

    /**
     * Called from the model when a content has been received
     *
     * @param {Object} content An object representation of the content
     * @callback AdminController~onContentReceived
     */
    onContentReceived = (content) => {
        this.view.renderContent(content);
    }
}
