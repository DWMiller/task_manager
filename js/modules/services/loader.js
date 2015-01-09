dmf.createModule('loader', function(c, config) {
    'use strict';

    var properties = {
        id: 'loader',
        listeners: {}
    };



    /************************************ MODULE INITIALIZATION ************************************/

    function initialize(scope) {
        getExistingProjects();
    }

    function destroy() {}


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

        c.notify({
            type: 'projects-loaded',
            data: true
        });
    }

    return {
        properties: properties,
        initialize: initialize,
        destroy: destroy,
    };

});
