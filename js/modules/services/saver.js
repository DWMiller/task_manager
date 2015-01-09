dmf.createModule('saver', function(c, config) {
    'use strict';

    var properties = {
        id: 'saver',
        listeners: {
            'project-started': createNewProject,
            'data-changed': dataChanged
        }
    };


    /************************************ MODULE INITIALIZATION ***************/

    function initialize(scope) {}

    function destroy() {}

    /******************************* Framework Listeners **********************/

    function createNewProject() {
        initializeProject();
        dataChanged();

        c.notify({
            type: 'project-opened',
            data: true
        });
    }

    function dataChanged() {
        c.data.allProjects[c.data.project.projectId] = c.data.project;
        save();

        c.notify({
            type: 'project-saved',
            data: true
        });
    }

    /************************************ GENERAL FUNCTIONS *******************/

    function initializeProject() {
        c.data.project = {
            activated: false,
            projectId: config.namespace + dmf.fn.uniqueIndex(config['id-length']),
            projectName: 'Unnamed Project'
        };
    }

    function save() {
        localStorage.setItem(c.data.project.projectId, JSON.stringify(c.data.project));
    }

    return {
        properties: properties,
        initialize: initialize,
        destroy: destroy,
    };

});
