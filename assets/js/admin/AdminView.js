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
     * @returns Element
     */
    createElement(tag, className, id)
    {
        const element = document.createElement(tag);

        if (className) {
            element.classList.add(className);
        }

        if (id) {
            element.id = className;
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


    /***************************************************************************
     * Methods to render views
     **************************************************************************/

    renderViewList(promise)
    {
        promise.then(viewList => {
            const ul = this.createElement('ul');

            viewList.forEach((view) => {
                // create list item
                let li = this.createElement('li');
                let a  = this.createElement('a');

                a.href         = '#';
                a.text         = view.title;
                a.dataset.name = view.name;
                a.dataset.id   = view.id

                // TODO add event listener
                // a.addEventListener('click', this.onClickView.bind(this));

                li.appendChild(a);

                // append element to list
                ul.appendChild(li);
            });

            this.element.appendChild(ul);
        });
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
}
