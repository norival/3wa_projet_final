export class Utils {
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
}
