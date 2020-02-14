import {Form} from './Form';

export class Navigation {
    constructor(adminOutput)
    {
        // get the DOM elements
        this.nav  = document.getElementById('admin-navigation');
        this.contentList = document.getElementById('content-list');
        this.adminOutput = adminOutput;

        // empty contentList
        this.contentList.innerHTML = '';

        // add event listener on content list
        this.contentList.addEventListener('click', this.onClickContent.bind(this));

        // get content information from database and build content list
        fetch('admin/list-content')
            .then(response => response.json())
            .then(contentList => {
                contentList.forEach((content) => {
                    // create list item
                    let li = document.createElement('li');
                    let a  = document.createElement('a');
                    a.href = '#';
                    a.text = content.title;
                    a.dataset.route = content.route;
                    li.appendChild(a);

                    // append element to list
                    this.contentList.appendChild(li);
                });
            });
    }

    onClickContent(event)
    {
        // this method query the website to get the content of the selected
        // page and then build a form
        // const form = new Form();

        fetch('/admin/content/form/' + event.target.dataset.route)
            .then(response => response.text())
            .then(text => {
                this.adminOutput.innerHTML = text;
            });
            // .then(response => response.json())
            // .then(content  => form.build(content))
            // .then(form     => this.adminOutput.appendChild(form.form));
    }
}
