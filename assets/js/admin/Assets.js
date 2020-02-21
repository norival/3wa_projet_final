import {Utils} from '../utils/Utils';

export class Assets {
    constructor(parentElement)
    {
        this.parentElement = parentElement;
    }

    list()
    {
        fetch('/admin/asset')
            .then(response => response.json())
            .then(data => {
                Utils.clear(this.parentElement);

                const ul = document.createElement('ul');
                data.forEach(element => {
                    let li = document.createElement('li');
                    let a  = document.createElement('a');

                    a.text              = `${element.name} (${element.file_type})`;
                    a.href              = '#';
                    a.dataset.contentId = element.id;
                    a.addEventListener('click', this.onClickAsset.bind(this));

                    li.appendChild(a)
                    ul.appendChild(li);
                });
                // ul.addEventListener('click', this.onClickContent.bind(this));

                this.parentElement.appendChild(ul);
            })
    }

    onClickAsset(event)
    {
        // TODO handle asset management
        event.preventDefault();

        console.log(event.target.dataset.contentId);
    }
}
