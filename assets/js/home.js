'use strict';

import ScrollMagic from 'scrollmagic';

import '../css/home.scss';

// console.log('homepage');


// init controller
// var controller = new ScrollMagic.Controller();

// create a scene
// new ScrollMagic.Scene({
//     duration: 100, // the scene should last for a scroll distance of 100px
//     offset: 50 // start this scene after scrolling for 50px
// })
//     .setPin('nav') // pins the element for the the scene's duration
//     .addTo(controller); // assign the scene to the controller

// let onScrollDocument = function () {
//     console.log('caca');
//     let nav = document.querySelector('nav');

//     nav.classList.remove('hidden');
// }

document.addEventListener('DOMContentLoaded', () => {
    console.log('caca');

    // document.addEventListener('scroll', onScrollDocument);
    let canvas = document.querySelector('.lines');
    let ctx = canvas.getContext('2d');

    ctx.fillStyle = 'orange';
    ctx.fillRect(10, 10, 100, 50);
})
