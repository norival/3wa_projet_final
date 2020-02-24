export class View {
    constructor(outputElement)
    {
        this.parentElement = outputElement;
    }

    list(output)
    {
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
                    output.appendChild(li);
                });
            });
    }
}
