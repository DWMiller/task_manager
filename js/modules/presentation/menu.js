dmf.createModule('menu', function(c) {
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
            'main': document.getElementById('main'),            
            'project-create': document.getElementById('project-create'),
            'project-import': document.getElementById('project-import'),
            'project-export': document.getElementById('project-export')
        };
        bindEvents();
    }

    function p_destroy() {
        unbindEvents();
        elements = null;
    }

    function bindEvents() {
        c.dom.listen(elements['menu-toggle'], 'click', toggleMenu);
        c.dom.listen(elements['project-create'], 'click', projectCreate);
        c.dom.listen(elements['project-import'], 'click', projectImport);
        c.dom.listen(elements['project-export'], 'click', projectExport);
    }

    function unbindEvents() {
        c.dom.ignore(elements['menu-toggle'], 'click', toggleMenu);
        c.dom.ignore(elements['project-create'], 'click', projectCreate);
        c.dom.ignore(elements['project-import'], 'click', projectImport);
        c.dom.ignore(elements['project-export'], 'click', projectExport);
    }

    /************************************ GENERAL FUNCTIONS ************************************/


    function projectCreate() {
        c.notify({
            type: 'project-started',
            data: true
        });
    }

    function projectImport() {

    }

    function projectExport() {

    }


    function toggleMenu() {
        c.dom.toggleClass(elements.main, 'menu-active');
    }

    return {
        properties: p_properties,
        initialize: p_initialize,
        destroy: p_destroy,
    };

});
