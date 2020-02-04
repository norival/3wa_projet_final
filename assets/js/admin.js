'use strict';

// import Vue from 'vue';
// import Admin from './components/Admin';
import {Admin} from './admin/Admin';

document.addEventListener('DOMContentLoaded', () => {
    const admin = new Admin();

    admin.start();
    // console.log(admin.getMessage());
    // admin.setMessage('caca');
    // console.log(admin.getMessage());

    // var app = new Vue({
    //     el: '#app',
    //     render : h => h(Admin)
    // });
})
