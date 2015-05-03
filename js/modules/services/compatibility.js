dmf.createModule('compatibility', function(c, config) {
    'use strict';

    var properties = {
        listeners: {
            'compatibility-check': compatibilityCheck
        }
    };

    /******************************* Framework Listeners **********************/

    function compatibilityCheck() {
        // if (!c.data.project.settings) {
        //This is temporary to ensure old projects get their data format updated

        c.data.project.settings = {
            font: {
                size: 12,
                face: "Open-sans, Verdana, sans-serif"
            },
            nodes: {
                radius: 40,
                borderWidth: 3
            },
            edges: {
                width: 2
            },
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
        // }
    }

    return {
        properties: properties,
    };

});
