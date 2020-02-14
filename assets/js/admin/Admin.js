import {Navigation} from './Navigation';

export class Admin {
    constructor()
    {
        // get the admin output: where I will write stuff
        this.output = document.getElementById('admin-main');

        // instantiate objects
        this.navigation = new Navigation(this.output);
    }

    async start()
    {
        // set the event listeners
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
