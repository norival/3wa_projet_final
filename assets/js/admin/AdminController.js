/*
 * DONE remove a content from 
 * DONE remove a content from a collection
 * DONE JS form validation
 * DONE When adding content to a collection, only update screen, do not submit the form
 * TODO manage form errors from php
 * TODO Assets view
 * TODO Users view
 * TODO Create a new collection
 * TODO Add inner content in content modification form
 *
 * NOTE For model methods that can be called to fill different part of the View
 * (for example teh content list can be rendered in the content screen or the
 * collection screen), I could set an argument 'callback', so it could use a
 * different callback each time
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
    }

    /**
     * Start the controller
     */
    start()
    {
        // bind event handlers for view events ---------------------------------
        // events for clicks on navigation menu
        this.view.bindOnClickHomePage(this.handleClickHomePage);
        this.view.bindOnClickCollectionsHome(this.handleClickCollectionsHome);
        this.view.bindOnClickContentHome(this.handleClickContentHome);
        this.view.bindOnClickAssetsHome(this.handleClickAssetsHome);
        this.view.bindOnClickUsersHome(this.handleClickUsersHome);
        this.view.bindOnClickStatsHome(this.handleClickStatsHome);

        // help related events
        this.view.bindClickToggleHelp(this.handleClickToggleHelp);
        this.view.bindClickHelpSection(this.handleClickHelpSection);

        // this.view.bindListContent(this.handleListContent);
        // this.view.bindSearchContent(this.handleSearchContent);
        // this.view.bindNeedContent(this.handleNeedContent);

        // pagination related events
        this.view.bindOnChangeChooseItemsPerPage(this.onChangeChooseItemsPerPage);
        this.view.bindOnClickPaginationPage(this.onClickPaginationPage);

        // collections related events
        this.view.bindOnClickNewCollection(this.onClickNewCollection);
        this.view.bindOnKeyUpSearchCollection(this.onKeyUpSearchCollection);
        this.view.bindOnClickShowCollection(this.onClickShowCollection);
        this.view.bindOnClickEditCollection(this.onClickEditCollection);
        this.view.bindOnClickDeleteCollection(this.onClickDeleteCollection);
        this.view.bindOnClickSaveCollectionDetails(this.onClickSaveCollectionDetails);
        this.view.bindOnClickCancelCollectionDetails(this.onClickCancelCollectionDetails);
        this.view.bindOnClickRemoveContentFromCollection(this.onClickRemoveContentFromCollection);
        this.view.bindOnClickAddContentToCollection(this.onClickAddContentToCollection);
        this.view.bindOnClickAddSelectedContentToCollection(this.onClickAddSelectedContentToCollection);

        // content related events
        this.view.bindOnClickNewContent(this.onClickNewContent);
        this.view.bindOnKeyUpSearchContent(this.onKeyUpSearchContent);
        this.view.bindOnClickShowContent(this.onClickShowContent);
        this.view.bindOnClickEditContent(this.onClickEditContent);
        this.view.bindOnClickDeleteContent(this.onClickDeleteContent);


        // bind callbacks for model events -------------------------------------
        // help related events
        this.model.bindHelpDataReceived(this.onHelpDataReceived);

        // collections related events
        this.model.bindCollectionsListDataReceived(this.onCollectionsListDataReceived);

        // content related events

        // this.model.bindCollectionDataChanged(this.onCollectionDataChanged);
        // this.model.bindVisualCollectionChanged(this.onVisualCollectionChanged);
        // this.model.bindContentListChanged(this.onContentListChanged);
        // this.model.bindContentFormChanged(this.onContentFormChanged);
        // this.model.bindContentSuggestionChanged(this.onContentSuggestionChanged);
        // this.model.bindContentReceived(this.onContentReceived);
        // this.model.bindContentCreatedForCollection(this.onContentCreatedForCollection);

        // render the home page
        // this.handleClickHomePage();
    }


    /***************************************************************************
     * Handlers for Collection events
    ***************************************************************************/

    // handlers for navigation menu --------------------------------------------

    /**
     * Handle click on the 'Home' menu entry
     *
     * @callback AdminController~handleClickHomePage
     */
    handleClickHomePage = () => {
        // - Get the notifications (not implemented yet (say 'No notification')
        // this.view.
        this.view.renderHomePage();
        this.model.getHelpData('en', 'general');
    }

    /**
     * Handle click on the 'Collections' menu entry
     *
     * @param {{page: int, itemsPerPage: integer}} pagination Pagination state
     * @callback AdminController~handleClickCollectionsHome
     */
    handleClickCollectionsHome = (pagination) => {
        this.view.renderCollectionsHome();
        this.model.listCollections(pagination, this.onCollectionsListDataReceived);
        this.model.getHelpData('en', 'collection');
    }

    /**
     * Handle click on the 'Content' menu entry
     * 
     * @param {{page: int, itemsPerPage: integer}} pagination Pagination state
     * @callback AdminController~handleClickContentHome
     * @async
     */
    handleClickContentHome = (pagination) => {
        this.view.renderContentHome();
        this.model.listContent(pagination, this.onContentListDataReceived);
        this.model.getHelpData('en', 'content');
    }

    /**
     * Handle click on the 'Assets' menu entry
     *
     * @callback AdminController~handleClickAssetsHome
     */
    handleClickAssetsHome = () => {
        this.view.renderAssestsHome();
    }

    /**
     * Handle click on the 'Users' menu entry
     *
     * @callback AdminController~handleClickUsersHome
     */
    handleClickUsersHome = () => {
        this.view.renderUsersHome();
    }

    /**
     * Handle click on the 'Stats' menu entry
     *
     * @callback AdminController~handleClickStatsHome
     */
    handleClickStatsHome = () => {
        this.view.renderStatsHome();
    }

    
    // handlers for help related events ----------------------------------------

    /**
     * Handle click on the 'toggle-help' button
     *
     * @callback AdminController~handleClickToggleHelp
     */
    handleClickToggleHelp = () => {
        this.view.toggleHelp();
    }

    /**
     * Handle click on a help section
     *
     * @param {string} section The name of the help section to display
     * @callback AdminController~handleClickHelpSection
     */
    handleClickHelpSection = (section) => {
        this.view.toggleHelpSection(section);
    }


    // handlers for pagination events ------------------------------------------

    /**
     * Handle change on the select menu to change number of items per page
     *
     * @param {string} screen The screen from which the call is coming
     * @param {{itemsPerPage: int, numberOfPages: int, page: int, total: int}} paginationState The current
     *      state of the pagination
     * @callback AdminController~handleClickHelpSection
     */
    onChangeChooseItemsPerPage = (screen, paginationState) => {
        switch (screen) {
            case 'collectionList':
                this.model.listCollections(paginationState, this.onCollectionsListDataReceived);
                break;
            case 'contentList':
                this.model.listContent(paginationState, this.onContentListDataReceived);
                break;
            case 'addToCollection':
                this.model.listContent(paginationState, this.onContentListDataReceivedForCollection);
                break;
        }
    }

    /**
     * Handle click on a page link
     *
     * @callback AdminController~handleClickHelpSection
     */
    onClickPaginationPage = (screen, paginationState) => {
        switch (screen) {
            case 'collectionList':
                this.model.listCollections(paginationState, this.onCollectionsListDataReceived);
                break;
            case 'contentList':
                this.model.listContent(paginationState, this.onContentListDataReceived);
                break;
            case 'addToCollection':
                this.model.listContent(paginationState, this.onContentListDataReceivedForCollection);
                break;
        }
    }


    // handlers for collections related events ---------------------------------------

    /**
     * Handle click on the 'new-collection' button
     */
    onClickNewCollection = () => {
        this.view.renderCollectionForm(null);
    }

    /**
     * Handle key press on search collection input
     *
     * @param {Object} query The query
     */
    onKeyUpSearchCollection = (query) => {
        this.model.searchCollection(query);
    }

    /**
     * Handle click on the 'show-collection' button
     *
     * @param {int} collectionId The id of the collection to edit
     */
    onClickShowCollection = (collectionId) => {
        this.model.getCollectionData(collectionId, this.onCollectionDataReceivedForCollectionScreen);
    }

    /**
     * Handle click on the 'edit-collection' button
     *
     * @param {int} collectionId The id of the collection to edit
     */
    onClickEditCollection = (collectionId) => {
        // TODO
        console.log(`Editing ${collectionId}`);
    }

    /**
     * Handle click on the 'delete-collection' button
     *
     * @param {int} collectionId The id of the collection to delete
     */
    onClickDeleteCollection = (collectionId) => {
        // TODO
        console.log(`Deleting ${collectionId}`);
    }

    /**
     * Handle click on the 'save' button in collection details
     *
     * @param {Element} form The form element to get data from
     */
    onClickSaveCollectionDetails = (form) => {
        // run form validation
        const formValidator = new FormValidator(form);
        formValidator.validate();

        if (formValidator.isValid) {
            // if the form is valid, submit the data to the server
            this.model.submitCollectionForm(
                form.dataset.collectionId,
                this.view.getCollectionFormData(form),
                this.onCollectionFormSubmitted
            );

            return ;
        }

        // render the form errors
        this.view.renderFormErrors(form, formValidator.errors);
    }

    /**
     * Handle click on the 'cancel' button in collection details
     */
    onClickCancelCollectionDetails = () => {
        this.handleClickCollectionsHome();
    }

    /**
     * Handle click on the 'Remove selected content' button in collection details
     *
     * @param {[int]} contentIds An array of content ids to remove from the collection
     * @param {int} collectionId The id of the collection from which contents should be removed
     */
    onClickRemoveContentFromCollection = (contentIds, collectionId) => {
        if (contentIds.length > 0) {
            // TODO ask confirmation before removing contents
            this.model.removeContentFromCollection(contentIds, collectionId, this.onClickShowCollection);
        }
    }

    /**
     * Handle click on the 'Add content' button in collection details
     *
     * @param {number} collectionId The id of the collection for which content is added
     */
    onClickAddContentToCollection = (collectionId) => {
        this.view.renderAddContentToCollection(collectionId);
        this.model.listContent(
            {page: 1, itemsPerPage: 5},
            this.onContentListDataReceivedForCollection
        );
    }

    /**
     * Handle click to add selected content to a given collection
     *
     * @param {number[]} contentIds The id(s) of the content(s) to add
     * @param {number} collectionId The id of the collection for which content is added
     */
    onClickAddSelectedContentToCollection = (contentIds, collectionId) => {
        // console.log(contentIds, collectionId);
        this.model.addContentToCollection(collectionId, contentIds, this.onClickShowCollection);
    }


    // handlers for content related events -------------------------------------

    /**
     * Handle click on the 'new-content' button
     */
    onClickNewContent = () => {
        console.log('creating new content');
        // TODO
        // this.view.renderContentForm(null);
    }

    /**
     * Handle key press on search content input
     *
     * @param {Object} query The query
     */
    onKeyUpSearchContent = (query, screen) => {
        switch (screen) {
            case 'contentHome':
                this.model.searchContent(query, this.onContentListDataReceived);
                break;
            case 'addToCollection':
                this.model.searchContent(query, this.onContentListDataReceivedForCollection);
        }
    }

    /**
     * Handle click on the 'show-content' button
     *
     * @param {int} contentId The id of the collection to edit
     */
    onClickShowContent = (contentId) => {
        console.log(`Showing ${contentId}`);
    }

    /**
     * Handle click on the 'edit-content' button
     *
     * @param {int} contentId The id of the collection to edit
     */
    onClickEditContent = (contentId) => {
        console.log(`Editing ${contentId}`);
    }

    /**
     * Handle click on the 'delete-content' button
     *
     * @param {int} contentId The id of the collection to delete
     */
    onClickDeleteContent = (contentId) => {
        console.log(`Deleting ${contentId}`);
    }


    /***************************************************************************
     * Callbacks for Model events
    ***************************************************************************/

    /***************************************************************************
     * Handlers related to help data
     */

    /**
     * Call this method from the model when the help data has been received
     * 
     * @callback AdminController~onHelpDataReceived
     */
    onHelpDataReceived = (helpData) => {
        this.view.renderHelp(helpData);
    }


    /***************************************************************************
     * Handlers related to collection data
     */

    /**
     * Call this method from the model when the list of collection has been loaded.
     * 
     * @param {Object} collectionListData The list of collection
     * @param {{itemsPerPage: int, numberOfPages: int, page: int, total: int}} paginationState The current
     *      state of the pagination
     * @callback AdminController~onCollectionDataChanged
     */
    onCollectionsListDataReceived = (collectionListData, paginationState) => {
        this.view.renderCollectionsList(collectionListData, paginationState);
    }

    /**
     * Call this method from the model when the data for a specific collection has
     * been received and must be displayed in the collection screen
     * 
     * @param {Object} collectionListData The list of collections
     * @param {{itemsPerPage: int, numberOfPages: int, page: int, total: int}} paginationState The current
     *      state of the pagination
     * @callback AdminController~onCollectionDataChanged
     */
    onCollectionDataReceivedForCollectionScreen = (collectionData) => {
        this.view.renderCollectionDetails(collectionData);
    }

    /**
     * Call this method when the collection form has been submitted by the Model
     *
     * @param {Response} response The response
     */
    onCollectionFormSubmitted = (response) => {
        // console.log(response);
        if (!response.ok) {
            // TODO handle server errors
            return ;
        }

        this.view.flashBag.push('The collection has been updated!');
        this.view.renderCollectionsHome();
        this.model.listCollections(null, this.onCollectionsListDataReceived);
    }


    /***************************************************************************
     * Handlers related to content data
     */

    /**
     * Call this method from the model when the list of content has been loaded.
     * 
     * @param {Object} collectionListData The list of collections
     * @param {{itemsPerPage: int, numberOfPages: int, page: int, total: int}} paginationState The current
     *      state of the pagination
     * @callback AdminController~onCollectionDataChanged
     */
    onContentListDataReceived = (contentListData, paginationState) => {
        this.view.renderContentList(contentListData, paginationState);
    }

    /**
     * Call this from the model when the content list has been received and we
     * want to refresh the view to add a content to a collection
     *
     * @param {Object} contentListData The list of content
     * @param {{itemsPerPage: int, numberOfPages: int, page: int, total: int}} paginationState The current
     *      state of the pagination
     */
    onContentListDataReceivedForCollection = (contentListData, paginationState) => {
        this.view.renderContentListInAddToCollection(contentListData, paginationState);
    }


    // -------------------------------------------------------------------------
    // not refactored yet ------------------------------------------------------
    // -------------------------------------------------------------------------

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

        // send the errors back to the collection
        this.view.renderFormErrors(form, formValidator.errors);
    }

    /**
     * Handle the submission of a new content
     *
     * @param {Element} form The form to validate
     * @param {?number} collectionId Null to create a new content only or the id of
     * the collection to which the new content must be added
     * @callback AdminController~handleClickSubmitNewContent
     */
    handleClickSubmitNewContent = (form, collectionId = null) => {
        const formValidator = new FormValidator(form);

        formValidator.validate();

        if (formValidator.isValid) {
            // submit the content
            this.model.submitNewContentForm(
                this.view.getNewContentFormData(),
                collectionId
            );

            return;
        }

        // send the errors back to the collection
        this.view.renderFormErrors(form, formValidator.errors);
    }
}
