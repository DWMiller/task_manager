dmf.registerModule('loader', function (c, config) {
    'use strict';

    /************************************ MODULE INITIALIZATION ************************************/
    function initialize() {
        c.data.allProjects = {};
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
        listeners: {
            'project-imported': getExistingProjects,
        },
        start: initialize,
    };

});
