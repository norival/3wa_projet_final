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
     * Format a Date object to date and time
     *
     * @param {Date|string} dateTime The date to format
     * @returns {string} The formated dateTime
     */
    static formatDate(dateTime)
    {
        // TODO fix this method
        if (!(dateTime instanceof(Date))) {
            dateTime = new Date(dateTime);
        }

        return `
            ${dateTime.getFullYear()}/${dateTime.getMonth()}/${dateTime.getDay()}
            at ${dateTime.getHours()}:${dateTime.getMinutes()}
        `;
    }
}
