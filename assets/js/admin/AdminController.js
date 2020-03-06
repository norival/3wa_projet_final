/*
 * DONE remove a content from 
 * DONE remove a content from a view
 * DONE JS form validation
 * DONE When adding content to a view, only update screen, do not submit the form
 * TODO manage form errors from php
 * TODO Assets view
 * TODO Users view
 * TODO Create a new view
 * TODO Add inner content in content modification form
 */

import {AdminModel} from './AdminModel';
import {AdminView} from './AdminView';
import {FormValidator} from '../form/FormValidator';

/**
 * The controller component for the admin MVC app
 */
export class AdminController {
    /**
     * Create an AdminController object
     */
    constructor()
    {
        // initialization
        this.view  = new AdminView();
        this.model = new AdminModel();

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
        this.model.bindContentCreatedForView(this.onContentCreatedForView);
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

    /**
     * Call this when a view form is submitted. Handles validation and submission
     *
     * @param {Element} form The form to validate
     */
    handleClickSubmitView = (form) => {
        const formValidator = new FormValidator(form);

        formValidator.validate();

        if (formValidator.isValid) {
            this.model.submitViewForm(
                form.dataset.viewId,
                this.view.getViewFormData(form.dataset.viewId)
            );

            return;
        }

        // send the errors back to the view
        this.view.renderFormErrors(form, formValidator.errors);
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
        this.view.bindClickDeleteContent(this.handleClickDeleteContent);
    }

    handleClickContent = async (contentId) => {
        await this.model.getContentForm(contentId);
        this.view.bindClickSubmitContent(this.handleClickSubmitContent);
    }

    /**
     * Handle click on deleteContentButton
     * @callback AdminController~handleClickDeleteContent
     */
    handleClickDeleteContent = (contentId) => {
        console.log(`deleting content: ${event.target.dataset.contentId}`);
        this.model.deleteContent(contentId);
    }

    /**
     * Handle click on newContentButton
     * @callback AdminController~handleClickNewContent
     */
    handleClickNewContent = () => {
        this.view.renderNewContentForm(null);
        this.view.bindClickAddInnerContent(this.handleClickAddInnerContent);
        this.view.bindClickSubmitNewContent(this.handleClickSubmitNewContent);
    }

    /**
     * Handle click on addInnerContent
     * @callback AdminController~handleClickNewContent
     */
    handleClickAddInnerContent = () => {
        this.view.renderAddInnerContentForm();
    }

    /**
     * Handle the submission of an existing content
     *
     * @param {Element} form The form to validate
     * @callback AdminController~handleClickSubmitContent
     */
    handleClickSubmitContent = (form) => {
        const formValidator = new FormValidator(form);

        formValidator.validate();

        if (formValidator.isValid) {
            this.model.submitContentForm(
                form.dataset.contentId,
                this.view.getContentFormData()
            );

            return;
        }

        // send the errors back to the view
        this.view.renderFormErrors(form, formValidator.errors);
    }

    /**
     * Handle the submission of a new content
     *
     * @param {Element} form The form to validate
     * @param {?number} viewId Null to create a new content only or the id of
     * the view to which the new content must be added
     * @callback AdminController~handleClickSubmitNewContent
     */
    handleClickSubmitNewContent = (form, viewId = null) => {
        const formValidator = new FormValidator(form);

        formValidator.validate();

        if (formValidator.isValid) {
            // submit the content
            this.model.submitNewContentForm(
                this.view.getNewContentFormData(),
                viewId
            );

            return;
        }

        // send the errors back to the view
        this.view.renderFormErrors(form, formValidator.errors);
        // this.model.submitNewContentForm(contentData, viewId, viewData);
        // const formValidator = new FormValidator();
    }

    handleClickContentVisual = async (contentId) => {
        await this.model.getContentForm(contentId);
        this.view.bindClickSubmitContentVisual(this.handleClickSubmitContentVisual);
        // this.view.renderViewTemplate();
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
        this.view.bindClickRemoveContentFromView(this.handleClickRemoveContentFromView);
    }

    /**
     * Call this when we want to add a content to a view
     *
     * @callback AdminController~handleClickAddContent
     */
    handleClickAddContent = (viewId) => {
        this.view.renderAskNewContentForm(viewId);
        this.view.bindClickAddContentNew(this.handleClickAddContentNew);
        this.view.bindClickAddContentUse(this.handleClickAddContentUse);
    }

    /**
     * Call this method from the view when the user wants to remove a content
     * from the view
     *
     * @param {number} contentId The id of the content that must be removed
     * @callback AdminController~handleClickRemoveContentFromView
     */
    handleClickRemoveContentFromView = (contentId) => {
        this.view.removeContentFromView(contentId);
    }

    /**
     * Call this method from the view when the user wants to create a new
     * content from the view screen
     *
     * @param {number} viewId The id of the view to which the new content will
     * be added
     * @callback AdminController~handleClickAddContentNew
     */
    handleClickAddContentNew = (viewId) => {
        this.view.renderNewContentForm(viewId);
        this.view.bindClickAddInnerContent(this.handleClickAddInnerContent);
        this.view.bindClickSubmitNewContent(this.handleClickSubmitNewContent);
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
        const contentData = await this.model.getContent(contentId);
        this.view.renderContent(contentData);
        this.view.bindClickUseThisContent(this.handleClickUseThisContent);
    }

    /**
     * Handle adding an existing content to a view
     *
     * @param {Object} contentData Data for the content to add to the view
     * @callback AdminController~handleClickUseThisContent
     */
    handleClickUseThisContent = (contentData) => {
        this.view.addContentToView(contentData);
        this.view.clearGroup('addContentToView');
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

    /**
     * Called from the model when a content has been created from the view
     * screen
     *
     * @param {number} contentId The id of the content that is added
     * @callback AdminController~onContentReceived
     */
    onContentCreatedForView = async (contentId) => {
        // get the content from the model
        const contentData = await this.model.getContent(contentId);
        // send it to the view
        this.view.addContentToView(contentData);
        this.view.clearGroup('addContentToView');
    }
}
