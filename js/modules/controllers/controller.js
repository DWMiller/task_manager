dmf.createModule('controller', function(c, config) {
    'use strict';

    var p_properties = {
        id: 'controller',
        listeners: {
            'state-startup': startup,
            'state-shutdown': shutdown,
            'state-restart': restart
        }
    };

    function p_initialize(scope) {
        startup();
    }

    function p_destroy() {
        c.stopAllModules();
    }

    function startup() {
        c.startModules(['menu',
            'menu-load',
            'menu-project',
            'loader',
            'saver',
            'viewer',
            'node-editor'
        ]);

        c.notify('state-started');
    }

    function shutdown() {

        c.stopModules(['menu',
            'menu-load',
            'menu-project',
            'loader',
            'saver',
            'viewer',
            'node-editor'
        ]);
    }

    function restart() {
        shutdown();
        startup();
    }

    return {
        properties: p_properties,
        initialize: p_initialize,
        destroy: p_destroy,
    };

});
