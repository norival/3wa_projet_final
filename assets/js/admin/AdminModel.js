/**
 * The model component for the admin MVC app
 */
export class AdminModel {
    /**
     * Create the AdminModel
     */
    constructor()
    {
    }


    /***************************************************************************
     * Methods to fetch data and post data
     *
     * These methods use the fetch API to fetch data from the database or to
     * post data
     **************************************************************************/

    /***************************************************************************
     * Methods related to user data
     */

    /**
     * Get informations about the current user
     *
     * @param {function} callback The function to call when data has been received
     */
    getUser(callback)
    {
        fetch('/admin/user')
            .then(response => response.json())
            .then(userData => callback(userData));
    }


    /***************************************************************************
     * Methods related to help data
     */

    /**
     * Fetch help data for a given name
     *
     * @param {string} locale The locale of the documentation to retrieve
     * @param {string} name The name of the documentation to retrieve
     */
    getHelpData(locale, name)
    {
        fetch(`doc/${locale}/${name}`)
            .then(response => response.json())
            .then(helpData => {
                this.onHelpDataReceived(helpData);
            })
    }


    /***************************************************************************
     * Methods related to collection data
     */

    /**
     * Fetch the list of available collections
     *
     * @param {{page: int, itemsPerPage: integer}} pagination Pagination state
     * @param {function} callback The function to call when data has been
     * received
     */
    listCollections(pagination, callback)
    {
        // build request URL
        const url = '/collection/list?' + new URLSearchParams(pagination);

        // fetch data from website and store the promise in this.collections
        fetch(url)
            .then(response => response.json())
            .then(paginator => {
                // tell the controller to refresh the collection
                callback(paginator.results, paginator.state);
            });
    }

    /**
     * Search collections from the database
     *
     * @param {Object} query The query to look for
     */
    searchCollection(query)
    {
        fetch('/collection/search?' + new URLSearchParams(query))
            .then(response => response.json())
            .then(paginator => {
                this.onCollectionsListDataReceived(paginator.results, paginator.state);
            });
    }

    /**
     * Get collection data from the database and call the given callback
     *
     * @param {int} collectionId The id of the collection to get
     * @param {function} callback The function to call when data has been
     * received
     */
    getCollectionData(collectionId, callback)
    {
        fetch(`/collection/${collectionId}`)
            .then(response => response.json())
            .then(collectionData => {
                callback(collectionData);
            });
    }

    /**
     * Submit the form to update a collection
     *
     * @param {number} collectionId The id of the collection for which the form is submitted
     * @param {object} formData The formated form data
     */
    submitCollectionForm(collectionId, formData, callback)
    {
        let url    = '/admin/collection/' + collectionId;
        let method = 'PUT';

        if (!collectionId) {
            // generate URL to create a new collection
            url    = '/admin/collection/new';
            method = 'POST';
        }

        fetch(url, {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            // .then(response => response.json())
            .then(response => {
                // TODO If the server returns an error, display the form and the validation errors
                callback(response);
            })
    }

    /**
     * Remove content from the collection specified with collectionId
     *
     * @param {number[]} contentIds The ids of the content to remove
     * @param {number} collectionId The id of the collection for which the form is submitted
     * @param {function} callback The function to call when response has been received
     */
    removeContentFromCollection(contentIds, collectionId, callback)
    {
        fetch(`admin/collection/${collectionId}/content`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contentIds)
        })
            .then(() => {
                callback(collectionId);
            })
    }

    /**
     * Add a content to a collection
     *
     * @param {number} collectionId The id of the collection for which content is added
     * @param {number[]} contentIds The id(s) of the content(s) added
     * @param {function} callback The function to call when response has been received
     */
    addContentToCollection(collectionId, contentIds, callback)
    {
        fetch(`admin/collection/${collectionId}/content`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contentIds)
        }).then(
            response => response.json()
        ).then(collectionId => {
            callback(collectionId);
        });
    }

    /**
     * Delete a collection
     *
     * @param {number} collectionId The id of the collection to delete
     * @param {function} callback The function to call when request is finished
     */
    deleteCollection(collectionId, callback)
    {
        fetch(`admin/collection/${collectionId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(collectionId)
        }).then(
            response => {
                if (response.ok) {
                    callback();
                }
            });
    }



    /***************************************************************************
     * Methods related to content data
     */

    /**
     * Fetch the list of available collections
     *
     * @param {{page: int, itemsPerPage: integer}} pagination Pagination state
     * @param {function} callback The function to call when response has been received
     */
    listContent(pagination, callback)
    {
        // build request URL
        const url = '/content/list?' + new URLSearchParams(pagination);

        // fetch data from website and store the promise in this.collections
        fetch(url)
            .then(response => response.json())
            .then(paginator => {
                callback(paginator.results, paginator.state);
            });
    }

    /**
     * Search content from the database
     *
     * @param {Object} query The query to look for
     * @param {function} callback The function to call when response has been received
     */
    searchContent(query, callback)
    {
        fetch('/content/search?' + new URLSearchParams(query))
            .then(response => response.json())
            .then(paginator => {
                callback(paginator.results, paginator.state);
            });
    }

    /**
     * Get data for a given content
     *
     * @param {number} contentId The id of the content to fetch
     * @param {function} callback The function to call when data has been received
     */
    getContentData(contentId, callback)
    {
        fetch(`/content/${contentId}`)
            .then(response => response.json())
            .then(contentData => {
                callback(contentData);
            });
    }

    /**
     * Submit form to edit a content
     *
     * @param {?number} contentId The id of the content to edit
     * @param {?Object} formData The data to send
     * @param {function} callback The function to call when data has been sent
     * @param {int} collectionId The id of the collection to which content belong
     */
    submitContentForm(contentId, formData, callback, collectionId)
    {
        console.log(formData);
        let url    = '/admin/content/' + contentId;
        let method = 'PUT';

        if (!contentId) {
            // generate URL to create a new content
            url    = '/admin/content/new';
            method = 'POST';
        }

        fetch(url, {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            // .then(response => response.json())
            .then(response => {
                // TODO If the server returns an error, display the form and the validation errors
                callback(response, collectionId);
            })
    }

    /**
     * Delete a content from the database
     *
     * @param {number} contentId The id of the content to delete
     * @param {function} callback The function to call when request is finished
     */
    deleteContent(contentId, callback)
    {
        fetch('/admin/content/' + contentId, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(response => {
                if (response.ok) {
                    callback();
                }
            })
    }


    /***************************************************************************
     * Methods to bind handlers
     *
     * These methods are called by the controller to bind callbaks used when
     * events happen (for example: when data have been received)
     **************************************************************************/

    /***************************************************************************
     * Handlers related to help data
     */

    /**
     * Bind the controller callback to use when the help data has been received
     *
     * @param {function} callback The callback to bind
     */
    bindHelpDataReceived(callback)
    {
        this.onHelpDataReceived = callback;
    }


    /***************************************************************************
     * Handlers related to collection data
     */

    /**
     * Bind the controller callback to use when the list of collection has been
     * loaded
     *
     * @param {function} callback The callback to bind
     */
    bindCollectionsListDataReceived(callback)
    {
        this.onCollectionsListDataReceived = callback;
    }


    /***************************************************************************
     * Handlers related to content data
     */
}
