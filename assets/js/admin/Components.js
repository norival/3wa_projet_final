export class Components {
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
    static createElement(tag, className, id)
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
     * contentList
     *
     * The content list component.
     *
     * @param contentList The content list
     * @param contentListIsNested Whether the content is nested inside the
     * content list
     *
     * @returns {undefined}
     */
    static contentList(contentList, id, contentListIsNested = false)
    {
        const table = this.createElement('table', null, id);
        const tbody = this.createElement('tbody');

        const thead = this.createElement('thead');
        let th      = this.createElement('th');

        th.innerHTML = 'Name';
        thead.appendChild(th);

        th = this.createElement('th');
        th.innerHTML = 'Type';
        thead.appendChild(th);

        table.appendChild(thead);

        contentList.forEach(element => {
            if (contentListIsNested) {
                element = element.content;
            }

            let tr = this.createElement('tr');
            let td = this.createElement('td');
            let a  = this.createElement('a');

            a.text              = element.name;
            a.href              = '#';
            a.dataset.contentId = element.id;

            td.appendChild(a)
            tr.appendChild(td);

            td = this.createElement('td');
            a  = this.createElement('a');

            a.text               = element.type;
            a.href               = '#';
            a.dataset.contentId  = element.id;
            td.dataset.contentId = element.id;

            td.appendChild(a)
            tr.appendChild(td);

            tbody.appendChild(tr);
        });

        table.appendChild(tbody);

        return table;
    }
}
