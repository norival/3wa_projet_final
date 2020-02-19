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
}
