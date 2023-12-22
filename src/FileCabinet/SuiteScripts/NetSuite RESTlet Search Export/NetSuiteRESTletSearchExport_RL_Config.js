/**
 * @NApiVersion 2.1
 */
define([],

    () => {

        const PARAMETERS = {
            APP: {},
            SCRIPT_PARAMETERS: {}
        };

        // App
        PARAMETERS.APP.NAME = 'NetSuite RESTlet Search Export';

        // Script Parameters
        PARAMETERS.SCRIPT_PARAMETERS.SAVED_SEARCH =
            'custscript_ns_restlet_search_exp_rl_ss';

        return PARAMETERS;
    });
