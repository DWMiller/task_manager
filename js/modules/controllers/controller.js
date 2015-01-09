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
    }

    function shutdown() {
        c.stopModule('menu');
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
