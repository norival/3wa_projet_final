import {Utils} from '../utils/Utils';
import {Components} from './Components';

export class AdminView {
    constructor()
    {
        this.element = this.getElement('#admin-main');
    }

    /***************************************************************************
     * Helper methods
     **************************************************************************/

    /**
     * createElement
     *
     * Create an element and optionnally adds a class and an id
     *
     * @param {string} tag - A valid html tag
     * @param {string|Array} className - A class name or an array of class names
     * @param {string} id - An id
     * @return {Element} The created NodeElement
     */
    createElement(tag, className, id)
    {
        const element = document.createElement(tag);

        if (className) {
            if (!Array.isArray(className)) {
                className = [className];
            }

            element.classList.add(...className);
        }

        if (id) {
            element.id = id;
        }

        return element;
    }

    /**
     * getElement
     *
     * Retrieve an element from the DOM
     *
     * @param {string} selector A valid css selector
     * @return {?Element} The corresponding element or null if no element
     * match the selector
     */
    getElement(selector)
    {
        return document.querySelector(selector);
    }

    /**
     * Get and format View form data
     *
     * @param {number} viewId The id of the view for which the form is submitted
     *
     * @return {Object} The formated data
     */
    getViewFormData(viewId)
    {
        const contentList = this.getElement('#contentList');
        const data        = {};
        const formData    = new FormData(this.getElement('#viewForm'));

        // get data from the form
        formData.forEach((element, key) => {
            data[key] = element;
        });

        // get data contained in contentList
        data['viewContents'] = [];
        Array.from(contentList.rows).forEach((tr) => {
            Array.from(tr.cells).forEach((cell) => {
                if (cell.dataset.contentId) {
                    data['viewContents'].push({
                        view: viewId,
                        content: cell.dataset.contentId
                    });
                }
            })
        });

        return data;
    }

    getContentFormData()
    {
        const formData = new FormData(this.getElement('#contentForm form'));
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


    /***************************************************************************
     * Methods to render views
     **************************************************************************/

    renderViewList(viewList)
    {
        Utils.clear(this.element);

        this.element.appendChild(Components.viewList(viewList));
    }

    /**
     * Render a view form and attach event listeners
     *
     * @param {object} viewData The view data for the form
     */
    renderViewForm(viewData)
    {
        if (this.getElement('#viewFormOutput')) {
            this.getElement('#viewFormOutput').remove();
        }
        this.element.appendChild(Components.viewForm(viewData));

        this.getElement('#cancelContentEditButton').addEventListener('click', this._onClickCancel);
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
            viewId = this.getElement('#visualView').dataset.viewId;
            this.getElement('#visualViewContainer').remove();
        }

        const div    = this.createElement('div', null, 'visualViewContainer');
        const iframe = this.createElement('iframe', null, 'visualView');

        iframe.dataset.viewId = viewId;
        iframe.setAttribute('src', `admin/view/visual/${viewId}`);

        div.appendChild(iframe);
        this.element.appendChild(div);
    }

    renderContentList(contentList)
    {
        const button = this.createElement('a', 'button', 'newContentButton');

        // clear admin output
        Utils.clear(this.element);

        // create a button to add a new content
        button.href      = '#';
        button.innerHTML = 'New content';

        this.element.appendChild(Components.contentList(contentList, 'contentList', false));
        this.element.appendChild(button);
    }

    /**
     * Render a content form and attach event listeners
     *
     * @param {object} contentData The content data
     */
    renderContentForm(contentData)
    {
        this.element.appendChild(Components.contentForm(contentData));

        this.getElement('#cancelContentFormButton').addEventListener('click', this._onClickCancel);
    }

    /**
     * Render form to ask which type of new content must be added
     *
     * @param {number} viewId The id of the view for which we want to add a content
     */
    renderAskNewContentForm(viewId)
    {
        const parent = this.getElement('#viewFormOutput');
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
        // TODO render a form to create a new content
        // const parent = this.getElement('#viewFormOutput');
        if (viewId) {
            // TODO do something else if we are creating a new content from the
            // view pane
        }

        let newContentForm = this.getElement('#newContentForm');

        if (newContentForm) {
            Utils.clear(newContentForm);
        } else {
            newContentForm = this.createElement('div', null, 'newContentForm');
        }

        newContentForm.appendChild(Components.newContentForm());
        this.element.appendChild(newContentForm);

        // add event listener for cancel button
        this.getElement('#cancelContentFormButton').addEventListener('click', this._onClickCancel);
    }

    /**
     * Render the form to look for an existing content
     *
     * @param {number} viewId The id of the view for which we want to add a content
     */
    renderUseContentForm(viewId)
    {
        // render a search content form
        const parent = this.getElement('#viewFormOutput');
        parent.appendChild(Components.searchContentForm());

        const div          = this.createElement('div', null, 'contentSuggestion');
        div.dataset.viewId = viewId;
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
        let contentSuggestionDiv = this.getElement('#contentSuggestion');

        if (!contentSuggestionDiv) {
            contentSuggestionDiv = this.createElement('div', null, 'contentSuggestion');
            contentSuggestionDiv.dataset.viewId = viewId;
        }

        Utils.clear(this.getElement('#contentSuggestion'));

        // check if array is not empty
        if (suggestion.length > 0) {
            contentSuggestionDiv.appendChild(Components.contentSuggestion(suggestion));
            return;
        }
        
        // if array is empty, display a message
        const p     = this.createElement('p');
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
        const parent   = this.getElement('#viewFormOutput');
        const button   = this.createElement('a', 'button', 'useThisContent');
        let contentDiv = this.getElement('#contentDisplay');

        // remove it if already created
        if (contentDiv) {
            contentDiv.remove();
        }

        contentDiv               = Components.content(content);
        button.innerHTML         = 'Add to view';
        button.href              = '#'
        button.dataset.contentId = content.id;
        button.dataset.viewId    = this.getElement('#contentSuggestion').dataset.viewId;

        contentDiv.appendChild(button);
        parent.appendChild(contentDiv);
    }


    /***************************************************************************
     * Methods to bind event Listeners
     **************************************************************************/

    bindListViews(handler)
    {
        this.getElement('#views').addEventListener('click', event => {
            event.preventDefault();

            handler();
        });
    }

    bindClickView(handler)
    {
        this.getElement('#editView').addEventListener('click', event => {
            event.preventDefault();

            handler(event.target.dataset.id);
        });
    }

    bindClickViewVisual(handler)
    {
        this.getElement('#editViewVisual').addEventListener('click', event => {
            event.preventDefault();

            handler(event.target.dataset.id);
        });
    }

    bindClickSubmitView(handler)
    {
        this.getElement('#submitViewButton').addEventListener('click', event => {
            event.preventDefault();
            const viewId = event.target.dataset.viewId;

            handler(viewId, this.getViewFormData(viewId));
        });
    }

    bindListContent(handler)
    {
        this.getElement('#content').addEventListener('click', event => {
            event.preventDefault();

            handler();
        });
    }

    bindClickContent(handler)
    {
        this.getElement('#contentList').addEventListener('click', event => {
            event.preventDefault();

            handler(event.target.dataset.contentId);
        });
    }

    /**
     * Bind the controller callback to use when user click on 'newContentButton'
     * 
     * @param {function} handler The callback to bind
     */
    bindClickNewContent(handler)
    {
        this.getElement('#newContentButton').addEventListener('click', event => {
            event.preventDefault();

            handler();
        });
    }

    bindClickContentVisual(handler)
    {
        const iframe = this.getElement('iframe');

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

    bindClickSubmitContent(handler)
    {
        this.getElement('#submitContentFormButton').addEventListener('click', event => {
            event.preventDefault();

            handler(event.target.dataset.contentId, this.getContentFormData());
        });
    }

    bindClickSubmitContentVisual(handler)
    {
        this.getElement('#submitContentFormButton').addEventListener('click', event => {
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
        this.getElement('#addContentButton').addEventListener('click', (event) => {
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
        this.getElement('#createContent').addEventListener('click', (event) => {
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
        this.getElement('#useContent').addEventListener('click', (event) => {
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
        this.getElement('#searchContentForm input').addEventListener('keyup', (event) => {
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
        this.getElement('#contentSuggestion').addEventListener('click', (event) => {
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
        this.getElement('#useThisContent').addEventListener('click', (event) => {
            event.preventDefault();

            const viewId    = event.target.dataset.viewId;
            const contentId = event.target.dataset.contentId;

            const formData = this.getViewFormData(viewId);

            handler(viewId, formData, contentId);
        });
    }

    /***************************************************************************
     * Methods to handle view related events
     **************************************************************************/

    _onClickCancel = (event) => {
        event.preventDefault();
        this.getElement(`#${event.target.dataset.parentId}`).remove();
    }

    _onClickAddContent = (event) => {
            event.preventDefault();
            // TODO render a form to ask if we create a new content or if we
            // use an existing content

            this.renderAskNewContentForm();
    };
}
