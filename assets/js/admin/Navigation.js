// import {Form} from './Form';
import {Content} from './Content';
import {ViewForm} from './ViewForm';

export class Navigation {
    constructor(adminOutput)
    {
        // get the DOM elements
        this.nav         = document.getElementById('admin-navigation');
        this.viewList    = document.getElementById('view-list');
        this.content     = document.getElementById('content');
        this.adminOutput = adminOutput;

        // empty contentList
        this.viewList.innerHTML = '';

        // add event listener on content list
        this.viewList.addEventListener('click', this.onClickView.bind(this));
        this.content.addEventListener('click', this.onClickContent.bind(this));

        // get content information from database and build content list
        fetch('admin/list-view')
            .then(response => response.json())
            .then(viewList => {
                viewList.forEach((view) => {
                    // create list item
                    let li = document.createElement('li');
                    let a  = document.createElement('a');
                    a.href = '#';
                    a.text = view.title;
                    a.dataset.name = view.name;
                    li.appendChild(a);

                    // append element to list
                    this.viewList.appendChild(li);
                });
            });
    }

    /**
     * Handle click on Content menu entry
     *
     * @returns {undefined}
     */
    onClickContent(event)
    {
        event.preventDefault();

        const content = new Content(this.adminOutput);
        content.list();
    }

    /**
     * Handle click on navigation item
     *
     * @returns {undefined}
     */
    onClickView(event)
    {
        const viewForm = new ViewForm(this.adminOutput);

        fetch('/admin/view/form/' + event.target.dataset.name)
            .then(response => response.json())
            .then(json => {
                viewForm.build(JSON.parse(json));
            })
    }
}
