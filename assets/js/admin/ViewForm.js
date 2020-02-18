export class ViewForm {
    constructor()
    {
        this.form = document.createElement('div');
        this.form.id = 'viewForm';
    }

    bind(form, parent)
    {
        this.form.innerHTML = form;
        parent.appendChild(this.form);

        document
            .getElementById('addContentType')
            .addEventListener('click', this.onClickAddContentType.bind(this));
        document
            .getElementById('submitButton')
            .addEventListener('click', this.onClickSubmit.bind(this));
        document
            .getElementById('cancelButton')
            .addEventListener('click', this.onClickCancel.bind(this));
    }

    onClickAddContentType(event)
    {
        // TODO: handle click on addContentType button
        event.preventDefault();
        let li    = document.createElement('li');
        let input = document.createElement('input');

        input.setAttribute('type', 'text');
        input.setAttribute('name', 'view[content_type][]');

        li.appendChild(input);
        document.getElementById('contentTypeList').appendChild(li);

        console.log('caca');
    }

    onClickCancel(event)
    {
        // TODO: cancel
        event.preventDefault();
    }

    onClickSubmit(event)
    {
        // TODO: submit the form
        event.preventDefault();
    }
}
