import {Utils} from '../utils/Utils';

export class Content {
    constructor(parentElement)
    {
        this.parentElement = parentElement;
    }

    /**
     * Query server to get the content list and display it
     *
     * @returns {undefined}
     */
    list()
    {
        fetch('/admin/content')
            .then(response => response.json())
            .then(data => {
                Utils.clear(this.parentElement);

                const ul = document.createElement('ul');
                data.forEach(element => {
                    let li = document.createElement('li');
                    let a  = document.createElement('a');

                    a.text              = `${element.name} (${element.type})`;
                    a.href              = '#';
                    a.dataset.contentId = element.id;

                    li.appendChild(a)
                    ul.appendChild(li);
                });
                ul.addEventListener('click', this.onClickContent.bind(this));

                this.parentElement.appendChild(ul);
            })
    }

    onClickContent(event)
    {
        event.preventDefault();

        // check if we clicked on the link
        if (!event.target.dataset.contentId) {
            return 0;
        }

        console.log(event.target.dataset.contentId);

        fetch('/admin/content/' + event.target.dataset.contentId)
            .then(response => response.json())
            .then(data => {
                // TODO build a form in a modal window
                console.log(data);
            })
    }
}
