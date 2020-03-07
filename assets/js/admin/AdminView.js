import {Utils} from '../utils/Utils';
import {Components} from './Components';

export class AdminView {
    constructor()
    {
        this.output   = Utils.getElement('#admin-main');
        this.menu     = Utils.getElement('#admin-menu');
        this.adminBar = {
            logo:            Utils.getElement('#siteLogo'),
            name:            Utils.getElement('#siteName'),
            notificationBar: Utils.getElement('#notificationBar'),
            userName:        Utils.getElement('#userName'),
            userSettings:    Utils.getElement('#userSettings')
        };
    }

    /***************************************************************************
     * Helper methods
     **************************************************************************/

    /**
     * Get and format View form data
     *
     * @param {number} viewId The id of the view for which the form is submitted
     *
     * @return {Object} The formated data
     */
    getViewFormData(viewId)
    {
        const contentList = Utils.getElement('#contentList');
        const data        = {};
        const formData    = new FormData(Utils.getElement('#viewForm'));

        // get data from the form
        formData.forEach((element, key) => {
            data[key] = element;
        });

        // get data contained in contentList
        data['viewContents'] = [];
        Array.from(contentList.rows).forEach((tr) => {
            data['viewContents'].push({
                view: viewId,
                content: tr.dataset.contentId
            })
        });

        return data;
    }

    getNewContentFormData()
    {
        const formData = new FormData(document.querySelector('#contentForm form'));
        const data     = {};
        
        data.name = formData.get('name');
        data.type = formData.get('type');

        data['content'] = {};

        let i = 1;
        let innerContentName = formData.get(`contentName_${i}`);

        while (innerContentName) {
            // loop over inner contents
            data['content'][innerContentName] = formData.get(`contentContent_${i}`);

            innerContentName = formData.get(`contentName_${++i}`);
        }

        return data;
    }

    /**
     * Get and format Content form data
     *
     * @return {Object} The formated data
     */
    getContentFormData()
    {
        const formData = new FormData(Utils.getElement('#contentForm form'));
        const data     = {};

        data['content'] = {};
        formData.forEach((element, key) => {
            if (key.match(/^content_/g)) {
                data['content'][key.substring(8)] = element;
                return;
            }

            data[key] = element;
        });

        return data;
    }

    /**
     * Helper to get content data from content display
     *
     * @param {Element} contentInformations The element from which to retrieve content data
     * @returns {Object} Object representation of the content data
     */
    getContentDataFromContentDisplay(contentInformations)
    {
        return {
            id:         contentInformations.dataset.contentId,
            name:       contentInformations.dataset.contentName,
            type:       contentInformations.dataset.contentType,
            created_at: contentInformations.dataset.createdAt,
            updated_at: contentInformations.dataset.updatedAt
        };
    }

    /**
     * Clear a group of elements
     *
     * @param {string} group The name of the group to clear
     */
    clearGroup(group)
    {
        document.querySelectorAll(`[data-group="${group}"]`).forEach((element) => {
            element.remove();
        });
    }

    /**
     * Add the currentMenuEntry class on the current entry and remove it from
     * the previous current entry
     *
     * @param {string} id The id of the current menu entry
     */
    toggleCurrentMenuEntry(id)
    {
        this.menu.querySelector('.currentMenuEntry').classList.remove('currentMenuEntry');
        this.menu.querySelector(`#${id}`).classList.add('currentMenuEntry');
    }

    /***************************************************************************
     * Methods to render views
     **************************************************************************/

    /**
     * Render admin home page
     */
    renderHomePage()
    {
        const dataset      = Utils.getElement('main').dataset;
        const informations = {
            siteName: dataset.siteName,
            userEmail: dataset.userEmail
        };

        Utils.clear(this.output);

        this.output.appendChild(Components.homePage(informations));
        this.toggleCurrentMenuEntry('home');
        document.title = 'Administration - Home';
    }

    /**
     * Render home page for assets management
     */
    renderAssestsHome()
    {
        Utils.clear(this.output);

        this.output.appendChild(Components.notImplementedFeature());
    }

    /**
     * Render home page for users management
     */
    renderUsersHome()
    {
        Utils.clear(this.output);

        this.output.appendChild(Components.notImplementedFeature());
    }

    /**
     * Render home page for stats management
     */
    renderStatsHome()
    {
        Utils.clear(this.output);

        this.output.appendChild(Components.notImplementedFeature());
    }

    /**
     * Render home page layout for views management
     *
     * @returns {undefined}
     */
    renderViewsHome()
    {
        Utils.clear(this.output);

        this.output.appendChild(Components.viewsHome());
    }

    renderViewsList(viewList)
    {
        const element = Utils.getElement('#viewOutput');

        element.appendChild(Components.viewList(viewList));
    }

    /**
     * Render a view form and attach event listeners
     *
     * @param {object} viewData The view data for the form
     */
    renderViewForm(viewData)
    {
        if (Utils.getElement('#viewFormOutput')) {
            Utils.getElement('#viewFormOutput').remove();
        }
        this.output.appendChild(Components.viewForm(viewData));

        this._bindClickCancelButtons();
    }

    /**
     * Render form errors
     *
     * @param {Element} form The form that has errors
     * @param {Object} errors Errors to render
     */
    renderFormErrors(form, errors)
    {
        // remove previous errors (if any)
        const previousErrors = document.querySelectorAll('.formError');

        if (previousErrors) {
            previousErrors.forEach((element) => {
                element.remove();
            });
        }

        // display error messages
        for (let property in errors) {
            const span     = Utils.createElement('span', 'formError');
            span.innerHTML = errors[property];

            form.querySelector(`[data-name="${property}"]`).insertAdjacentElement('afterend', span);
        }
    }

    /**
     * Render the template associated to viewId within an iframe
     *
     * @param {number} viewId The id of the view. Set to null to only refresh an
     * existing iframe
     *
     * @return {undefined}
     */
    renderViewTemplate(viewId)
    {
        if (!viewId) {
            // called without viewId when refreshing the iframe, so we get
            // viewId from existing iframe
            viewId = Utils.getElement('#visualView').dataset.viewId;
            Utils.getElement('#visualViewContainer').remove();
        }

        const div    = Utils.createElement('div', null, 'visualViewContainer');
        const iframe = Utils.createElement('iframe', null, 'visualView');

        iframe.dataset.viewId = viewId;
        iframe.setAttribute('src', `admin/view/visual/${viewId}`);

        div.appendChild(iframe);
        this.output.appendChild(div);
    }

    renderContentList(contentList)
    {
        const button = Utils.createElement('a', 'button', 'newContentButton');

        // clear admin output
        Utils.clear(this.output);

        // create a button to add a new content
        button.href      = '#';
        button.innerHTML = 'New content';

        this.output.appendChild(Components.contentList(contentList, 'contentList', false));
        this.output.appendChild(button);
    }

    /**
     * Render a content form and attach event listeners
     *
     * @param {object} contentData The content data
     */
    renderContentForm(contentData)
    {
        this.output.appendChild(Components.contentForm(contentData));

        this._bindClickCancelButtons();
    }

    /**
     * Render form to ask which type of new content must be added
     *
     * @param {number} viewId The id of the view for which we want to add a content
     */
    renderAskNewContentForm(viewId)
    {
        const parent = Utils.getElement('#viewFormOutput');
        const div    = Components.askNewContentForm(viewId);

        parent.appendChild(div);
    }

    /**
     * Render a form to create a new content
     * 
     * @param {number?} viewId The id of the view for which we want to add a
     * content or null if we do not want to add it to a view
     */
    renderNewContentForm(viewId)
    {
        let newContentForm = Utils.getElement('#newContentForm');

        if (newContentForm) {
            Utils.clear(newContentForm);
        } else {
            newContentForm = Utils.createElement('div', null, 'newContentForm');
        }

        newContentForm.appendChild(Components.newContentForm());
        newContentForm.dataset.group = 'addContentToView';

        this.output.appendChild(newContentForm);

        if (viewId) {
            // Create a new content from the view pane
            Utils.getElement('#submitContentFormButton').dataset.viewId = viewId;
        }

        // add event listener for cancel button
        this._bindClickCancelButtons();
    }

    /**
     * Render form to add inner content inside content object
     */
    renderAddInnerContentForm()
    {
        const innerContentList = Utils.getElement('#innerContentList');

        // increment innerContentCount and add a new one
        innerContentList.dataset.innerContentCount++;
        innerContentList.appendChild(
            Components.newInnerContentForm(innerContentList.dataset.innerContentCount)
        );
    }

    /**
     * Render the form to look for an existing content
     *
     * @param {number} viewId The id of the view for which we want to add a content
     */
    renderUseContentForm(viewId)
    {
        // render a search content form
        const parent = Utils.getElement('#viewFormOutput');
        parent.appendChild(Components.searchContentForm());

        const div          = Utils.createElement('div', null, 'contentSuggestion');
        div.dataset.viewId = viewId;
        div.dataset.group  = 'addContentToView';
        parent.appendChild(div);
    }

    /**
     * Render the content suggestions for a given search term, if any.
     *
     * @param {Array} suggestion An array containing suggestions for given search term
     * @param {number} viewId The id of the view
     */
    renderContentSuggestion(suggestion, viewId)
    {
        let contentSuggestionDiv = Utils.getElement('#contentSuggestion');

        if (!contentSuggestionDiv) {
            contentSuggestionDiv = Utils.createElement('div', null, 'contentSuggestion');
            contentSuggestionDiv.dataset.viewId = viewId;
        }

        Utils.clear(Utils.getElement('#contentSuggestion'));

        // check if array is not empty
        if (suggestion.length > 0) {
            contentSuggestionDiv.appendChild(Components.contentSuggestion(suggestion));
            return;
        }
        
        // if array is empty, display a message
        const p     = Utils.createElement('p');
        p.innerHTML = 'No content matching search term';
        contentSuggestionDiv.appendChild(p);
    }

    /**
     * Render a div to display a single content
     * 
     * @param {Object} content An object representation of the content
     */
    renderContent(content)
    {
        const parent   = Utils.getElement('#viewFormOutput');
        const button   = Utils.createElement('a', 'button', 'useThisContent');
        let contentDiv = Utils.getElement('#contentDisplay');

        // remove it if already created
        if (contentDiv) {
            contentDiv.remove();
        }

        contentDiv               = Components.content(content);
        button.innerHTML         = 'Add to view';
        button.href              = '#'
        button.dataset.contentId = content.id;
        button.dataset.viewId    = Utils.getElement('#contentSuggestion').dataset.viewId;

        contentDiv.appendChild(button);
        parent.appendChild(contentDiv);
    }

    /**
     * Remove a content from the list of contents on the view screen
     *
     * @param {number} contentId The id of the content to remove
     */
    removeContentFromView(contentId)
    {
        Utils.getElement(`#contentList tr[data-content-id="${contentId}"]`).remove();
    }

    /**
     * Add a content to the view
     *
     * @param {Object} contentData Data for the content to add to the view
     */
    addContentToView(contentData)
    {
        const contentListBody = Utils.getElement('#contentList tbody');

        contentListBody.appendChild(Components.contentListRow(contentData, true));
    }

    /***************************************************************************
     * Methods to bind event Listeners
     **************************************************************************/

    /**
     * Bind the controller callback to use when the user clicks on 'Home' menu
     * entry
     */
    bindClickHome(handler)
    {
        Utils.getElement('a#home').addEventListener('click', event => {
            event.preventDefault();

            handler();
        });
    }

    bindAssetsHome(handler)
    {
        Utils.getElement('#assets').addEventListener('click', event => {
            event.preventDefault();

            handler();
        });
    }

    bindUsersHome(handler)
    {
        Utils.getElement('#users').addEventListener('click', event => {
            event.preventDefault();

            handler();
        });
    }

    bindStatsHome(handler)
    {
        Utils.getElement('#stats').addEventListener('click', event => {
            event.preventDefault();

            handler();
        });
    }

    bindViewsHome(handler)
    {
        Utils.getElement('#views').addEventListener('click', event => {
            event.preventDefault();

            handler();
        });
    }

    bindClickView(handler)
    {
        Utils.getElement('#editView').addEventListener('click', event => {
            event.preventDefault();

            handler(event.target.dataset.id);
        });
    }

    bindClickViewVisual(handler)
    {
        Utils.getElement('#editViewVisual').addEventListener('click', event => {
            event.preventDefault();

            handler(event.target.dataset.id);
        });
    }

    /**
     * Bind the controller callback to use to submit a view form
     * 
     * @param {function} handler The callback to bind
     */
    bindClickSubmitView(handler)
    {
        Utils.getElement('#submitViewButton').addEventListener('click', event => {
            event.preventDefault();

            // send the form element
            handler(Utils.getElement('#viewForm'));
        });
    }

    bindListContent(handler)
    {
        Utils.getElement('#content').addEventListener('click', event => {
            event.preventDefault();

            handler();
        });
    }

    bindClickContent(handler)
    {
        Utils.getElement('#contentList').addEventListener('click', event => {
            event.preventDefault();

            if (event.target.dataset.action === 'edit') {
                handler(event.target.dataset.contentId);
            }
        });
    }

    /**
     * Bind the controller callback to use when user click on 'deleteContentButton'
     * 
     * @param {function} handler The callback to bind
     */
    bindClickDeleteContent(handler)
    {
        Utils.getElement('#contentList').addEventListener('click', event => {
            event.preventDefault();

            if (event.target.dataset.action === 'delete') {
                handler(event.target.dataset.contentId);
            }
        });
    }

    /**
     * Bind the controller callback to use when user click on button to remove
     * a content from the view
     * 
     * @param {function} handler The callback to bind
     */
    bindClickRemoveContentFromView(handler)
    {
        Utils.getElement('#contentList').addEventListener('click', event => {
            event.preventDefault();

            if (event.target.dataset.action === 'removeFromView') {
                handler(event.target.dataset.contentId);
            }
        });
    }

    /**
     * Bind the controller callback to use when user click on 'newContentButton'
     * 
     * @param {function} handler The callback to bind
     */
    bindClickNewContent(handler)
    {
        Utils.getElement('#newContentButton').addEventListener('click', event => {
            event.preventDefault();

            handler();
        });
    }

    /**
     * Bind the controller callback to use when user click on 'addInnerContent'
     * 
     * @param {function} handler The callback to bind
     */
    bindClickAddInnerContent(handler)
    {
        Utils.getElement('#addInnerContent').addEventListener('click', event => {
            event.preventDefault();

            handler();
        });
    }

    bindClickContentVisual(handler)
    {
        const iframe = Utils.getElement('iframe');

        iframe.contentWindow.addEventListener('DOMContentLoaded', () => {
            const innerDoc = iframe.contentWindow.document;
            // const elements = innerDoc.querySelectorAll('a.editContent');
            const elements = innerDoc.querySelectorAll('.contentBox');

            elements.forEach((element) => {
                element.addEventListener('click', (event) => {
                    handler(event.currentTarget.dataset.contentId);
                });
            });
        });
    }

    /**
     * Bind the controller callback to use when new content form is submitted
     * 
     * @param {function} handler The callback to bind
     */
    bindClickSubmitNewContent(handler)
    {
        Utils.getElement('#submitContentFormButton').addEventListener('click', event => {
            const viewId = event.target.dataset.viewId ? event.target.dataset.viewId : null;

            event.preventDefault();

            // submit new content form and add it to the view
            handler(Utils.getElement('#contentForm form'), viewId)
        });
    }

    /**
     * Bind the controller callback to use when content form is submitted
     * 
     * @param {function} handler The callback to bind
     */
    bindClickSubmitContent(handler)
    {
        Utils.getElement('#submitContentFormButton').addEventListener('click', event => {
            event.preventDefault();

            // handler(event.target.dataset.contentId, this.getContentFormData());
            handler(Utils.getElement('#contentForm form'));
        });
    }

    bindClickSubmitContentVisual(handler)
    {
        Utils.getElement('#submitContentFormButton').addEventListener('click', event => {
            event.preventDefault();

            handler(event.target.dataset.contentId, this.getContentFormData());
        });
    }

    bindSearchContent(callback)
    {
        // the callback is called when we search for a content
        this.searchContent = callback;
    }

    bindNeedContent(callback)
    {
        // call this when the view need a content
        this.needContent = callback;
    }

    /**
     * Bind the controller callback to use when user click on 'addContentButton'
     * 
     * @param {function} handler The callback to bind
     */
    bindClickAddContent(handler)
    {
        Utils.getElement('#addContentButton').addEventListener('click', (event) => {
            event.preventDefault();

            handler(event.target.dataset.viewId);
        });
    }

    /**
     * Bind the controller callback to use when user click on 'createContent'
     * 
     * @param {function} handler The callback to bind
     */
    bindClickAddContentNew(handler)
    {
        Utils.getElement('#createContent').addEventListener('click', (event) => {
            event.preventDefault();

            handler(event.target.dataset.viewId);
        });
    }

    /**
     * Bind the controller callback to use when user click on 'useContent'
     * 
     * @param {function} handler The callback to bind
     */
    bindClickAddContentUse(handler)
    {
        Utils.getElement('#useContent').addEventListener('click', (event) => {
            event.preventDefault();

            handler(event.target.dataset.viewId);
        });
    }

    /**
     * Bind the controller callback to use when user type a letter in the
     * content search field
     * 
     * @param {function} handler The callback to bind
     */
    bindKeyUpSearchContent(handler)
    {
        Utils.getElement('#searchContentForm input').addEventListener('keyup', (event) => {
            handler(event.target.value);
        });
    }

    /**
     * Bind the controller callback to use when user clicks on a content
     * suggestion
     * 
     * @param {function} handler The callback to bind
     */
    bindClickContentSuggestion(handler)
    {
        Utils.getElement('#contentSuggestion').addEventListener('click', (event) => {
            event.preventDefault();

            handler(event.target.dataset.contentId);
        });
    }

    /**
     * Bind the controller callback to use when user clicks on the 'Use
     * content' button
     * 
     * @param {function} handler The callback to bind
     */
    bindClickUseThisContent(handler)
    {
        Utils.getElement('#useThisContent').addEventListener('click', (event) => {
            event.preventDefault();

            const contentInformations = Utils.getElement('#contentInformations');
            const contentData         = this.getContentDataFromContentDisplay(contentInformations);

            handler(contentData);
        });
    }

    /***************************************************************************
     * Methods to handle view related events
     **************************************************************************/

    _bindClickCancelButtons()
    {
        const cancelButtons = document.querySelectorAll('.cancelButton');

        cancelButtons.forEach((button) => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                Utils.getElement(`#${event.target.dataset.parentId}`).remove();
            });
        });
    }

    // _onClickCancel = (event) => {
    //     event.preventDefault();
    //     Utils.getElement(`#${event.target.dataset.parentId}`).remove();
    // }

    _onClickAddContent = (event) => {
            event.preventDefault();
            // TODO render a form to ask if we create a new content or if we
            // use an existing content

            this.renderAskNewContentForm();
    };
}
