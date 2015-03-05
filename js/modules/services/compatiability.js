dmf.createModule('compatibility', function(c, config) {
    'use strict';

    var properties = {
        id: 'compatibility',
        listeners: {
            'compatibility-check': compatibilityCheck
        }
    };

    /************************************ MODULE INITIALIZATION ************************************/

    function initialize() {}

    function destroy() {}

    /******************************* Framework Listeners **********************/

    function compatibilityCheck() {
        if (!c.data.project.settings) {
            //This is temporary to ensure old projects get their data format updated
            c.data.project.settings = {
                colours: {
                    font: "#000000",
                    edge: '#8E44AD',
                    nodes: {
                        incomplete: {
                            default: '#F39C12',
                            selected: '#E67E22',
                            border: '#BDC3C7',
                        },
                        complete: {
                            default: '#2ecc71',
                            selected: '#27ae60',
                            border: '#BDC3C7',
                        }
                    }
                },
            };
        }
    }

    /************************************ GENERAL FUNCTIONS ************************************/


    return {
        properties: properties,
        initialize: initialize,
        destroy: destroy,
    };

});
