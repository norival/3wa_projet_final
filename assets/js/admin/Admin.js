import {Navigation} from './Navigation';

export class Admin {
    constructor()
    {
        this.navigation = new Navigation();
        this.element    = document.getElementById('admin-main');
    }

    async start()
    {
        this.navigation.render();
    }

    getMessage()
    {
        return this.message;
    }

    setMessage(message)
    {
        this.message = message;

        return this;
    }
}
