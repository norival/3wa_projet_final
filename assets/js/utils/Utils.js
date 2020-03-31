export class Utils {
    /**
     * Capitalize first letter of string
     *
     * @param {string} string The string to capitalize
     *
     * @returns {string}
     */
    static capitalizeFirst(string)
    {
        return string[0].toUpperCase() + string.slice(1);
    }

    /**
     * Clear 
     *
     * @returns {undefined}
     */
    static clear(element)
    {
        while (element.hasChildNodes()) {
            element.removeChild(element.lastChild);
        }

        return 1;
    }

    /**
     * Create an element and optionnally adds a class (or several classes) and an id
     *
     * @param {string} tag A valid html tag
     * @param {(string|string[])} className A class name or an array of class names
     * @param {string} id An id
     * @return {Element} The created NodeElement
     */
    static createElement(tag, className, id)
    {
        const element = document.createElement(tag);

        if (className) {
            if (!Array.isArray(className)) {
                // put in an array if not already
                className = [className];
            }

            // use spread syntax to assign all classes names
            element.classList.add(...className);
        }

        if (id) {
            element.id = id;
        }

        return element;
    }

    /**
     * Format a Date object to date and time
     *
     * @param {Date|string} dateTime The date to format
     * @returns {string} The formated dateTime
     */
    static formatDate(dateTime)
    {
        if (!(dateTime instanceof(Date))) {
            dateTime = new Date(dateTime);
        }

        return dateTime.toDateString();
    }

    /**
     * Retrieve an element from the DOM
     *
     * @param {string} selector A valid css selector
     * @return {?Element} The corresponding element or null if no element
     * match the selector
     */
    static getElement(selector)
    {
        return document.querySelector(selector);
    }
}
