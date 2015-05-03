dmf.createModule('loader', function(c, config) {
    'use strict';

    var properties = {
        listeners: {
            'project-imported': getExistingProjects
        }
    };

    /************************************ MODULE INITIALIZATION ************************************/

    function initialize() {
        getExistingProjects();
    }


    /************************************ GENERAL FUNCTIONS ************************************/

    function getExistingProjects() {
        var filenameRegex = new RegExp(config.namespace);

        c.data.allProjects = {};

        for (var i = 0; i < localStorage.length; i++) {
            var projectId = localStorage.key(i);
            if (filenameRegex.test(projectId)) {
                var project = JSON.parse(localStorage.getItem(projectId));
                c.data.allProjects[projectId] = project;
            }
        }

        c.notify('projects-loaded');
    }

    return {
        properties: properties,
        initialize: initialize,
    };

});
