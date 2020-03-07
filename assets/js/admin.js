'use strict';

// import css
import '../css/admin.scss';

// import required JS modules
import {AdminController} from './admin/AdminController';

document.addEventListener('DOMContentLoaded', () => {
    // create the controller
    const adminController = new AdminController();

    // start the controller
    adminController.start();
})
