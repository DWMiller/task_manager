CORE.createModule('viewer', function(c) {
    'use strict';

    var properties = {
        id: 'viewer',
        selector: 'viewer',
        listeners: {
            'project-opened': projectOpened
        }
    };

    var elements = {};

    /************************************ MODULE INITIALIZATION ************************************/

    function initialize(scope) {
        elements = {
            // 'menu-toggle': document.getElementById('menu-toggle'),
        };
        bindEvents();
    }

    function destroy() {
        unbindEvents();
        elements = null;
    }

    function bindEvents() {
        // c.dom.listen(elements['menu-toggle'], 'click', toggleMenu);
    }

    function unbindEvents() {
        // c.dom.ignore(elements['menu-toggle'], 'click', toggleMenu);
    }

    /******************************* Framework Listeners **********************/
    function projectOpened() {
        
    }
    /************************************ GENERAL FUNCTIONS ************************************/

    return {
        properties: properties,
        initialize: initialize,
        destroy: destroy,
    };

});
