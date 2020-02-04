export class Navigation {
    constructor()
    {
        this.element = document.getElementById('admin-navigation');
        this.content = null;
    }

    async render()
    {
        const contentList = await this.getContentList();

        const list = document.getElementById('content-list');
        list.innerHTML = '';
        // ul.textContent = 'caca';

        contentList.forEach((content) => {
            let li = document.createElement('li');
            let a  = document.createElement('a');
            a.href = '/admin/' + content.route;
            a.text = content.title;
            li.appendChild(a);
            // li.textContent = content;
            list.appendChild(li);
        });
    }

    async getContentList()
    {
        // use await to wait for the response of the async function
        let response = await fetch('/admin/list-content');
        let json = await response.json();

        return json;
    }
}
