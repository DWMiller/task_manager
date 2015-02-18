dmf.createModule('menu-project', function(c) {
    'use strict';

    var p_properties = {
        id: 'menu-project',
        selector: 'menu-project',
        listeners: {
            'project-opened': projectOpened
        }
    };

    var elements = {};

    /************************************ MODULE INITIALIZATION ************************************/

    function p_initialize(scope) {
        elements['project-name'] = document.getElementById('project-name');        
        bindEvents();
    }

    function p_destroy() {
        unbindEvents();
        elements = null;
    }

    function bindEvents() {
        c.dom.listen(elements['project-name'],'blur', nameChange);
    }

    function unbindEvents() {
        c.dom.listen(elements['project-name'],'blur', nameChange);
    }

    /******************************* Framework Listeners **********************/

    function projectOpened() {
        elements['project-name'].innerHTML = (c.data.project.projectName || 'Unnamed Project');
    }

    /************************************ GENERAL FUNCTIONS ************************************/

    function nameChange(event) {
        c.data.project.projectName = elements['project-name'].innerHTML;
        c.notify('data-changed');
    }

    return {
        properties: p_properties,
        initialize: p_initialize,
        destroy: p_destroy,
    };

});
