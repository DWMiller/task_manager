dmf.registerModule('node-editor', function (c) {
    'use strict';

    var elements = {},
        selectedNode;

    var state = {
        parentSelectionMode: false
    };

    /************************************ MODULE INITIALIZATION ************************************/

    function initialize() {
        elements = {
            'editor': document.getElementById('node-editor'),
            'hide': document.getElementById('editor-hide'),
            'node-data': document.getElementById('node-data'),
            'node-commands': document.getElementById('node-commands'),
            'node-createChild': document.getElementById('node-createChild'),
            'node-delete': document.getElementById('node-delete'),
            'node-move': document.getElementById('node-move'),
            'node-label': document.getElementById('node-label'),
            'node-description': new Quill('#node-description--editor', {
                theme: 'snow'
            }),

            'node-status': document.getElementById('node-status'),
            'node-importance': document.getElementById('node-importance'),
        };

        elements['node-description'].addModule('toolbar', {
            container: '#node-description--toolbar'
        });

        bindEvents();
    }

    function destroy() {
        unbindEvents();
        elements = null;
    }

    /******************************* Framework Listeners **********************/

    /************************************ GENERAL FUNCTIONS ************************************/



    return {
        listeners: {
            'project-opened': projectOpened,
            'node-selected': nodeSelected,
            'node-deselected': hideEditor
        },
        start: initialize,
        stop: destroy,
    };

});
