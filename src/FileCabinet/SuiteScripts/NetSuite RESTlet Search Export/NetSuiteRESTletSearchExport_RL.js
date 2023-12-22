/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define([
            'N/runtime',
            './NetSuiteRESTletSearchExport_RL_Config',
            'N/log',
            'N/search',
            'N/error'
    ],

    (
        runtime,
        CONFIG,
        log,
        search,
        error
    ) => {
            /**
             * Defines the function that is executed when a GET request is sent to a RESTlet.
             * @param {Object} requestParams - Parameters from HTTP request URL; parameters passed as an Object (for all supported
             *     content types)
             * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
             *     Object when request Content-Type is 'application/json' or 'application/xml'
             * @since 2015.2
             */
            const get = (requestParams) => {
                    const parameters = getScriptParameters();
                    const limit = requestParams.limit === 'true';
                    let from, to = false;

                    if(limit) {
                            from = parseInt(requestParams.from, 10);
                            to = parseInt(requestParams.to, 10);

                            if(isNaN(from) || isNaN(to)) {
                                    throw new error.create({
                                            name: 'INVALID_PARAMETER',
                                            message: 'From/To parameter is not in valid format.',
                                            notifyOff: false
                                    });
                            }

                            log.debug({
                                    title: CONFIG.APP.NAME,
                                    details: `Limit from ${requestParams.from} to ${requestParams.to}`
                            });
                    }

                    const savedSearchResults = getSavedSearchResults(
                        parameters[CONFIG.SCRIPT_PARAMETERS.SAVED_SEARCH],
                        limit,
                        from,
                        to
                    );

                    log.debug({
                            title: CONFIG.APP.NAME,
                            details: `${savedSearchResults.length} saved search results returned for 
                                    Saved Search ID: ${parameters[CONFIG.SCRIPT_PARAMETERS.SAVED_SEARCH]}`
                    });

                    return JSON.stringify(savedSearchResults);

            }

            const getSavedSearchResults = (savedSearchId, limit, from, to) => {
                    let result = [];
                    let savedSearch;

                    if(limit) {
                            savedSearch = loadSearchLimit(savedSearchId, from, to);
                    } else {
                            savedSearch = loadSearch(savedSearchId);
                    }


                    savedSearch.rows.forEach(savedSearchResult => {
                            let object = {};

                            savedSearch.columns.forEach(column => {
                                    object[column.label] = savedSearchResult.getValue({name: column})
                            });

                            result.push(object)
                    });

                    return result;
            }

            const getScriptParameters = () => {
                    let parameters = {};
                    const script = runtime.getCurrentScript();

                    parameters[CONFIG.SCRIPT_PARAMETERS.SAVED_SEARCH] =
                        script.getParameter({name: CONFIG.SCRIPT_PARAMETERS.SAVED_SEARCH});


                    if(isEmpty(parameters[CONFIG.SCRIPT_PARAMETERS.SAVED_SEARCH])) {
                            throw new error.create({
                                    name: 'INVALID_PARAMETER',
                                    message: 'The ' +
                                        CONFIG.SCRIPT_PARAMETERS.SAVED_SEARCH +
                                        ' script parameter is not in a valid format.',
                                    notifyOff: false
                            });
                    }

                    log.debug({
                            title: CONFIG.APP.NAME,
                            details: 'Script Parameters: ' + JSON.stringify(parameters)
                    });

                    return parameters;

            }

            const loadSearch = (searchId) => {
                    const savedSearch = search.load({
                            id : searchId,
                    });

                    let result = [];
                    let count = 0;
                    const pageSize = 1000;
                    let start = 0;

                    do {
                            const resultSet = savedSearch.run().getRange({
                                    start : start,
                                    end : start + pageSize
                            });

                            result = result.concat(resultSet);
                            count = resultSet.length;
                            start += pageSize;

                    } while (count === pageSize);

                    return { columns: savedSearch.columns, rows: result};
            }

            const loadSearchLimit = (searchId, from, to) => {
                    const savedSearch = search.load({
                            id : searchId,
                    });

                    let result = [];
                    let count = 0;
                    let pageSize = 1000;
                    let start = from;
                    let limit = to - from;

                    if(limit <= pageSize) {
                            pageSize = limit;
                    }

                    do {
                            const resultSet = savedSearch.run().getRange({
                                    start: start,
                                    end: start + pageSize
                            });

                            log.debug({
                                    title: 'LIMIT',
                                    details: `Limit ${start} - ${start+pageSize} count: ${count} pageSize: ${pageSize} limit: ${limit}`
                            })


                            result = result.concat(resultSet);
                            count = resultSet.length;
                            start += pageSize;

                    } while (count === pageSize && result.length < limit);

                    return { columns: savedSearch.columns, rows: result};
            }

            const isEmpty = (f) => {
                    return (f==null||f=='');
            }

            return {get}

    });
