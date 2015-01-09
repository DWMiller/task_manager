CORE.createModule('controller', function(c, config) {
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
        c.startModule('menu');
        c.startModule('menu-load');
        c.startModule('menu-project');
        c.startModule('loader');
        c.startModule('saver');
        c.startModule('viewer');

        c.notify({
            type: 'state-started',
            data: true
        });
    }

    function shutdown() {
        c.stopModule('menu');
        c.stopModule('menu-load');
        c.stopModule('menu-project');
        c.stopModule('loader');
        c.stopModule('saver');
        c.stopModule('viewer');
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
