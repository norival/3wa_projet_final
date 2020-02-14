// import deepForEach from 'deep-for-each';
import traverse from 'traverse';

export class Form {
    constructor()
    {
        this.form = document.createElement('form');
        this.form.setAttribute('method', 'post');
    }

    build(content)
    {
        // console.log(content);
        // content.forEach(caca => console.log(caca))
        // for (let [key, value] of Object.entries(content)) {
        // deepForEach(content, (value, key, subject, path) => {
        //     console.log(`${path}:`, value);
        // });
        // traverse(content).forEach(function(node) {
        //     if (node.isLeaf) {
        //         console.log('caca');
        //     }
        // });
        this.buildFields(content);

        // for (let key in content) {
            // console.log(`${key}: ${content[key]}`);
            // console.log(content[key]);
            // this.buildField(content[key]);
        // }
        // let fieldset = document.createElement('fieldset')

        // let ul = document.createElement('ul');
        // let li = document.createElement('li');
        // let title = document.createElement('input');
        // title.setAttribute('type', 'text');
        // title.setAttribute('name', 'title');
        // title.value = content.title;
        // li.appendChild(title);
        // ul.appendChild(li);
        // fieldset.appendChild(ul);

        // this.form.appendChild(fieldset);
        // console.log(traverse);
        
        return this;
    }

    buildFields(object)
    {
        for (let [key, value] of Object.entries(object)) {
            // console.log(`typeof ${value}: ${typeof(value)}`);
            if (value !== null && typeof(value) === 'object') {
                // console.log(`CREATE NEW FIELDSET: ${key}`);
                let fieldset = document.createElement('fieldset')
                let ul = document.createElement('ul');

                fieldset.setAttribute('name', key);

                // let li = document.createElement('li');
                // let input = document.createElement('input');
                // input.setAttribute('type', 'text');
                // input.setAttribute('name', key);

                let li = this.buildFields(value);
                console.log(li);
                // ul.appendChild(li);
                // fieldset.appendChild(ul);

                this.form.appendChild(fieldset);

            } else {
                let li = document.createElement('li');
                let input = document.createElement('input');
                input.setAttribute('type', 'text');
                input.setAttribute('name', key);
                input.value = value;

                li.appendChild(input);

                return li;

                // console.log(`${key}: ${value}`);
            }
        }
    }
}
