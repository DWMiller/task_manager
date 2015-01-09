CORE.createModule('menu', function(c) {
    'use strict';

    var p_properties = {
        id: 'menu',
        selector: 'menu',
        listeners: {}
    };

    var elements = {};

    /************************************ MODULE INITIALIZATION ************************************/

    function p_initialize(scope) {
        elements = {
            //should not reference elements in different scope, use framework event instead
            'menu-toggle': document.getElementById('menu-toggle'),
            'main': document.getElementById('main')
        };
        bindEvents();
    }

    function p_destroy() {
        unbindEvents();
        elements = null;
    }

    function bindEvents() {
        c.dom.listen(elements['menu-toggle'], 'click', toggleMenu);
    }

    function unbindEvents() {
        c.dom.ignore(elements['menu-toggle'], 'click', toggleMenu);
    }

    /************************************ GENERAL FUNCTIONS ************************************/

    function toggleMenu() {
        c.dom.toggleClass(elements.main, 'menu-active');
    }

    return {
        properties: p_properties,
        initialize: p_initialize,
        destroy: p_destroy,
    };

});
