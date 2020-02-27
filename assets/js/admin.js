'use strict';

// import Vue from 'vue';
// import Admin from './components/Admin';
// import {Admin} from './admin/Admin';
import {AdminController} from './admin/AdminController';
import {AdminModel} from './admin/AdminModel';
import {AdminView} from './admin/AdminView';
// import {Router} from './router/Router';
import '../css/admin.scss';

document.addEventListener('DOMContentLoaded', () => {
    // const admin = new Admin();
    const admin = new AdminController(new AdminView(), new AdminModel());

    // const router = new Router();

    // admin.start();
    // console.log(admin.getMessage());
    // admin.setMessage('caca');
    // console.log(admin.getMessage());

    // var app = new Vue({
    //     el: '#app',
    //     render : h => h(Admin)
    // });
})
