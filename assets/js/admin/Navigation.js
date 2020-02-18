// import {Form} from './Form';

export class Navigation {
    constructor(adminOutput)
    {
        // get the DOM elements
        this.nav  = document.getElementById('admin-navigation');
        this.viewList = document.getElementById('view-list');
        this.adminOutput = adminOutput;

        // empty contentList
        this.viewList.innerHTML = '';

        // add event listener on content list
        this.viewList.addEventListener('click', this.onClickView.bind(this));

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
     * Handle click on navigation item
     *
     * @returns {undefined}
     */
    onClickView(event)
    {
        fetch('/admin/view/form/' + event.target.dataset.name)
            .then(response => response.text())
            .then(text     => this.adminOutput.innerHTML = text);
    }
}
