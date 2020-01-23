/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
import '../css/app.scss';
import '../css/fonts.css';
import 'normalize.css';
// import 'bulma';

import getNiceMessage from './greet';

import ScrollMagic from 'scrollmagic';

// Need jQuery? Install it with "yarn add jquery", then uncomment to import it.
import $ from 'jquery';

console.log(getNiceMessage(5));
