// import {Form} from './Form';
import {Assets} from './Assets';
import {Content} from './Content';
import {Utils} from '../utils/Utils';
import {View} from './View';

export class Navigation {
    constructor(adminOutput)
    {
        // get the DOM elements
        this.nav         = document.getElementById('admin-navigation');
        this.viewLink    = document.getElementById('views');
        this.contentLink = document.getElementById('content');
        this.assetsLink  = document.getElementById('assets');
        this.adminOutput = adminOutput;
        this.view        = new View(this.adminOutput);

        // add event listener on content list
        this.viewLink.addEventListener('click', this.onClickView.bind(this));
        this.contentLink.addEventListener('click', this.onClickContent.bind(this));
        this.assetsLink.addEventListener('click', this.onClickAssets.bind(this));

        // get content information from database and build content list
        // this.view.list(this.viewList);
    }

    onClickAssets(event)
    {
        event.preventDefault();

        const assets = new Assets(this.adminOutput);
        assets.list();
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
        event.preventDefault();

        Utils.clear(this.adminOutput);

        this.view.home(this.adminOutput);

        // this.view.buildForm(this.adminOutput);
    }
}
