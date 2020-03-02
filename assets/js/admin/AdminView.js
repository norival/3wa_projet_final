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
     *
     * @returns Element
     */
    createElement(tag, className, id)
    {
        const element = document.createElement(tag);

        if (className) {
            element.classList.add(className);
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
     * @returns Element
     */
    getElement(selector)
    {
        return document.querySelector(selector);
    }

    /**
     * Get and format View form data
     *
     * @param {int} viewId The id of the view for which the form is submitted
     *
     * @returns {Object}
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

    renderViewForm(viewData)
    {
        const viewDiv = this.createElement('div', null, 'viewFormOutput');
        const form    = this.createElement('form', null, 'viewForm');

        let h3       = this.createElement('h3');
        h3.innerHTML = `View: ${viewData.name}`;
        viewDiv.appendChild(h3);

        let fieldset = this.createElement('fieldset');
        let h4       = this.createElement('h4');
        h4.innerHTML = 'Informations';

        fieldset.appendChild(h4);

        let ul      = this.createElement('ul');
        const infos = {'name': viewData.name, 'title': viewData.title}

        for (const key in infos) {
            let li    = this.createElement('li');
            let input = this.createElement('input');
            let label = this.createElement('label');

            input.setAttribute('type', 'text');
            input.setAttribute('name', key);
            input.value = infos[key];
            label.innerHTML = key;
            label.setAttribute('for', key);

            li.appendChild(label);
            li.appendChild(input);
            ul.appendChild(li);
        }

        fieldset.appendChild(ul);
        form.appendChild(fieldset);

        form.dataset.viewId = viewData.id;
        viewDiv.appendChild(form);

        h3           = this.createElement('h3');
        h3.innerHTML = 'Content list';
        viewDiv.appendChild(h3);

        viewDiv.appendChild(Components.contentList(viewData.viewContents, 'contentList', true));

        ul = this.createElement('ul', null, 'buttonList');

        let li = this.createElement('li');

        let button       = this.createElement('button', null, 'addContentButton');
        button.innerHTML = 'Add content';
        li.appendChild(button);
        ul.appendChild(li);

        li               = this.createElement('li');
        button           = this.createElement('button', null, 'submitViewButton');
        button.innerHTML = 'Save';
        button.dataset.viewId = viewData.id;
        li.appendChild(button);
        ul.appendChild(li);

        li                      = this.createElement('li');
        button                  = this.createElement('button', null, 'cancelContentEditButton');
        button.innerHTML        = 'Cancel';
        button.dataset.parentId = 'viewFormOutput';
        li.appendChild(button);
        ul.appendChild(li);

        viewDiv.appendChild(ul);
        this.element.appendChild(viewDiv);

        // TODO add event listeners for addContent
        // this.getElement('#addContent').addEventListener('click', this.onClickAddContent);
        this.getElement('#cancelContentEditButton').addEventListener('click', this._onClickCancel);
        this.getElement('#addContentButton').addEventListener('click', this._onClickAddContent);
    }

    /**
     * Render the template associated to viewId within an iframe
     *
     * @param {int} viewId The id of the view. Set to null to only refresh an
     * existing iframe
     *
     * @returns {undefined}
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
        Utils.clear(this.element);

        this.element.appendChild(Components.contentList(contentList, 'contentList', false));
    }

    renderContentForm(contentData)
    {
        const div  = this.createElement('div', null, 'contentForm');
        const form = this.createElement('form');

        let fieldset = this.createElement('fieldset');
        let h3 = this.createElement('h3');

        h3.innerHTML = 'Informations';
        fieldset.appendChild(h3);

        let ul = this.createElement('ul');

        let li    = this.createElement('li');
        let input = this.createElement('input');
        let label = this.createElement('label');

        label.setAttribute('for', 'name');
        label.innerHTML = 'Name';
        input.setAttribute('type', 'text');
        input.setAttribute('name', 'name');
        input.value = contentData.name;

        li.appendChild(label);
        li.appendChild(input);
        ul.appendChild(li);

        li    = this.createElement('li');
        input = this.createElement('input');
        label = this.createElement('label');

        label.setAttribute('for', 'type');
        label.innerHTML = 'Type';
        input.setAttribute('type', 'text');
        input.setAttribute('name', 'type');
        input.value = contentData.type;

        li.appendChild(label);
        li.appendChild(input);
        ul.appendChild(li);

        fieldset.appendChild(ul);

        form.appendChild(fieldset);

        fieldset = this.createElement('fieldset');
        h3 = this.createElement('h3');

        h3.innerHTML = 'Content';
        fieldset.appendChild(h3);

        ul = this.createElement('ul');

        for (let property in contentData.content) {
            let li    = this.createElement('li');
            let label = this.createElement('label');
            let input = this.createElement('input');

            label.innerHTML = property;
            label.setAttribute('for', `content_${property}`);

            input.setAttribute('type', 'text');
            input.setAttribute('name', `content_${property}`);
            input.value = contentData.content[property];
            
            li.appendChild(label);
            li.appendChild(input);

            ul.appendChild(li);
        }

        fieldset.appendChild(ul);
        form.appendChild(fieldset);

        let button = this.createElement('button', null, 'submitContentButton');
        ul = this.createElement('ul');
        li = this.createElement('li');

        button.innerHTML         = 'Save';
        button.dataset.contentId = contentData.id;

        li.appendChild(button);
        ul.appendChild(li);

        button = this.createElement('button', null, 'cancelViewEditButton');
        li     = this.createElement('li');

        button.innerHTML = 'Cancel';
        button.dataset.parentId = 'contentForm';

        li.appendChild(button);
        ul.appendChild(li);

        form.appendChild(ul);

        div.appendChild(form);

        this.element.appendChild(div);

        this.getElement('#cancelViewEditButton').addEventListener('click', this._onClickCancel);
    }

    renderAskNewContentForm()
    {
        const div = Components.askNewContentForm();

        this.element.appendChild(div);

        this.getElement('#createContent').addEventListener('click', this.renderNewContentForm);
        this.getElement('#useContent').addEventListener('click', this.renderUseContentForm.bind(this));
    }

    renderNewContentForm()
    {
        // TODO render a form to create a new content
        console.log('we will create a new content from scratch');
    }

    renderUseContentForm()
    {
        // render a search content form
        this.element.appendChild(Components.searchContentForm());

        this.element.appendChild(this.createElement('div', null, 'contentSuggestion'));

        this.getElement('#searchContentForm input').addEventListener('keyup', event => {
            this.searchContent(event.target.value);
        });

        this.getElement('#contentSuggestion').addEventListener('click', event => {
            // TODO display content when clicking
            event.preventDefault();

            this.getElement('#searchContentForm input').value = event.target.innerHTML;
            this.needContent(event.target.dataset.contentId);
        });
    }

    renderContentSuggestion(suggestion)
    {
        Utils.clear(this.getElement('#contentSuggestion'));
        this.getElement('#contentSuggestion').appendChild(Components.contentSuggestion(suggestion));
    }

    renderContent(content)
    {
        let contentDiv = this.getElement('#contentDisplay');

        // remove it if already created
        if (contentDiv) {
            contentDiv.remove();
        }

        contentDiv = Components.content(content);




        this.element.appendChild(contentDiv);
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
        this.getElement('#submitContentButton').addEventListener('click', event => {
            event.preventDefault();

            handler(event.target.dataset.contentId, this.getContentFormData());
        });
    }

    bindClickSubmitContentVisual(handler)
    {
        this.getElement('#submitContentButton').addEventListener('click', event => {
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
