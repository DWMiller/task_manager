dmf.registerModule('controller', function (c, config) {
    'use strict';

    function destroy() {
        c.stopAllModules();
    }

    function startup() {

        c.startModules(['compatibility',
            'menu',
            'viewer',
            'menu-load',
            'menu-project',
            'loader',
            'saver',
            'node-editor'
        ]);

        c.notify('state-started');
    }

    function shutdown() {

        c.stopModules(['compatibility',
            'menu',
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
        listeners: {
            'state-startup': startup,
            'state-shutdown': shutdown,
            'state-restart': restart
        },
        start: startup,
        stop: destroy
    };

});
