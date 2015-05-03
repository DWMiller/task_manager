dmf.createModule('menu-project', function(c) {
    'use strict';

    var properties = {
        listeners: {
            'project-opened': projectOpened
        }
    };

    var elements = {};

    /************************************ MODULE INITIALIZATION ************************************/

    function initialize() {
        elements['project-name'] = document.getElementById('project-name');
        elements['colour-picker'] = document.getElementById('colour-picker');
        bindEvents();
    }

    function destroy() {
        unbindEvents();
        elements = null;
    }

    function bindEvents() {
        c.dom.listen(elements['project-name'], 'blur', nameChange);
        c.dom.listen(elements['colour-picker'], 'change', colourChange);
    }

    function unbindEvents() {
        c.dom.ignore(elements['project-name'], 'blur', nameChange);
        c.dom.ignore(elements['colour-picker'], 'change', colourChange);
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

    function colourChange(e) {
        c.data.project.settings.colours.nodes.complete.default = '#' + e.target.value;
        c.notify('data-changed');
    }

    return {
        properties: properties,
        initialize: initialize,
        destroy: destroy,
    };

});
