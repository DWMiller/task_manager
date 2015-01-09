dmf.createModule('menu-load', function(c) {
    'use strict';

    var p_properties = {
        id: 'menu-load',
        selector: 'menu-load',
        listeners: {
            'projects-loaded': populateProjects,
            'project-saved': populateProjects, // This is fairly intensive, don't do it or do differently
        }
    };

    var elements = {};

    /************************************ MODULE INITIALIZATION ************************************/

    function p_initialize(scope) {
        elements = {
            // 'project-open': document.getElementById('project-open'),
            'project-list': document.getElementById('existing-projects')
        };
        bindEvents();
    }

    function p_destroy() {
        unbindEvents();
        elements = null;
    }

    function bindEvents() {
        c.dom.listen(elements['project-list'], 'change', projectOpen);
    }

    function unbindEvents() {
        c.dom.ignore(elements['project-list'], 'change', projectOpen);
    }

    /************************************ GENERAL FUNCTIONS ************************************/

    function clearList() {
        c.dom.emptyNode(elements['project-list']);
    }


    function populateProjects() {
        clearList();
        for (var project in c.data.allProjects) {
            addProjectToList(c.data.allProjects[project]);
        }
    }

    function addProjectToList(project) {
        var option = document.createElement("option");
        option.text = (project.projectName || 'Unnamed Project');//project.projectId;
        option.value = project.projectId;
        elements['project-list'].appendChild(option);
    }

    function projectOpen(event) {
        var selectedIndex = elements['project-list'].selectedIndex;
        var projectId = elements['project-list'][selectedIndex].value;
        c.data.project = c.data.allProjects[projectId];

        c.notify({
            type: 'project-opened',
            data: true
        });
    }

    return {
        properties: p_properties,
        initialize: p_initialize,
        destroy: p_destroy,
    };

});
